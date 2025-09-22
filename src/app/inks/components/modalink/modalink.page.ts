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
  @Output() delete = new EventEmitter<any>();
  //id:t taulukkona numeroina
  inksToReview: any[] = [];
  inksData: PublicInk[] = publicInks;

  constructor() {}

  ngOnInit() {
    this.getInksData();
  }

  getInksData() {
    this.inksToReview = this.chosenInks!.value;
  }

  sendDelete(id: number) {
    this.delete.emit(id);
    this.getInksData();
  }

  sendCancel() {
    this.cancel.emit();
  }

  //tämän pitäisi lähettää confirm > push to own inks apiservien kautta tietokantaan
  sendConfirm() {}
}
