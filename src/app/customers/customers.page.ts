import { Component, OnInit, Input } from '@angular/core';
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
import { routes } from '../tabs/tabs.routes';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  allcustomers: Customer[] = [];

  chosenCustomer: any;
  isModalOpen: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadCustomers();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/tabs/customers') {
          this.loadCustomers();
        }
      });
  }

  loadCustomers() {
    this.apiService.getAllCustomers().subscribe({
      next: (data) => {
        this.allcustomers = data;
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
      },
    });
  }

  filteredCustomers() {
    const search = this.searchItem.toLowerCase() ?? '';

    return this.allcustomers.filter(
      (customer) =>
        customer.first_name.toLowerCase().includes(search) ||
        customer.last_name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search)
    );
  }

  chooseCustomer(isOpen: boolean, customer: any) {
    this.isModalOpen = isOpen;
    this.chosenCustomer = customer;
  }

  //400: selvitä Lotan kanssa
  deleteCustomer() {
    const customerId = this.chosenCustomer.customer_id;
    console.log(customerId);
    this.apiService.deleteCustomer(customerId).subscribe({
      next: () => {
        console.log('Customer deleted successfully!');
        this.setClosed(false);
      },
      error: (err) => {
        console.error('No success: ', err);
      },
    });
  }

  updateCustomer() {
    const customerId = this.chosenCustomer.customer_id;
    const customerData = this.chosenCustomer;
    this.apiService.updateCustomer(customerId, customerData).subscribe({
      next: (data) => {
        console.log('Customer updated: ', data);
      },
      error: (err) => {
        console.error('No success: '), err;
      },
    });
  }

  setClosed(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  addNew() {
    this.router.navigate(['/tabs/customers/addnewcustomer']);
  }
}
