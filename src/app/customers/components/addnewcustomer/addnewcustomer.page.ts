import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonList,
  IonListHeader,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-addnewcustomer',
  templateUrl: './addnewcustomer.page.html',
  styleUrls: ['./addnewcustomer.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonListHeader,
    IonInput,
    IonItem,
    CommonModule,
    FormsModule,
    IonButton,
  ],
})
export class AddnewcustomerPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
