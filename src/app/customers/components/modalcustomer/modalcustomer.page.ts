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
  /**
   * Gets newcustomer-value from addnewCustomer as Input
   */
  @Input() newcustomer?: CustomerCreation;
  /**
   * Value of openModal is taken in asInput
   */
  @Input() openModal!: boolean;

  @Output() confirm = new EventEmitter<CustomerCreation>();

  @Output() cancel = new EventEmitter<void>();

  /**
   * Sends info of confirm as Output in form of EventEmitter: parent knows to call for
   * method that is linked to confirm (handleConfirm)
   */
  sendConfirm() {
    this.confirm.emit(this.newcustomer);
  }

  /**
   * Sends info of cancel as Output in form of EventEmitter: parent knows to call for
   * method that is linked to cancel (handleCancel)
   */
  sendCancel() {
    this.cancel.emit();
  }

  ngOnInit() {}
}
