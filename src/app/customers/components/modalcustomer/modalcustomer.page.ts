import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-modalcustomer',
  templateUrl: './modalcustomer.page.html',
  styleUrls: ['./modalcustomer.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ModalcustomerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
