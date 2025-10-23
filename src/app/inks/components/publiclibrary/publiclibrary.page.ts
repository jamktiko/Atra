import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicInk } from 'src/interface';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonModal,
} from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publiclibrary',
  templateUrl: './publiclibrary.page.html',
  styleUrls: ['./publiclibrary.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSearchbar,
    IonModal,
  ],
})
export class PubliclibraryPage implements OnInit {
  /**
   * allInks-arvo saadaan tässävaiheessa kovakoodatusta feikkidatasta temporarydata.ts-tiedostosta.
   * Myöhemmässä vaiheessa allInks alustetaan apiServicen kautta tulemaan tietokannasta.
   */
  allInks: PublicInk[] = [];

  /**
   * Hallinnoi ionmodalin näkyvyyttä: true näyttää, false ei. ChooseInk & setClosed-metodien avulla
   * muutetaan booleanin arvoa.
   */
  isModalOpen: boolean = false;
  searchItem: string = '';
  selectedInk: any;

  constructor(private apiService: ApiService, private router: Router) {}

  /**
   * Hoitaa yksittäisen musteen valitsemisen, ja ottaa parametreiksiin isOpen ja ink-arvot.
   * Hallinnoi modaalin näkyvyyttä sekä välittää modaalille datan yksittäisen musteen osalta.
   */
  chooseInk(isOpen: boolean, ink: any) {
    this.isModalOpen = isOpen;
    this.selectedInk = ink;
  }

  /**
   * Ottaa parametrikseen booleanin, ja asettaa isModalOpen-arvon kyseiseen booleaniin.
   */
  setClosed(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  toOwnLibrary() {
    this.router.navigate(['/tabs/inks']);
  }

  alreadyHere() {
    //toast to user that already at this page
    console.log('At public library already.');
  }

  /**
   * Käsittelee hakukentän arvon filtteröinnin: etsii musteista vain niitä, joiden nimi,
   * valmistaja tai väri sisältää hakukentän arvon.
   */
  filteredSearch() {
    const search = this.searchItem!.toLowerCase();

    return this.allInks.filter(
      (ink) =>
        //päivitetään apiservicen vaiheessa myös publicinkistä tulevia attribuutteja
        ink.product_name.toLowerCase().includes(search) ||
        ink.manufacturer.toLowerCase().includes(search) ||
        ink.color.toLowerCase().includes(search)
    );
  }

  //Hakee mustetiedot tietokannasta renderöintivaiheessa
  ngOnInit() {
    this.apiService.getAllPublicInks().subscribe({
      next: (data) => {
        this.allInks = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
      },
    });
  }
}
