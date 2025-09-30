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
  IonModal,
} from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';

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
  allInks: PublicInk[] = publicInks;
  isModalOpen: boolean = false;
  searchItem: string = '';
  selectedInk: any;

  constructor(private apiService: ApiService) {}

  chooseInk(isOpen: boolean, ink: any) {
    this.isModalOpen = isOpen;
    this.selectedInk = ink;
  }

  setClosed(isOpen: boolean) {
    this.isModalOpen = false;
  }

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
