import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonBadge,
  IonLabel,
} from '@ionic/angular/standalone';
import { ModalinkPage } from '../modalink/modalink.page';
import { PublicInk } from 'src/interface';
import { IonSearchbar } from '@ionic/angular/standalone';
import { publicInks } from 'src/temporarydata';

@Component({
  selector: 'app-addnewink',
  templateUrl: './addnewink.page.html',
  styleUrls: ['./addnewink.page.css'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    IonSearchbar,
    IonSearchbar,
    ModalinkPage,
    IonBadge,
    IonLabel,
  ],
})
export class AddnewinkPage implements OnInit {
  publicInks: PublicInk[] = publicInks; //apiservicestä kun on oikeat datat!
  searchItem: string = '';

  //Muuttuja, jonka avulla ylläpidetään app-modalink-komponentin näkyvyyttä
  showReview: boolean = false;

  //FormGroup, johon tallennetaan valitut musteet eli chosenInks FormArrayna FormGroupeja
  // Eli chosenInks: new FormArray([FormGroup: {inkid: value, productname: value...}])
  inkGroup = new FormGroup({
    chosenInks: new FormArray([]),
  });

  constructor() {}

  ngOnInit() {}

  // Käsittelee showReview-muuttujan näkyvyyden muuttamalla sen trueksi
  // HTML-templaatissa @if (showReview) { <app-modalink [chosenInks]="getChosenInks()" (cancel)="handleCancel()" (delete)="handleDelete($event)"></app-modalink>}

  review() {
    this.showReview = true;
  }

  //Hoitaa musteiden filtteröinnin: validoi toLowerCasella ja tarkistaa, että search-muuttujan sisältö on product_name, color tai manufacturer-tiedoissa
  //HTML-templaatissa @for (ink of filteredInks(); track ink.id)
  filteredInks(): any {
    const search = this.searchItem.toLowerCase();

    return this.publicInks.filter(
      (ink) =>
        ink.product_name.toLowerCase().includes(search) ||
        ink.color.toLowerCase().includes(search) ||
        ink.manufacturer.toLowerCase().includes(search)
    );
  }

  //Palauttaa chosenInks-taulukon formArrayn muodossa
  //Tarkoituksena antaa muille metodeille helppo tapa päästä FormArrayhin käsiksi
  getChosenInks(): FormArray {
    return this.inkGroup.get('chosenInks') as FormArray;
  }

  // Valitsee tietyn musteen HTML-templaatissa ilmaistun buttonin perusteella => sidottu tiettyyn for-loopissa läpikäytyyn musteeseen
  //Ottaa kyseisen musteen tiedot parametrina, ja lisää musteen FormArray
  chooseInk(ink: PublicInk) {
    const inks = this.getChosenInks();

    //Tässä alustetaan FormGroup, jotka muodostavat FormArrayn
    //Eli jokaisessa FormGroupissa on yksittäinen FormControl id, product_name, manufacturer, color, recalled, imageUrl, size & batchnumber
    //Jokainen FormGroup sitten laitetaan push-metodilla FormArrayhin vain, jos kyseistä mustetta ei ole vielä lisätty: if-ehto tarkistaa, löytyykö kyseisellä id:llä jo mustetta taulukosta
    if (!inks.value.some((chosenInk: any) => chosenInk.id === ink.id)) {
      inks.push(
        new FormGroup({
          id: new FormControl(ink.id),
          product_name: new FormControl(ink.product_name),
          manufacturer: new FormControl(ink.manufacturer),
          color: new FormControl(ink.color),
          recalled: new FormControl(ink.recalled),
          imageUrl: new FormControl(ink.imageUrl),
          size: new FormControl(ink.size),
          batchnumber: new FormControl('', Validators.required),
        })
      );

      console.log(inks.value);
    } else {
      console.log('Ink already chosen: ', ink.id);
      console.log(inks.value);
    }
  }

  // Saa Outputina modalink-komponentilta tiedon cancel-EventEmitterista => käskee tätä komponenttia toteuttamaan handleCancel()
  //HTML-templaatissa tämä on (cancel)="handleCancel()" app-modalink komponentin propseissa
  // Käsittelee showReview-muuttujan näkyvyyden muuttamalla sen falseksi
  handleCancel() {
    this.showReview = false;
  }

  // Saa Outputina modalink-komponentilta tiedon delete-EventEmitteristä => käskee tätä komponenttia toteuttamaan handleDelete()
  // HTML-templaatissa tämä on (delete)="handleDelete($event)" app-modalink-komponentin propseissa
  // Ottaa parametrikseen kyseisen musteen id:n ja käsittelee removeAt (Angularin taulukonpoistometodi) sen indeksin perusteella, jossa id === inkId
  handleDelete(inkId: number) {
    const inks = this.inkGroup.get('chosenInks') as FormArray;

    const index = inks.value.indexOf(inkId);

    if (index > -1) {
      //angular equivalent of splice: removes item in array where index matches
      inks.removeAt(index);
      console.log('Removed ink: ', inkId, 'New chosenInks: ', inks.value);
    }
  }
}
