import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule, FormArray } from '@angular/forms';
import {
  IonContent,
  IonHeader,
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

  //Ottaa kaikki musteet ja niiden tiedot choseninks.value avulla tässä muodossa:
  // choseninks = FormArray[({FormGroup: {ink}}, {FormGroup: {ink}}, ...)]
  inksToReview: any[] = [];

  // batchnumber: string = '';

  constructor() {}

  ngOnInit() {
    //Renderöintivaiheessa kutsuu getInksData, jotta inksReview alustetaan + tulostaa konsoliin
    this.getInksData();
    console.log('Inks to review: ', this.inksToReview);
  }

  //Alustaa inksToReview-muuttujan chosenInks.value-arvolla
  getInksData() {
    return (this.inksToReview = this.chosenInks!.value);
  }

  //Lähettää Angularin Outputin avulla EventEmitterin äitikomponentille
  //Käskee toteuttamaan delete-toimintoon sidotun funktion äitikomponentilla: tässä tapauksessa handleDelete()
  // Tarkoituksena poistaa yksittäinen muste review-vaiheessa ja tulostaa päivitetty inksToReview
  sendDelete(id: number) {
    this.delete.emit(id);
    this.getInksData();
  }

  //Lähettää Angularin Outputin avulla EventEmitterin äitikomponentille
  //Käskee toteuttamaan cancel-toimintoon sidotun funktion äitikomponentilla: tässä tapauksessa handleCancel()
  //Tarkoituksena sulkea modalink-komponentti ja palata addnewink-komponentille
  sendCancel() {
    this.cancel.emit();
  }

  //Käsittelee continue-nappulan disabloinnin, mikäli yksikin inksToReview-taulukon batchnumber on tyhjä merkkijono
  //Palauttaa true, mikäli yhdessäkin batchnumberissa on tyhjä merkkijono. Muussa tapauksessa false => ei disabloitu
  disableButton() {
    return this.inksToReview.every(
      (ink) => ink.batchnumber && ink.batchnumber.trim() !== ''
    );
  }

  //tämän pitäisi lähettää confirm > push to own inks apiservien kautta tietokantaan
  //Tässä vaiheessa tulostaa päivitetyn inksToReviewn, jossa mukana uudet batchnumberit
  sendConfirm() {
    console.log('Inks added successfully: ');
    console.log(this.getInksData());
  }
}
