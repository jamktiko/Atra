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
  private apiUrl = 'https://tqcdm5dn0k.execute-api.eu-north-1.amazonaws.com';
  private readonly isProd = environment.production; //false when using ionic serve, true when using ionic build
  //private readonly isProd = true; //this is for testing: fakes that we are in prod branch after ionic build

  private localUserInks: UserInk[] = [...mockUserInks]; //copy of mockUserInks

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
  addNewUserInk(userInkData: any): Observable<UserInk> {
    if (this.isProd) {
      return this.http.post<UserInk>(`${this.apiUrl}/userInk`, userInkData);
    } else {
      // TODO: implement actual stuff here
      return this.http.post<UserInk>(`${this.apiUrl}/userInk`, userInkData);
    }
  }

  /**
   * Backend-kutsu deleteUserInk
   */
  deleteUserInk(userInkId: string): Observable<UserInk> {
    return this.http.delete<UserInk>(`${this.apiUrl}/${userInkId}`);
  }

  /**
   * Backend-kutsu updateUserInk
   */
  updateUserInk(
    userInkId: string,
    userId: string,
    userInkData: UserInk
  ): Observable<UserInk> {
    return this.http.put<UserInk>(
      `${this.apiUrl}/userInk/${userInkId}`,
      userInkData
    );
  }

  /**
   * Backend-kutsu getCustomer
   */
  getCustomer(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customer/${customerId}`);
  }

  /**
   * Backend-kutsu listCustomers
   */
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customer`);
  }

  /**
   * Backend-kutsu addCustomer
   */
  addNewCustomer(customerData: CustomerCreation): Observable<CustomerCreation> {
    return this.http.post<CustomerCreation>(
      `${this.apiUrl}/customer`,
      customerData
    );
  }

  /**
   * Backend-kutsu deleteCustomer
   */
  deleteCustomer(customerId: number): Observable<Customer> {
    return this.http.delete<Customer>(`${this.apiUrl}/customer/${customerId}`);
  }

  /**
   * Backend-kutsu updateCustomer
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
}
