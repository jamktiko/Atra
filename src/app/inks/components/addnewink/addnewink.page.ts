import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonBadge,
  IonLabel,
  IonModal,
} from '@ionic/angular/standalone';
//import { ModalinkPage } from '../modalink/modalink.page';
import { PublicInk } from 'src/interface';
import { IonSearchbar } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';

@Component({
  selector: 'app-addnewink',
  templateUrl: './addnewink.page.html',
  styleUrls: ['./addnewink.page.css'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonSearchbar,
    IonModal,
  ],
})
export class AddnewinkPage implements OnInit {
  publicInks: PublicInk[] = [];

  inksToAdd: any = [];
  searchItem: string = '';

  /**
   * Variable that manages ionmodal-component visibility: true > visible, false > not visible
   */
  showReview: boolean = false;

  /**
   * FormGroup that keeps track of chosen inks as the chosenInks Form Array of FormGroup,
   * meaning: chosenInks = new FormArray([FormGroup: {inkid: value, productname: value...}])
   */
  inkGroup = new FormGroup({
    chosenInks: new FormArray([]),
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.getInks();
    this.loadInks();
  }

  /**
   * Uses Angular's NavigationEnd to check if a router.events has urlAfterRedirects '/tabs/inks'
   * if TRUE > calls for class method getInks()
   */
  loadInks() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/tabs/inks') {
          this.getInks();
        }
      });
  }

  /**
   * Uses ApiService method getAllPublicInks() to load publicInks to present as a list
   */
  getInks() {
    this.apiService.getAllPublicInks().subscribe({
      next: (data) => {
        this.publicInks = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
      },
    });
  }

  /**NOTE: Code changed to ion-modal and modalink suspended for the moment!
   * HTML-template @if (showReview) { <app-modalink [chosenInks]="getChosenInks()" (cancel)="handleCancel()" (delete)="handleDelete($event)"></app-modalink>}
   */
  review() {
    this.showReview = true;
  }

  /*Manages ink filtering search: validation with toLowerCase to check whether search-variable value is included in
   * ink.manufacturer, ink.color or ink.product_name.
   * HTML-template loops through with @for (ink of filteredInks(); track ink.id) {...}
   */
  filteredInks(): any {
    const search = this.searchItem.toLowerCase() ?? '';
    return this.publicInks.filter(
      (ink) =>
        ink.product_name.toLowerCase().includes(search) ||
        ink.color.toLowerCase().includes(search) ||
        ink.manufacturer.toLowerCase().includes(search)
    );
  }

  /**
   * Returns the value of chosenInks FormArray from inkGroup-FormGroup
   */
  getChosenInks(): FormArray {
    return this.inkGroup.get('chosenInks') as FormArray;
  }
  /**
   * Chooses a specific ink in HTML-template via Select-button. The data of that ink is taken as an argument,
   * and that ink is added to chosenInks-FormArray as a FormGroup via push.
   * Validators.required is used with batchnumber to ensure that batchnumber is given before confirmation, and
   * @if clause in function checks that chosenInk is not already in the FormArray > no duplicates.
   * @param ink: PublicInk; parameter given to function via Select-button when inks are iterated in for-loop
   * No return value, sets the value of chosenInks-FormArray
   */
  chooseInk(ink: PublicInk) {
    const inks = this.getChosenInks();

    if (!inks.value.some((chosenInk: any) => chosenInk.ink_id === ink.ink_id)) {
      inks.push(
        new FormGroup({
          ink_id: new FormControl(ink.ink_id),
          product_name: new FormControl(ink.product_name),
          manufacturer: new FormControl(ink.manufacturer),
          color: new FormControl(ink.color),
          recalled: new FormControl(ink.recalled),
          image_url: new FormControl(ink.image_url),
          size: new FormControl(ink.size),
          batch_number: new FormControl('', Validators.required),
        })
      );
    } else {
      console.log('Ink already chosen: ', ink.ink_id);
      this.toast.info(' is already chosen', ink.product_name);
    }
  }

  // Saa Outputina modalink-komponentilta tiedon cancel-EventEmitterista => käskee tätä komponenttia toteuttamaan handleCancel()
  //HTML-templaatissa tämä on (cancel)="handleCancel()" app-modalink komponentin propseissa
  // Käsittelee showReview-muuttujan näkyvyyden muuttamalla sen falseksi
  handleCancel() {
    this.showReview = false;
  }

  // Saa Outputina modalink-komponentilta tiedon delete-EventEmitteristä => käskee tätä komponenttia toteuttamaan handleDelete()
  // HTML-templaatissa tämä on (delete)="handleDelete($event)" app-modalink-komponentin propseissa
  // Ottaa parametrikseen kyseisen musteen id:n ja käsittelee removeAt (Angularin taulukonpoistometodi) sen indeksin perusteella, jossa id === inkId
  handleDelete(index: number) {
    const inks = this.inkGroup.get('chosenInks') as FormArray;

    if (index > -1 && index < inks.length) {
      //angular equivalent of splice: removes item in array where index matches
      inks.removeAt(index);
      console.log('Removed ink: ', index, 'New chosenInks: ', inks.value);
    }
  }

  getInksToAdd() {
    const inks = this.inkGroup.get('chosenInks') as FormArray;

    const addedInks: { PublicInk_ink_id: number; batch_number: string }[] = [];

    inks.value.forEach((ink: any) => {
      addedInks.push({
        PublicInk_ink_id: ink.ink_id,
        batch_number: ink.batch_number,
      });
    });

    return addedInks;
  }

  handleConfirm() {
    const inkData = this.getInksToAdd();
    console.log('Postin to backend: ', inkData);

    this.apiService.addNewUserInk(inkData).subscribe({
      next: (data) => {
        console.log('Added successfully: ', data);
        this.router.navigate(['/tabs/inks']);
        this.toast.success('Ink added succesfully!');
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
        this.toast.danger('Something went wrong');
      },
    });
  }

  back() {
    // Clear all selections when going back
    const inks = this.getChosenInks();
    while (inks.length > 0) {
      inks.removeAt(0);
    }
    this.router.navigate(['/tabs/inks']);
  }

  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  isFormValid(): boolean {
    const inks = this.getChosenInks();
    return (
      inks &&
      inks.length > 0 &&
      inks.controls.every((control) => control.get('batch_number')?.valid)
    );
  }
}
