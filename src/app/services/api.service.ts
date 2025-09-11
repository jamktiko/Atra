import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicInk } from 'src/interface';
import { Observable } from 'rxjs';

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
}
