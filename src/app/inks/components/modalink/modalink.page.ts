import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormsModule,
  FormArray,
  FormControl,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modalink',
  templateUrl: './modalink.page.html',
  styleUrls: ['./modalink.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonText,
    CommonModule,
    FormsModule,
    IonButton,
    ReactiveFormsModule,
  ],
})
export class ModalinkPage implements OnInit {
  @Input() chosenInks!: AbstractControl | null;
  @Output() cancel = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  //ottaa kaikki musteet ja niiden tiedot choseninks.value avulla
  inksToReview: any[] = [];

  //record: constructs an object type whose property keys are Keys and whose property values are Type
  //HUOM. ANGULAR CHANGE DETECTION NOT WORKING rethink this Sally
  // batchNumbers: Record<number, string> = {};

  constructor() {}

  ngOnInit() {
    this.getInksData();
    console.log('Inks to review: ', this.inksToReview);
  }

  getInksData() {
    return (this.inksToReview = this.chosenInks!.value);
  }

  sendDelete(id: number) {
    this.delete.emit(id);
    this.getInksData();
  }

  sendCancel() {
    this.cancel.emit();
  }

  disableButton() {}

  //tämän pitäisi lähettää confirm > push to own inks apiservien kautta tietokantaan
  sendConfirm() {
    console.log('Inks added successfully: ');
    console.log(this.getInksData());
  }
}
