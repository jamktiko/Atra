import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonBadge,
  IonLabel,
} from '@ionic/angular/standalone';
import { ModalinkPage } from '../modalink/modalink.page';
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
    NgToastComponent,
    IonContent,
    CommonModule,
    FormsModule,
    IonSearchbar,
    IonSearchbar,
    ModalinkPage,
    IonBadge,
  ],
})
export class AddnewinkPage implements OnInit {
  publicInks: PublicInk[] = [];

  inksToAdd: any = [];
  searchItem: string = '';

  /* Muuttuja, jonka avulla ylläpidetään app-modalink-komponentin näkyvyyttä */
  showReview: boolean = false;

  /**
   * FormGroup, johon tallennetaan valitut musteet eli chosenInks FormArraynaFormGroupeja
   * Eli chosenInks: new FormArray([FormGroup: {inkid: value, productname: value...}])
   * */
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

  loadInks() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/tabs/inks') {
          this.getInks();
        }
      });
  }

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

  // Käsittelee showReview-muuttujan näkyvyyden muuttamalla sen trueksi
  // HTML-templaatissa @if (showReview) { <app-modalink [chosenInks]="getChosenInks()" (cancel)="handleCancel()" (delete)="handleDelete($event)"></app-modalink>}
  review() {
    this.showReview = true;
  }

  //Hoitaa musteiden filtteröinnin: validoi toLowerCasella ja tarkistaa, että search-muuttujan sisältö on product_name, color tai manufacturer-tiedoissa
  //HTML-templaatissa @for (ink of filteredInks(); track ink.id)
  filteredInks(): any {
    const search = this.searchItem.toLowerCase() ?? '';

    return this.publicInks.filter(
      (ink) =>
        ink.product_name.toLowerCase().includes(search) ||
        ink.color.toLowerCase().includes(search) ||
        ink.manufacturer.toLowerCase().includes(search)
    );
  }

  //Palauttaa chosenInks-taulukon formArrayn muodossa
  //Tarkoituksena antaa muille metodeille helppo tapa päästä FormArrayhin käsiksi
  getChosenInks(): FormArray {
    return this.inkGroup.get('chosenInks') as FormArray;
  }

  // Valitsee tietyn musteen HTML-templaatissa ilmaistun buttonin perusteella => sidottu tiettyyn for-loopissa läpikäytyyn musteeseen
  //Ottaa kyseisen musteen tiedot parametrina, ja lisää musteen FormArray
  chooseInk(ink: PublicInk) {
    const inks = this.getChosenInks();

    //Tässä alustetaan FormGroup, jotka muodostavat FormArrayn
    //Eli jokaisessa FormGroupissa on yksittäinen FormControl id, product_name, manufacturer, color, recalled, imageUrl, size & batchnumber
    //Jokainen FormGroup sitten laitetaan push-metodilla FormArrayhin vain, jos kyseistä mustetta ei ole vielä lisätty: if-ehto tarkistaa, löytyykö kyseisellä id:llä jo mustetta taulukosta
    if (!inks.value.some((chosenInk: any) => chosenInk.id === ink.ink_id)) {
      inks.push(
        new FormGroup({
          ink_id: new FormControl(ink.ink_id),
          product_name: new FormControl(ink.product_name),
          manufacturer: new FormControl(ink.manufacturer),
          color: new FormControl(ink.color),
          recalled: new FormControl(ink.recalled),
          image_url: new FormControl(ink.image_url),
          size: new FormControl(ink.size),
          batchnumber: new FormControl('', Validators.required),
        })
      );

      console.log(inks.value);
    } else {
      console.log('Ink already chosen: ', ink.ink_id);
      console.log(inks.value);
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
  handleDelete(inkId: number) {
    const inks = this.inkGroup.get('chosenInks') as FormArray;

    const index = inks.value.indexOf(inkId);

    if (index > -1) {
      //angular equivalent of splice: removes item in array where index matches
      inks.removeAt(index);
      console.log('Removed ink: ', inkId, 'New chosenInks: ', inks.value);
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
    this.router.navigate(['/tabs/inks']);
  }
}
