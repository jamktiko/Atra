import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { IonSearchbar } from '@ionic/angular/standalone';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
} from '@ionic/angular/standalone';

import { User, UserInk } from 'src/interface';

@Component({
  selector: 'app-inks',
  templateUrl: './inks.page.html',
  styleUrls: ['./inks.page.css'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonSearchbar,
    IonModal,
  ],
})
export class InksPage implements OnInit {
  /*searchItem-muuttuja on sidottu ion-searchbariin ngModel-toiminnalla, joka mahdollistaa
   * muuttujien kaksisuuntaisen sitomisen. Täten searchItemin arvo päivittyy reaktiivisesti
   */
  searchItem: string = '';

  /* Hallinnoi ionmodalin näkyvyyttä: jos true niin näkyy, jos false niin ei näy
   */
  isModalOpen: boolean = false;

  /* Määrittelee chooseInk-metodin avulla valitun musteen, jonka tiedot välitetään ionmodalille */
  selectedInk: any = null;

  /* Tuotantovaiheessa hakee mustedatan apiservicen perusteeella
   */
  userInks: UserInk[] = [];

  /*Tuotantovaiheessa hakee käyttäjän authservicen perusteella, tässä vaiheessa kovakoodattu feikkidata
   */

  /* Constructorissa otetaan käyttöön apiservice */
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getAllUserInks().subscribe({
      next: (data) => {
        this.userInks = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Jodain meni bieleen: ', err);
      },
    });
  }

  /**
   * Chooseink-metodi valitsee tietyn musteen, ja ottaa parametriksi booleanin ja ink-datan,
   * eli yksittäisen musteen tiedot. Boolean asetetaan isModalOpen-muuttujan arvoksi, ja musteen
   * data selectedInk-muuttujan arvoksi. Näin tiedot saadaan ionmodalille, jossa yksittäinen
   * muste esitellään.
   */
  chooseInk(isOpen: boolean, ink: any) {
    this.isModalOpen = isOpen;
    this.selectedInk = ink;
  }

  /**
   * Käsittelee ionmodalin sulkeutumisen silloin, jos käyttäjä klikkaa modaalin ulkopuolelta
   * tai close-nappulasta. Ionmodalin omilla ominaisuuksilla voidaan hallinnoida tätä HTML-templaatissa
   * (didDismiss)="setClosed(false)" pätkän avulla: didDismiss viittaa modaalin ulkopuolelle
   * klikkaamiseen, jolloin templaatissa käsketään toteuttamaan setClosed-metodi
   */
  setClosed(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  /**
   * Käsittelee musteiden filtteröinnin tarkistamalla, onko searchItem eli hakukentän arvo
   * mukana musteen nimessä. Myöhemmässä vaiheessa otetaan myös muita ominaisuuksia, kuten
   * väri, valmistaja tms. hakuun mukaan, mutta silloin oltava tietokantamuodossa
   */
  filteredSearch() {
    const search = this.searchItem!.toLowerCase();

    return this.userInks.filter((ink) =>
      //päivitetään apiservicen vaiheessa tarkistamaan myös publicinkistä tulevia attribuutteja: color, manufacturer etc.
      ink.product_name.toLowerCase().includes(search)
    );
  }
}
