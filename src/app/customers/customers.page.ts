import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Customer } from 'src/interface';
import { customers } from 'src/temporarydata';
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSearchbar,
  ],
})
export class CustomersPage implements OnInit {
  searchItem: string = '';
  allcustomers: Customer[] = customers;

  constructor() {}

  filteredCustomers() {
    const search = this.searchItem!.toLowerCase();

    return this.allcustomers.filter(
      (customer) =>
        customer.firstname.toLowerCase().includes(search) ||
        customer.lastname.toLowerCase().includes(search) ||
        customer.email.toLocaleLowerCase().includes(search) ||
        customer.phonenumber.includes(search)
    );
  }

  ngOnInit() {}
}
