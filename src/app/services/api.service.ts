import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicInk, UserInk } from 'src/interface';
import { Observable } from 'rxjs';
import { Entry } from 'src/interface';
import { Customer } from 'src/interface';
import { InkTest } from 'src/interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl =
    'https://ogco0iemlc.execute-api.eu-north-1.amazonaws.com/test/';

  constructor(private http: HttpClient) {}

  getAllInks(): Observable<PublicInk[]> {
    return this.http.get<PublicInk[]>(
      `https://ogco0iemlc.execute-api.eu-north-1.amazonaws.com/test/public`
    );
  }

  getUserInks(): Observable<UserInk[]> {
    return this.http.get<UserInk[]>(
      `https://ogco0iemlc.execute-api.eu-north-1.amazonaws.com/test/user`
    );
  }

  addNewInk(public_ink_id: number, batch_number: string): Observable<InkTest> {
    return this.http.post<InkTest>(
      `https://ogco0iemlc.execute-api.eu-north-1.amazonaws.com/test/user`,
      {
        inks: [{ public_ink_id, batch_number }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  getAllEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(``);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(``);
  }

  getTables(): Observable<Object> {
    return this.http.get<Object>(`${this.apiUrl}`);
  }

  addNewCustomer() {}
}
