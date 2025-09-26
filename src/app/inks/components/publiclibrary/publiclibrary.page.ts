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
  IonSearchbar,
} from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';

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
    IonSearchbar,
  ],
})
export class PubliclibraryPage implements OnInit {
  allInks!: PublicInk[];

  constructor(private apiService: ApiService) {}

  //Hakee mustetiedot tietokannasta renderöintivaiheessa
  ngOnInit() {
    //   this.apiService.getAllInks().subscribe({
    //     next: (data) => {
    //       this.allInks = data;
    //       console.log(data);
    //     },
    //     error: (err) => {
    //       console.error('Something went wrong: ', err);
    //     },
    //   });
  }
}
