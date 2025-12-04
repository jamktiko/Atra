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
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.css'],
  standalone: true,
  imports: [
    IonContent,
    // IonHeader,
    // IonTitle,
    // IonToolbar,
    CommonModule,
    FormsModule,
    IonSearchbar,
    IonModal,
  ],
})
export class CustomersPage implements OnInit {
  searchItem: string = '';

  /**
   * Allcustomers-value is fetched in ngOnInit when component gets rendered
   */

  allcustomers: Customer[] = [];

  chosenCustomer: any;

  /**
   * Boolean that manages the visibility of customer-modal: true > visible, false > not visible
   */
  isModalOpen: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

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

  /**
   * Fetches customers with ApiService getAllcustomers()-method, and determines the value of allcustomers-variable
   */
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

  /** Manages filtering search for customers: validation with toLowerCase to check whether search-variable value is included in
   * customer's first_name, last_name or email.
   * HTML-template loops through with @for (ink of filteredInks(); track ink.id) {...}
   * @return allcustomers: []; Array of Customer
   */

  filteredCustomers() {
    const search = this.searchItem.toLowerCase() ?? '';

    return this.allcustomers.filter(
      (customer) =>
        (customer.first_name?.toLowerCase() ?? '').includes(search) ||
        (customer.last_name?.toLowerCase() ?? '').includes(search) ||
        (customer.email?.toLowerCase() ?? '').includes(search)
    );
  }

  /**
   * Chooses customer and opens modal with customer's info. isModalOpen value is changed to value of isOpen, and
   * customer's data comes from customer (value of interface Customer)
   * @param isOpen: boolean
   * @param customer: Customer
   * No return-value
   */
  chooseCustomer(isOpen: boolean, customer: any) {
    this.isModalOpen = isOpen;
    this.chosenCustomer = customer;
  }

  /**
   * Uses ApiService deleteCustomer()-method and passes the value of chosenCustomer.customer_id as argument.
   * This customer is then deleted from user's library.
   */

  deleteCustomer() {
    const customerId = this.chosenCustomer.customer_id;

    this.apiService.deleteCustomer(customerId).subscribe({
      next: () => {
        console.log('Customer deleted successfully!');
        this.loadCustomers();
        this.toast.success('Customer deleted successfully!');
        this.setClosed(false);
      },
      error: (err) => {
        console.error('Error when deleting customer: ', err);
        this.toast.warning('Something went wrong.');
      },
    });
  }

  /**
   * Uses ApiService updateCustomer()-method and passes customerData and customerId as arguments.
   * This customer's data is then updated according to the values passed in the HTML input-form
   */
  updateCustomer() {
    const customerId = this.chosenCustomer.customer_id;
    const customerData = this.chosenCustomer;
    this.apiService.updateCustomer(customerId, customerData).subscribe({
      next: (data) => {
        console.log('Customer updated: ', data);
        this.loadCustomers();
        this.setClosed(false);
        this.toast.success('Customer updated successfully');
      },
      error: (err) => {
        console.error('No success: '), err;
        this.toast.danger('Something went wrong.');
      },
    });
  }

  /**
   * Sets the value of isModalOpen as the value of isOpen
   * @param isOpen: boolean;
   */
  setClosed(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  /**
   * Redirects user to addnewcustomer.page where new customer-form lives
   */
  addNew() {
    this.router.navigate(['/tabs/customers/addnewcustomer']);
  }
}
