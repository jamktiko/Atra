import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicInk } from 'src/interface';
import { publicInks } from 'src/temporarydata';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-publiclibrary',
  templateUrl: './publiclibrary.page.html',
  styleUrls: ['./publiclibrary.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
  ],
})
export class PubliclibraryPage implements OnInit {
  allInks: PublicInk[] = publicInks;

  constructor() {}

  ngOnInit() {}
}
