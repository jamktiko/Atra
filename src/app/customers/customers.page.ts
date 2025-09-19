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
    IonButton,
    CommonModule,
    FormsModule,
    IonSearchbar,
  ],
})
export class CustomersPage implements OnInit {
  allcustomers: Customer[] = customers;

  constructor() {}

  ngOnInit() {}
}
