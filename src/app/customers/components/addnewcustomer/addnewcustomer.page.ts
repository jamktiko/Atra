import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  NgForm,
} from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonList,
  IonListHeader,
  IonModal,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { Customer } from 'src/interface';
import { ModalcustomerPage } from '../modalcustomer/modalcustomer.page';

@Component({
  selector: 'app-addnewcustomer',
  templateUrl: './addnewcustomer.page.html',
  styleUrls: ['./addnewcustomer.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonListHeader,
    IonInput,
    IonItem,
    CommonModule,
    FormsModule,
    IonButton,
    ModalcustomerPage,
    IonLabel,
    IonText,
  ],
})
export class AddnewcustomerPage {
  //ViewChild mahdollistaa sen, että HTML-templaatissa määritelty muuttuja voidaan ottaa ts-tiedostossa käyttöön
  //Tässä tapauksessa form-tagissa määritelty customerForm => mahdollista käyttää tämän tiedoston funktioissa kyseistä formia
  @ViewChild('customerForm') customerForm!: NgForm;

  //Alustaa lomakkeen tyhjänä asiakkaana
  customer: Customer = {
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
  };

  //Hallitsee modalcustomerin näkyvyyttä
  // HTML-templaatissa  @if (openModal) {<app-modalcustomer [newcustomer]="customer" (confirm)="handleConfirm($event)" (cancel)="handleCancel()" [openModal]="openModal"></app-modalcustomer>}
  openModal: boolean = false;

  showModal() {
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
    this.customerForm.resetForm();
  }

  //Lisää asiakkaan: saa modalcustomerilta Outputina tiedon cancel-EventEmitteristä
  //HTML-templaatissa annettu modalcustomerille propsina: (cancel)="handleCancel()"
  //Tarkoitus myöhemmin, että lisää asiakkaan apiservicen kautta
  handleConfirm(data: Customer) {
    console.log('Customer added: ', data);
    this.addNewCustomer(data);
    this.resetForm();
    this.closeModal();
  }

  //Sulkee modaalin: saa modalcustomerilta Outputina tiedon cancel-EventEmitteristä
  //Tarkoituksena että käyttäjä voi vielä muokata asiakkaan tietoja (cancel)="handleCancel()"
  //
  handleCancel() {
    this.openModal = false;
  }

  //Nollaa asiakaslomakkeen sekä cancel että confirm-tapauksissa
  resetForm() {
    this.customer = {
      firstname: '',
      lastname: '',
      email: '',
      phonenumber: '',
    };
  }

  constructor() {}

  //Käsittelee apiservicen kautta uuden asiakkaan lisäämisen, kun siirrytään oikean datan liikkumiseen
  addNewCustomer(data: Customer) {
    //   this.apiService.addNewCustomer(customer).subscribe({
    //     next: (addcustomer) => {
    //       console.log('Customer added successfully');
    //     },
    //     error: (err) => {
    //       console.error('Something went wrong: ', err);
    //     },
    //   });
    // }
  }
}
