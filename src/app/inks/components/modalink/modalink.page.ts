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
  @Input() chosenInks!: FormArray;
  @Output() cancel = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  //Ottaa kaikki musteet ja niiden tiedot choseninks.value avulla muodossa
  // choseninks = FormArray[({FormGroup: ink}, {FG: ink}, {FG: ink} ...)]
  inksToReview: any[] = [];

  batchnumber: string = '';

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

  disableButton() {
    return this.inksToReview.every(
      (ink) => ink.batchnumber && ink.batchnumber.trim() !== ''
    );
  }

  //tämän pitäisi lähettää confirm > push to own inks apiservien kautta tietokantaan
  sendConfirm() {
    console.log('Inks added successfully: ');
    console.log(this.getInksData());
  }
}
