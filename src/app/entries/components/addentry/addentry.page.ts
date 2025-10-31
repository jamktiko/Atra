import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { IonContent, IonBadge, IonModal } from '@ionic/angular/standalone';
import { IonSearchbar } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';
import { EntryCreation, UserInk, Customer } from 'src/interface';
import {
  FormsModule,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { Entry } from 'src/interface';
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgOptionComponent,
  NgSelectComponent,
  NgTagTemplateDirective,
} from '@ng-select/ng-select';
import { ModalentryPage } from '../modalentry/modalentry.page';

@Component({
  selector: 'app-addentry',
  templateUrl: './addentry.page.html',
  styleUrls: ['./addentry.page.css'],
  standalone: true,
  imports: [
    NgToastComponent,
    IonContent,
    CommonModule,
    FormsModule,
    IonSearchbar,
    IonBadge,
    NgSelectComponent,
    NgLabelTemplateDirective,

    NgOptionTemplateDirective,
    ModalentryPage,
  ],
})
export class AddentryPage implements OnInit {
  comments: string = '';
  searchInk: string = '';

  /*Annetaan newEntrylle musteiden id-numerot lomakkeeseen
   */
  chosenInkIds: number[] = [];

  /*
   * Kovakoodattu userID, joka tulee myöhemmin Cogniton kautta
   */
  userId: string = 'USR1';

  /*
   * Muuttuja ng-select-komponenttiin asiakkaan hakemiseen ja valitsemiseen
   */
  selectedCustomerId!: number;

  userInks: UserInk[] = [];
  customers: Customer[] = [];
  inksToAdd: any = [];

  newEntry: EntryCreation = {
    entry_date: new Date(),
    comments: '',
    User_user_id: this.userId,
    Customer_customer_id: undefined, //undefined kunnes continue() alustaa
    inks: [],
  };

  /* Muuttuja, jonka avulla ylläpidetään modalentry-komponentin näkyvyyttä */
  showReview: boolean = false;

  showModal(isOpen: boolean) {
    this.showReview = isOpen;
  }

  inkGroup = new FormGroup({
    chosenInks: new FormArray([]),
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.getUserInks();
    this.getCustomers();
  }

  getUserInks() {
    this.apiService.getAllUserInks().subscribe({
      next: (data) => {
        this.userInks = data;
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

  chooseInk(ink: UserInk) {
    const inks = this.getChosenInks();

    if (
      !inks.value.some((chosenInk: any) => chosenInk.id === ink.user_ink_id)
    ) {
      inks.push(
        new FormGroup({
          user_ink_id: new FormControl(ink.user_ink_id),
          batch_number: new FormControl(ink.batch_number),
          opened_at: new FormControl(ink.opened_at),
          expires_at: new FormControl(ink.expires_at),
          favorite: new FormControl(ink.favorite),
          publicink_ink_id: new FormControl(ink.publicink_ink_id),
          product_name: new FormControl(ink.product_name),
          manufacturer: new FormControl(ink.manufacturer),
          color: new FormControl(ink.color),
          recalled: new FormControl(ink.recalled),
          image_url: new FormControl(ink.image_url),
          size: new FormControl(ink.size),
          User_user_id: new FormControl(ink.User_user_id),
        })
      );

      console.log(inks.value);
    } else {
      console.log('Ink already chosen: ', ink.user_ink_id);
      console.log(inks.value);
    }
  }

  getChosenInks(): FormArray {
    return this.inkGroup.get('chosenInks') as FormArray;
  }

  getChosenInkIds(): number[] {
    const inkarray = this.getChosenInks();
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

  getCustomers() {
    this.apiService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
      },
    });
  }

  filteredCustomers(searchCustomer: string, customer: any): boolean {
    const search = searchCustomer.toLowerCase() ?? '';

    return (
      (customer.first_name?.toLowerCase() ?? '').includes(search) ||
      (customer.last_name?.toLowerCase() ?? '').includes(search) ||
      (customer.email?.toLowerCase() ?? '').includes(search)
    );
  }

  testContinue() {
    console.log('Customer id: ', this.selectedCustomerId);
  }

  continue() {
    this.newEntry.Customer_customer_id = this.selectedCustomerId;
    this.newEntry.inks = this.getChosenInkIds();
    this.showModal(true);
    console.log('New entry: ', this.newEntry);
  }

  handleCancel() {
    this.showModal(false);
  }

  handleConfirm(newEntry: EntryCreation) {
    //hakee jokaisen musteen yksitellen, palauttaa tällä hetkellä taulukon observableja
    // const inkArray: any[] = [];
    // newEntry.inks.forEach((ink) => {
    //   inkArray.push(this.apiService.getOneUserInk(ink));
    // });

    // console.log('Ink array: ', inkArray);

    this.addNewEntry(newEntry);
  }

  addNewEntry(newEntry: EntryCreation) {
    this.apiService.addNewEntry(newEntry);
  }
}
