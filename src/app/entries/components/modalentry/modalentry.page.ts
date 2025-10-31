import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { EntryCreation } from 'src/interface';

@Component({
  selector: 'app-modalentry',
  templateUrl: './modalentry.page.html',
  styleUrls: ['./modalentry.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class ModalentryPage implements OnInit {
  @Input() reviewEntry!: EntryCreation;
  @Output() cancel = new EventEmitter<void>();

  dateInISO!: string;

  constructor() {}

  ngOnInit() {}

  sendCancel() {
    this.cancel.emit();
  }

  sendConfirm() {
    console.log('Confirm');
  }
}
