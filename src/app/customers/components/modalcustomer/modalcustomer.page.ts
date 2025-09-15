import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniversalmodalPage } from 'src/app/shared/universalmodal/universalmodal.page';
import { Customer } from 'src/interface';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonLabel,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modalcustomer',
  templateUrl: './modalcustomer.page.html',
  styleUrls: ['./modalcustomer.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    CommonModule,
    FormsModule,
  ],
})
export class ModalcustomerPage implements OnInit {
  @Input() newcustomer?: Customer;
  @Input() openModal!: boolean;
  @Output() confirm = new EventEmitter<Customer>();
  @Output() cancel = new EventEmitter<void>();

  sendConfirm() {
    this.confirm.emit(this.newcustomer);
  }

  sendCancel() {
    this.cancel.emit();
  }

  ngOnInit() {}
}
