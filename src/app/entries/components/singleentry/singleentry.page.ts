import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonContent, IonModal, IonItem } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Entry, UserInk } from 'src/interface';
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-singleentry',
  templateUrl: './singleentry.page.html',
  styleUrls: ['./singleentry.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgToastComponent,
    IonModal,
    IonSearchbar,
    ReactiveFormsModule,
    IonContent,
  ],
})
export class SingleentryPage implements OnInit {
  @Input() chosenEntry!: Entry;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Entry>();

  inkGroup = new FormGroup({
    chosenInks: new FormArray([]),
  });

  get chosenInks(): FormArray {
    return this.inkGroup.get('chosenInks') as FormArray;
  }

  singleInkGet: any;

  searchInk: string = '';

  userInks: UserInk[] = [];

  showUpdateModal: boolean = false;

  inkModal: boolean = false;

  constructor(
    private apiService: ApiService,
    private toast: NgToastService,
    private router: Router
  ) {}

  toggleInkModal(isOpen: boolean) {
    this.inkModal = isOpen;
  }

  testHere() {
    console.log('Inks to submit: ', this.chosenInks.value);
  }

  ngOnInit() {
    this.getUserInks();
  }

  // ionViewWillEnter() {
  //   console.log('Ion view changed');
  //   this.initializeChosenInks();
  // }

  initializeChosenInks() {
    const formArray = this.chosenInks;
    formArray.clear();

    if (this.chosenEntry) {
      this.chosenEntry.inks.forEach((ink) => {
        formArray.push(
          new FormGroup({
            user_ink_id: new FormControl(ink.user_ink_id),
            product_name: new FormControl(ink.product_name),
            manufacturer: new FormControl(ink.manufacturer),
            color: new FormControl(ink.color),
            image_url: new FormControl(ink.image_url),
          })
        );
      });
    }
  }

  sendClose() {
    this.close.emit();
  }

  sendDelete(chosenEntry: Entry) {
    this.delete.emit(chosenEntry);
    this.close.emit();
  }

  toggleUpdateModal(show: boolean) {
    if (show) {
      this.showUpdateModal = show;
      this.initializeChosenInks();
    } else {
      this.showUpdateModal = show;
    }
  }

  submit(chosenEntry: any) {
    const inkArray = this.getChosenInkIds();

    this.apiService
      .updateEntry(
        chosenEntry.entry_id,
        chosenEntry.entry_date,
        chosenEntry.comments,
        chosenEntry.customer_id,
        inkArray
      )
      .subscribe({
        next: (data) => {
          this.chosenEntry = data;
          console.log('Update success, entry id: ', data.entry_id);
          console.log('Whole entry: ', data);
          this.sendClose();
          this.toggleUpdateModal(false);
          this.toast.success('Entry updated successfully');
          this.router.navigate(['/tabs/entries']);
        },
        error: (err) => {
          console.error('Something went wrong: ', err);
        },
      });
  }

  getUserInks() {
    this.apiService.getAllUserInks().subscribe({
      next: (data) => {
        this.userInks = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
      },
    });
  }

  filteredInks(): any {
    const search = this.searchInk.toLowerCase() ?? '';

    return this.userInks.filter(
      (ink) =>
        ink.product_name.toLowerCase().includes(search) ||
        ink.color.toLowerCase().includes(search) ||
        ink.manufacturer.toLowerCase().includes(search)
    );
  }

  chooseInk(ink: any) {
    const inks = this.chosenInks;

    if (
      !inks.value.some(
        (chosenInk: any) => chosenInk.user_ink_id === ink.user_ink_id
      )
    ) {
      inks.push(
        new FormGroup({
          user_ink_id: new FormControl(ink.user_ink_id),
          product_name: new FormControl(ink.product_name),
          manufacturer: new FormControl(ink.manufacturer),
          color: new FormControl(ink.color),
          image_url: new FormControl(ink.image_url),
        })
      );
      this.toast.primary('Ink added');
    } else {
      console.log('Ink already chosen: ', ink.user_ink_id);
      this.toast.danger('Ink already chosen!');
    }
  }

  getChosenInkIds(): number[] {
    const inkarray = this.chosenInks;
    if (!inkarray) {
      return [];
    } else {
      const inkIds: number[] = [];

      for (let i = 0; i < inkarray.length; i++) {
        const inkGroupInArray = inkarray.at(i) as FormGroup;
        const idNumber = inkGroupInArray.get('user_ink_id')?.value;
        inkIds.push(idNumber);
      }
      console.log(inkIds);
      return inkIds;
    }
  }

  handleInkDelete(index: number) {
    const inksArray = this.chosenInks;
    const user_ink_id = this.chosenInks.value.user_ink_id;

    inksArray.removeAt(index);
    this.chosenEntry.inks = this.chosenEntry.inks.filter(
      (ink) => ink.user_ink_id !== user_ink_id
    );
  }
}
