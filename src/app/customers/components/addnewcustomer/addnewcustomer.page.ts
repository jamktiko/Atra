import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonList,
  IonListHeader,
  IonModal,
  IonLabel,
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
  ],
})
export class AddnewcustomerPage {
  customer: Customer = {
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
  };

  openModal: boolean = false;

  showModal() {
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  handleConfirm(data: Customer) {
    console.log('Customer added: ', data);
    this.addNewCustomer(data);
    this.resetForm();
    this.openModal = false;
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
