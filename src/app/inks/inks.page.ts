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
  IonModal,
} from '@ionic/angular/standalone';

import { User, UserInk } from 'src/interface';
import { Router, NavigationEnd } from '@angular/router';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

//below is for testing env variable
/* // setting up environment variables for use
import { environment } from 'src/environments/environment';
let isProd = environment.production; //false when using ionic serve, true when using ionic build
isProd = true; 
console.log('Is it prod? ' + isProd); */

@Component({
  selector: 'app-inks',
  templateUrl: './inks.page.html',
  styleUrls: ['./inks.page.css'],
  standalone: true,
  imports: [
    NgToastComponent,
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
  userId: string = '1';
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

  updatedInk!: UserInk;

  /*
   * Hallinnoi musteen päivityksen updatemodal-näkyvyyttä */
  showUpdateModal: boolean = false;

  /*Tuotantovaiheessa hakee käyttäjän authservicen perusteella, tässä vaiheessa kovakoodattu feikkidata
   */

  /* Constructorissa otetaan käyttöön apiservice */
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.getInks();
    this.loadInks();
  }

  getInks() {
    this.apiService.getAllUserInks().subscribe({
      next: (data) => {
        this.userInks = data;
      },
      error: (err) => {
        console.error('Something went wrong when fetching inks: ', err);
      },
    });
  }

  loadInks() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/tabs/inks') {
          this.getInks();
        }
      });
  }

  toggleUpdateModal(isOpen: boolean) {
    this.showUpdateModal = isOpen;
  }

  addNew() {
    this.router.navigate(['/inks/addnewink']);
  }

  toPublic() {
    this.router.navigate(['/tabs/inks/publiclibrary']);
  }
  alreadyHere() {
    //toast to user that already at this page
    this.toast.success('Already here!');
    console.log('At own library already.');
  }
  /*
   * Chooseink-metodi valitsee tietyn musteen, ja ottaa parametriksi booleanin ja ink-datan,
   * eli yksittäisen musteen tiedot. Boolean asetetaan isModalOpen-muuttujan arvoksi, ja musteen
   * data selectedInk-muuttujan arvoksi. Näin tiedot saadaan ionmodalille, jossa yksittäinen
   * muste esitellään.
   */
  chooseInk(isOpen: boolean, ink: any) {
    this.isModalOpen = isOpen;
    this.selectedInk = ink;
  }

  deleteInk() {
    const userInkId = this.selectedInk.user_ink_id;
    this.apiService.deleteUserInk(userInkId).subscribe({
      next: () => {
        console.log('Deleted succesfully ink with ID-number: ', userInkId);
        this.getInks();
        this.setClosed(false);
        this.toast.success('Ink deleted successfully');
      },
      error: (err) => {
        console.error('Ink deletion failed: ', err);
        //warning message to user
      },
    });
  }

  //HUOM. userID kovakoodattu toistaiseksi
  updateInk() {
    const userInkId = this.selectedInk.user_ink_id;
    const userId = this.userId;

    this.apiService
      .updateUserInk(userInkId, userId, this.selectedInk)
      .subscribe({
        next: (updatedInk) => {
          console.log('Ink updated: ', updatedInk);
          this.updatedInk = updatedInk;
          this.toggleUpdateModal(false);
          this.setClosed(false);
          this.toast.success('Ink updated successfully');
        },
        error: (err) => {
          console.error('Something went wrong: ', err);

          //error message toast
        },
      });
  }

  /*
   * Käsittelee ionmodalin sulkeutumisen silloin, jos käyttäjä klikkaa modaalin ulkopuolelta
   * tai close-nappulasta. Ionmodalin omilla ominaisuuksilla voidaan hallinnoida tätä HTML-templaatissa
   * (didDismiss)="setClosed(false)" pätkän avulla: didDismiss viittaa modaalin ulkopuolelle
   * klikkaamiseen, jolloin templaatissa käsketään toteuttamaan setClosed-metodi
   */
  setClosed(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  /*
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

  testaa() {
    console.log(environment.apiUrl);
  }
}
