import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerCreation, PublicInk, UserInk } from 'src/interface';
import { Observable } from 'rxjs';
import { Entry } from 'src/interface';
import { Customer } from 'src/interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://lfpqr457ka.execute-api.eu-north-1.amazonaws.com';

  constructor(private http: HttpClient) {}

  /**
   * Backend-kutsu listPublicInks()
   *
   */
  getAllPublicInks(): Observable<PublicInk[]> {
    return this.http.get<PublicInk[]>(`${this.apiUrl}/publicInk`);
  }

  /**
   * Backend-kutsu getPublicInk
   *
   */
  getOnePublicInk(publicInkId: number): Observable<PublicInk> {
    return this.http.get<PublicInk>(`${this.apiUrl}/publicInk/${publicInkId}`);
  }

  /**
   * Backend-kutsu listOwnInks()
   */
  getAllUserInks(): Observable<UserInk[]> {
    return this.http.get<UserInk[]>(`${this.apiUrl}/userInk`);
  }

  /**
   * Backend-kutsu getUserInk()
   */
  getOneUserInk(userInkId: number): Observable<UserInk> {
    return this.http.get<UserInk>(`${this.apiUrl}/userInk/${userInkId}`);
  }

  /**
   * Backend-kutsu addUserInk()
   */
  addNewUserInk(userInkData: any): Observable<UserInk> {
    return this.http.post<UserInk>(`${this.apiUrl}/userInk`, userInkData);
  }

  /**
   * Backend-kutsu getCustomer
   *
   * */
  getCustomer(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customer/${customerId}`);
  }

  /**
   * Backend-kutsu listCustomers
   * */
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
}
