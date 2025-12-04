import { Component, EventEmitter, Output } from '@angular/core';
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
import { CustomerCreation } from 'src/interface';
import { ModalcustomerPage } from '../modalcustomer/modalcustomer.page';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';

@Component({
  selector: 'app-addnewcustomer',
  templateUrl: './addnewcustomer.page.html',
  styleUrls: ['./addnewcustomer.page.css'],
  standalone: true,
  imports: [
    NgToastComponent,
    IonContent,
    CommonModule,
    FormsModule,
    ModalcustomerPage,
    // IonText,
  ],
})
export class AddnewcustomerPage {
  /**
   * ViewChild allows HTML-elements to be used in the template: customerForm from HTML-template becomes
   * available to use in the class this way
   */
  @ViewChild('customerForm') customerForm!: NgForm;

  /**
   * New customer is based on CustomerCreation interface and stated as empty values in the beginning
   */
  customer: CustomerCreation = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: '',
  };

  /**
   * Manages modalcustomer.page visibility: true > visible, false > not visible.
   */
  openModal: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

  /**
   * Manages value of openModal-variable
   * @param isOpen: boolean
   * openModal = true, no return values
   */
  showModal(isOpen: boolean) {
    this.openModal = true;
  }

  /**
   * Manages value of openModal-variable
   */
  closeModal() {
    this.openModal = false;
    this.customerForm.resetForm();
  }

  /** Uses ApiService addNewCustomer()-method to add customer to user's library
   *
   */
  addNewCustomer() {
    this.apiService.addNewCustomer(this.customer).subscribe({
      next: (data) => {
        this.customer = data;
        this.toast.success('Customer added successfully');
        this.router.navigate(['/tabs/customers']);
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
        this.toast.danger('Something went wrong');
      },
    });
  }

  /**
   * Adds new customer with addNewCustomer()-method: HTML-template given props (confirm)="handleConfirm($event)"
   * where $event works as customer's data given as an argument.
   * @param data: CustomerCreation
   */
  handleConfirm(data: CustomerCreation) {
    console.log('Customer added: ', data);
    this.addNewCustomer();
    this.closeModal();
  }

  /**
   * Manages value of openModal-variable, gets information of cancel-EventEmitter as an Output
   * from modalcustomer as a props: (cancel)="handleCancel()"
   * @param isOpen: boolean
   * openModal = false, no return value
   */
  handleCancel(isOpen: boolean) {
    this.openModal = false;
  }

  /**
   * Resets customer-form and returns to empty values
   */
  resetForm() {
    this.customer = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      notes: '',
    };
    this.customer = this.customer;
  }

  /**
   * Redirects user back to customers.page and resets customerform to null values by calling resetForm()
   */
  back() {
    this.router.navigate(['/tabs/customers']);
    this.resetForm();
  }
}
