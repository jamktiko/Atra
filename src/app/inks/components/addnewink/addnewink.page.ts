import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, FormGroup, FormArray } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonList,
  IonHeader,
  IonToolbar,
  IonListHeader,
  IonSelect,
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
    IonList,
    IonSearchbar,

    ModalinkPage,
  ],
})
export class AddnewinkPage implements OnInit {
  publicInks: PublicInk[] = publicInks; //apiservicestä kun on oikeat datat!
  searchItem: string = '';
  showReview: boolean = false;
  //inkGroup alustaa sen,
  inkGroup = new FormGroup({
    chosenInks: new FormArray([]),
  });

  constructor() {}

  ngOnInit() {}

  review() {
    this.showReview = true;
  }

  filteredInks(): PublicInk[] {
    const search = this.searchItem.toLowerCase();
    return this.publicInks.filter(
      (ink) =>
        ink.product_name.toLowerCase().includes(search) ||
        ink.color.toLowerCase().includes(search) ||
        ink.manufacturer.toLowerCase().includes(search)
    );
  }

  chooseInk(ink: PublicInk) {
    const inks = this.inkGroup.get('chosenInks') as FormArray;

    if (!inks.value.includes(ink.id)) {
      inks.push(new FormControl(ink.id));
      console.log(inks.value);
    } else {
      console.log('Ink already chosen: ', ink.id);
      console.log(inks.value);
    }
  }

  handleCancel() {
    this.showReview = false;
  }
}
