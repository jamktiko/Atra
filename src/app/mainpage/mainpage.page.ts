import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { User } from 'src/interface';
import { Tiina } from 'src/temporarydata';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.page.html',
  styleUrls: ['./mainpage.page.css'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class MainpagePage implements OnInit {
  /**
   * Hakee käyttäjätiedot myöhemmin AuthServicen avulla tietokannasta, mutta tässä vaiheessa
   * kovakoodattu käyttäjädata temporarydata.ts-tiedostosta
   */
  user: User = Tiina;

  /**
   * Tervehdys, joka käyttäjälle generoidaan etusivulle. Ottaa src-kansiossa olevan greet.js-tiedoston
   * funktion ja toteuttaa sen greetings.json välittämällä datalla
   */
  greeting: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {}
}
