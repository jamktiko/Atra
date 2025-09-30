import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { IonSearchbar } from '@ionic/angular/standalone';
import { publicInks } from 'src/temporarydata';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonRouterLink,
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
    IonSearchbar,
  ],
})
export class InksPage implements OnInit {
  // ink: UserInk | null = null;
  userInks: UserInk[] = userInks;
  //Tuotantovaiheessa hakee käyttäjän authservicen perusteella, tässä vaiheessa feikkidata
  user: User = Tiina;
  allInks!: UserInk[];
  // @ViewChild('ink') ink!: PublicInk | null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    //TOISTAISEKSI KOMMENTOITU POIS, hakee renderöintivaiheessa musteet apiservicen kautta
    // this.apiService.getUserInks().subscribe({
    //   next: (data) => {
    //     this.allInks = data;
    //     console.log(data);
    //   },
    //   error: (err) => {
    //     console.error('Jodain meni bieleen: ', err);
    //   },
    // });
  }

  //Testi tietokantaan lisäystä varten
  // testAdd(publicID: number, batchnumber: string) {
  //   console.log('Sending ink:', {
  //     public_ink_id: publicID,
  //     batch_number: batchnumber,
  //   });
  //   this.apiService.addNewInk(publicID, batchnumber).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //     },
  //     error: (err) => {
  //       console.error('Pieleen män, ', err);
  //     },
  //   });
  // }
}
