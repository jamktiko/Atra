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
    IonContent,
    CommonModule,
    FormsModule,
    // IonHeader,
    // IonToolbar,
    // IonTitle,
    IonSearchbar,
    IonModal,
  ],
})
export class InksPage implements OnInit {
  /**
   * Variable that is tied to ion-searchbar with ngModel, which creates two-way data binding.
   * Value of searchItem gets updated reactively and used in filteredSearch()-method
   * to search for items
   */
  searchItem: string = '';

  /* Manages the visibility of ionmodal: true > visible, false > not visible
   */
  isModalOpen: boolean = false;

  /*
   * Variable that defines chosen ink in chooseInk-method.
   */
  selectedInk: any = null;

  /* User's inks are fetched with apiService method within getInks() method. It gets called
   * in ngOnInit() when components gets rendered.
   */
  userInks: UserInk[] = [];

  updatedInk!: UserInk;

  /*
   * Manages the visibility of update-modal: true > visible, false > not visible
   */
  showUpdateModal: boolean = false;

  /*Tuotantovaiheessa hakee käyttäjän authservicen perusteella, tässä vaiheessa kovakoodattu feikkidata
   */

  /* Apiservice, Router and NgToastService get stated within the constructor, which then allows
   * these libraries and methods to be used within the class.
   */
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.getInks();
    this.loadInks();
  }

  /*
   * Method that initiates user's ink library and sets the value to userInks-variable
   */
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

  /**
   * Recalls user's ink library whenever router.redirect value is /tabs/inks
   * Designed to ensure that render activates whenever there are changes to user's library
   */

  loadInks() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/tabs/inks') {
          this.getInks();
        }
      });
  }

  /**
   * Function that manages showUpdateModal boolean, which controls update-modals visibility
   * @param isOpen: boolean
   * Given parameter value then determines showUdateModal value
   */
  toggleUpdateModal(isOpen: boolean) {
    this.showUpdateModal = isOpen;
  }

  /**
   * Redirects user to addnewink-component, where user can add new inks to their library.
   * Angular Router navigate() method allows literal URL string as parameter
   */
  addNew() {
    this.router.navigate(['/inks/addnewink']);
  }

  /**
   * Redirects user to publicink-component, where user can find application's ink library.
   * Angular Router navigate() method allows literal URL string as parameter
   */
  toPublic() {
    this.router.navigate(['/tabs/inks/publiclibrary']);
  }
  alreadyHere() {
    //toast to user that already at this page
    this.toast.success('Already here!');
    console.log('At own library already.');
  }

  /**
   * Chooseink method chooses a specific ink and modal gets opened (true) and that ink is presented
   * in the modal (selectedInk).
   * @param boolean isOpen, defines isModalOpen variable's value
   * @param UserInk ink, defines selectedInk variable's value
   */
  chooseInk(isOpen: boolean, ink: any) {
    this.isModalOpen = isOpen;
    this.selectedInk = ink;
  }

  deleteInk() {
    const userInkId = this.selectedInk.user_ink_id;
    this.apiService.deleteUserInk(userInkId).subscribe({
      next: () => {
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

    this.apiService.updateUserInk(userInkId, this.selectedInk).subscribe({
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
   * tai close-nappulasta. Ionmodalin omilla ominaisuuksilla voidaan hallinnoida tätä HTML-
   * templaatissa (didDismiss)="setClosed(false)" pätkän avulla: didDismiss viittaa modaalin ulkopuolelle
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
