import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormArray, AbstractControl } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-modalink',
  templateUrl: './modalink.page.html',
  styleUrls: ['./modalink.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonText,
    CommonModule,
    FormsModule,
  ],
})
export class ModalinkPage implements OnInit {
  @Input() chosenInks!: any;
  constructor() {}

  ngOnInit() {}
}
