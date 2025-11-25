import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { RecalledInk } from 'src/interface';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { greetingsData } from 'src/greetings';
import { inkData } from 'src/inkdata';

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
   * Greeting that is generated to front page. Gets data from greetings.ts
   */
  greeting: string = '';

  /*
   *
   */
  username: string = '';

  recalledInk: RecalledInk = { name: '', url: '', batchnumber: '', risk: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.greeting = this.getRandomGreeting(greetingsData);
    this.generateRecall(inkData);
  }

  getRandomGreeting(greetingsData: string[]) {
    const greetings = greetingsData;
    const index = Math.floor(Math.random() * greetings.length);
    return greetings[index];
  }

  generateRecall(inkData: any) {
    const inks = inkData;

    inks.forEach((ink: RecalledInk, index: number) => {
      setTimeout(() => {
        this.recalledInk = ink;
        if (this.recalledInk.name === 'RELOOP') {
          this.generateRecall(inkData);
        }
      }, index * 4000);
    });
  }
}
