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
  styleUrls: ['./addnewcustomer.page.scss'],
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
  @ViewChild('customerForm') customerForm!: NgForm;

  customer: Customer = {
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
  };
  //Validators-form validation > jos siirrytään tähän
  // customerForm = new FormGroup({
  //   firstname: new FormControl(this.customer.firstname, [
  //     Validators.required,
  //     Validators.minLength(2),
  //   ]),
  //   lastname: new FormControl(this.customer.lastname, [
  //     Validators.required,
  //     Validators.minLength(2),
  //   ]),
  //   email: new FormControl(this.customer.email, [
  //     Validators.required,
  //     Validators.email,
  //   ]),
  //   phonenumber: new FormControl(this.customer.phonenumber),
  // });

  openModal: boolean = false;

  showModal() {
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
    this.customerForm.resetForm();
  }

  handleConfirm(data: Customer) {
    console.log('Customer added: ', data);
    this.addNewCustomer(data);
    this.resetForm();
    this.closeModal();
  }

  handleCancel() {
    this.openModal = false;
    this.resetForm();
  }

  resetForm() {
    this.customer = {
      firstname: '',
      lastname: '',
      email: '',
      phonenumber: '',
    };
  }

  constructor() {}

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
