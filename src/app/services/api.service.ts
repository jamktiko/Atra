import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicInk } from 'src/interface';
import { Observable } from 'rxjs';
import { Entry } from 'src/interface';
import { Customer } from 'src/interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl =
    'https://ogco0iemlc.execute-api.eu-north-1.amazonaws.com/test/inks';

  constructor(private http: HttpClient) {}

  getAllInks(): Observable<PublicInk[]> {
    return this.http.get<PublicInk[]>(`${this.apiUrl}`);
  }

  getAllEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(``);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(``);
  }

  addNewCustomer() {}
}
