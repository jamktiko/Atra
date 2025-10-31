import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer, CustomerCreation } from 'src/interface';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonLabel,
  IonToolbar,
  IonModal,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modalcustomer',
  templateUrl: './modalcustomer.page.html',
  styleUrls: ['./modalcustomer.page.css'],
  standalone: true,
  imports: [IonContent, IonList, IonItem, CommonModule, FormsModule],
})
export class ModalcustomerPage implements OnInit {
  @Input() newcustomer?: CustomerCreation;
  @Input() openModal!: boolean;
  @Output() confirm = new EventEmitter<CustomerCreation>();
  @Output() cancel = new EventEmitter<void>();

  sendConfirm() {
    this.confirm.emit(this.newcustomer);
  }

  sendCancel() {
    this.cancel.emit();
  }

  ngOnInit() {}
}
