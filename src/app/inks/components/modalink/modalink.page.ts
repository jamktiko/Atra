import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormArray,
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
import { publicInks } from 'src/temporarydata';
import { PublicInk } from 'src/interface';

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
  ],
})
export class ModalinkPage implements OnInit {
  @Input() chosenInks!: AbstractControl | null;
  @Output() cancel = new EventEmitter<any>();
  //id:t taulukkona numeroina
  inksToReview: any[] = [];
  inksData: PublicInk[] = publicInks;

  constructor() {}

  ngOnInit() {
    this.inksToReview = this.chosenInks!.value;

    this.getInksData(this.inksData, this.inksToReview);
  }

  //TEE TÄMÄ MAANANTAINA JA TARKISTA SÄÄNNÖT
  getInksData(inksData: PublicInk[], inksToReview: any[]) {
    for (let i = 0; i++; i = inksToReview.length - 1) {
      inksData.forEach((ink) => ink.id === inksToReview[i]);
    }
  }

  sendCancel() {
    this.cancel.emit();
  }

  sendConfirm() {}
}
