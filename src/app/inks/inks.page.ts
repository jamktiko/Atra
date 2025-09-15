import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/angular/standalone';
import { Tiina, userInks } from 'src/temporarydata';
import { PublicInk, User, UserInk } from 'src/interface';

@Component({
  selector: 'app-inks',
  templateUrl: './inks.page.html',
  styleUrls: ['./inks.page.css'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
  ],
})
export class InksPage implements OnInit {
  ink: UserInk | null = null;
  allInks: UserInk[] = userInks;
  user: User = Tiina;
  apiInk: PublicInk[] | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAllInks().subscribe({
      next: (data) => {
        this.apiInk = data;
      },
      error: (err) => {
        console.error('Jodain meni bieleen: ', err);
      },
    });
  }
}
