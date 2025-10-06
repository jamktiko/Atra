import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonModal,
} from '@ionic/angular/standalone';
import { Customer } from 'src/interface';
import { IonSearchbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';

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
    IonModal,
  ],
})
export class CustomersPage implements OnInit {
  searchItem: string = '';

  /**
   * Allcustomers-arvo alustetaan ngOninit-metodissa eli renderöintivaiheessa
   * !-merkintä kertoo Angularille, että arvo kyllä alustetaan ennen kuin muuttujaa käytetään
   *
   */

  allcustomers!: Customer[];

  chosenCustomer: any;
  isModalOpen: boolean = false;

  constructor(private apiService: ApiService) {}

  filteredCustomers() {
    const search = this.searchItem!.toLowerCase();

    return this.allcustomers.filter(
      (customer) =>
        customer.first_name.toLowerCase().includes(search) ||
        customer.last_name.toLowerCase().includes(search) ||
        customer.email.toLocaleLowerCase().includes(search) ||
        customer.phone.includes(search)
    );
  }

  chooseCustomer(isOpen: boolean, customer: any) {
    this.isModalOpen = isOpen;
    this.chosenCustomer = customer;
  }

  setClosed(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  ngOnInit() {
    this.apiService.getAllCustomers().subscribe({
      next: (data) => {
        this.allcustomers = data;
      },
      error: (err) => {
        console.error('Pieleen män, ', err);
      },
    });
  }
}
