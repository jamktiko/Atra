import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerCreation, PublicInk, UserInk } from 'src/interface';
import { Observable } from 'rxjs';
import { Entry } from 'src/interface';
import { Customer } from 'src/interface';
import { environment } from 'src/environments/environment';
import {
  mockUserInks,
  mockPublicInks,
  mockUsers,
  mockEntries,
  mockCustomers,
  mockCustomerCreations,
} from 'src/temporarydata';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://5nwt3l6bc8.execute-api.eu-north-1.amazonaws.com';
  //TÄMÄ KUN DEV
  // private readonly isProd = environment.production;
  //false when using ionic serve, true when using ionic build
  //TÄMÄ KUN PROD
  private readonly isProd = true; //this is for testing: fakes that we are in prod branch after ionic build

  private localUserInks: UserInk[] = [...mockUserInks]; //copy of mockUserInks
  private localCustomers: Customer[] = [...mockCustomers]; //copy of mockCustomers
  private localEntries: Entry[] = [...mockEntries]; //copy of mockEntries

  constructor(private http: HttpClient) {}

  /**
   * Backend-kutsu listPublicInks()
   */
  getAllPublicInks(): Observable<PublicInk[]> {
    if (this.isProd) {
      return this.http.get<PublicInk[]>(`${this.apiUrl}/publicInk`);
    } else {
      return of(mockPublicInks);
    }
  }

  /**
   * Backend-kutsu getPublicInk
   */
  getOnePublicInk(id: number): Observable<PublicInk> {
    if (this.isProd) {
      return this.http.get<PublicInk>(`${this.apiUrl}/publicInk/${id}`);
    } else {
      const mockInk = mockPublicInks.find((ink) => ink.ink_id === id);
      return of(mockInk!);
    }
  }

  /**
   * Backend-kutsu listOwnInks()
   */
  getAllUserInks(): Observable<UserInk[]> {
    if (this.isProd) {
      return this.http.get<UserInk[]>(`${this.apiUrl}/userInk`);
    } else {
      return of(this.localUserInks);
    }
  }

  /**
   * Backend-kutsu getUserInk()
   */
  getOneUserInk(userInkId: number): Observable<UserInk> {
    if (this.isProd) {
      return this.http.get<UserInk>(`${this.apiUrl}/userInk/${userInkId}`);
    } else {
      const mockInk = this.localUserInks.find(
        (ink) => ink.user_ink_id === userInkId
      );

      //if mockInk coul not be found somehow, this generates an empty fake mock ink
      if (!mockInk) {
        return of({
          user_ink_id: userInkId,
          batch_number: 'N/A',
          opened_at: new Date('1970-01-01'),
          expires_at: new Date('1970-01-01'),
          favorite: false,
          publicink_ink_id: 0,
          product_name: 'N/A',
          manufacturer: 'N/A',
          color: 'N/A',
          recalled: false,
          image_url: 'N/A',
          size: 'N/A',
          User_user_id: 'N/A',
        } as UserInk);
      }
      return of(mockInk);
    }
  }

  /**
   * Backend-kutsu addUserInk()
   */
  addNewUserInk(userInkData: any[]): Observable<UserInk[]> {
    if (this.isProd) {
      return this.http.post<UserInk[]>(`${this.apiUrl}/userInk`, userInkData);
    } else {
      const newInks: UserInk[] = userInkData.map((data) => {
        const newId =
          Math.max(...this.localUserInks.map((ink) => ink.user_ink_id)) + 1;

        const publicInkId = Number(data.PublicInk_ink_id);
        const publicInk = mockPublicInks.find(
          (ink) => ink.ink_id === publicInkId
        );

        const mockInk: UserInk = {
          user_ink_id: newId,
          batch_number: data.batch_number ?? 'N/A',
          opened_at: new Date(),
          expires_at: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          favorite: false,
          publicink_ink_id: publicInkId,
          product_name: publicInk?.product_name ?? 'Mock Product',
          manufacturer: publicInk?.manufacturer ?? 'Mock Manufacturer',
          color: publicInk?.color ?? 'Mock Color',
          recalled: publicInk?.recalled ?? false,
          image_url:
            publicInk?.image_url ??
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Bombay_Katzen_of_Blue_Sinfonie.JPG/960px-Bombay_Katzen_of_Blue_Sinfonie.JPG',
          size: publicInk?.size ?? 'Mock Size',
          User_user_id: data.User_user_id ?? 'mock-user-id',
        };

        this.localUserInks.push(mockInk);
        return mockInk;
      });

      return of(newInks);
    }
  }

  /**
   * Backend-kutsu deleteUserInk
   */
  deleteUserInk(userInkId: number): Observable<UserInk> {
    if (this.isProd) {
      return this.http.delete<UserInk>(`${this.apiUrl}/userInk/${userInkId}`);
    } else {
      const index = this.localUserInks.findIndex(
        (ink) => ink.user_ink_id === userInkId
      );
      if (index !== -1) {
        const deletedInk = this.localUserInks.splice(index, 1)[0];
        return of(deletedInk);
      } else {
        // Palautetaan tyhjä mock-objekti jos mustetta ei löytynyt
        return of({
          user_ink_id: userInkId,
          batch_number: 'N/A',
          opened_at: new Date('1970-01-01'),
          expires_at: new Date('1970-01-01'),
          favorite: false,
          publicink_ink_id: 0,
          product_name: 'N/A',
          manufacturer: 'N/A',
          color: 'N/A',
          recalled: false,
          image_url: 'N/A',
          size: 'N/A',
          User_user_id: 'N/A',
        } as UserInk);
      }
    }
  }

  /**
   * Backend-kutsu updateUserInk
   * TODO: mock data usage in else-block
   */
  updateUserInk(
    userInkId: string,
    userId: string,
    userInkData: UserInk
  ): Observable<UserInk> {
    if (this.isProd) {
      return this.http.put<UserInk>(
        `${this.apiUrl}/userInk/${userInkId}`,
        userInkData
      );
    } else {
      return this.http.put<UserInk>(
        `${this.apiUrl}/userInk/${userInkId}`,
        userInkData
      );
    }
  }

  /**
   * Backend-kutsu getCustomer
   */
  getCustomer(customerId: number): Observable<Customer> {
    if (this.isProd) {
      return this.http.get<Customer>(`${this.apiUrl}/customer/${customerId}`);
    } else {
      const mockCustomer = mockCustomers.find(
        (customer) => customer.customer_id === customerId
      );

      if (!mockCustomer) {
        return of({
          customer_id: customerId,
          first_name: 'Mock',
          last_name: 'Customer',
          email: 'mock@example.com',
          phone: '000-0000000',
          notes: 'This is a mock customer.',
          User_user_id: 'mock-user-id',
          created_at: new Date('1970-01-01'),
        } as Customer);
      }
      return of(mockCustomer);
    }
  }

  /**
   * Backend-kutsu listCustomers
   */
  getAllCustomers(): Observable<Customer[]> {
    if (this.isProd) {
      return this.http.get<Customer[]>(`${this.apiUrl}/customer`);
    } else {
      return of(this.localCustomers);
    }
  }

  /**
   * Backend-kutsu addCustomer
   */
  addNewCustomer(
    customerData: CustomerCreation
  ): Observable<CustomerCreation> | Observable<Customer> {
    if (this.isProd) {
      return this.http.post<CustomerCreation>(
        `${this.apiUrl}/customer`,
        customerData
      );
    } else {
      const newId =
        Math.max(...this.localCustomers.map((c) => c.customer_id)) + 1;

      console.log(customerData);

      const mockCustomer: Customer = {
        customer_id: newId,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: customerData.email,
        phone: customerData.phone,
        notes: '',
        User_user_id: 'mock-user-id',
      };

      this.localCustomers.push(mockCustomer);
      return of(mockCustomer);
    }
  }

  /**
   * Backend-kutsu deleteCustomer
   */
  deleteCustomer(customerId: number): Observable<Customer> {
    if (this.isProd) {
      return this.http.delete<Customer>(
        `${this.apiUrl}/customer/${customerId}`
      );
    } else {
      const index = this.localCustomers.findIndex(
        (customer) => customer.customer_id === customerId
      );
      if (index !== -1) {
        const deletedCustomer = this.localCustomers.splice(index, 1)[0];
        return of(deletedCustomer);
      } else {
        return of({
          customer_id: customerId,
          first_name: 'Mock',
          last_name: 'Customer',
          email: 'mock@example.com',
          phone: '000-0000000',
          notes: 'This is a mock customer.',
          User_user_id: 'mock-user-id',
          created_at: new Date('1970-01-01'),
        } as Customer);
      }
    }
  }

  /**
   * Backend-kutsu updateCustomer
   * TODO: mock data usage in else-block
   */

  updateCustomer(
    customerId: number,
    customerData: Customer
  ): Observable<Customer> {
    return this.http.put<Customer>(
      `${this.apiUrl}/customer/${customerId}`,
      customerData
    );
  }

  getEntries(): Observable<Entry[]> {
    //Add userID parameter + to url
    if (this.isProd) {
      return this.http.get<Entry[]>(`${this.apiUrl}/entries/`);
    } else {
      return of(this.localEntries);
    }
  }
}
