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
  //ViewChild mahdollistaa sen, että HTML-templaatissa määritelty muuttuja voidaan ottaa ts-tiedostossa käyttöön
  //Tässä tapauksessa form-tagissa määritelty customerForm => mahdollista käyttää tämän tiedoston funktioissa kyseistä formia
  @ViewChild('customerForm') customerForm!: NgForm;

  //Alustaa lomakkeen tyhjänä asiakkaana
  customer: CustomerCreation = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: '',
  };

  //Hallitsee modalcustomerin näkyvyyttä
  // HTML-templaatissa
  openModal: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

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
  handleConfirm(data: CustomerCreation) {
    console.log('Customer added: ', data);
    this.addNewCustomer();
    this.closeModal();
  }

  //Sulkee modaalin: saa modalcustomerilta Outputina tiedon cancel-EventEmitteristä
  //Tarkoituksena että käyttäjä voi vielä muokata asiakkaan tietoja (cancel)="handleCancel()"
  //
  handleCancel() {
    this.openModal = false;
  }

  //Nollaa asiakaslomakkeen
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

  /** */
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

  back() {
    this.router.navigate(['/tabs/customers']);
    this.resetForm();
  }
}
