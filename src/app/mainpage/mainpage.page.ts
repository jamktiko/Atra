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
    // IonHeader,
    // IonTitle,
    // IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class MainpagePage implements OnInit {
  /**
   * Greeting that is generated to front page. Gets data from greetings.ts, and
   * is set in ngOnInit() when component gets rendered
   */
  greeting: string = '';

  /**
   * Greeting that is generated to front page. Gets value from setGreeting1 that gets
   * called during ngOnInit() when component gets rendered
   */
  greeting1: string = '';

  /*
   * Gets value from ApiService method and sets value
   */
  username!: string;

  recalledInk: RecalledInk = { name: '', url: '', batchnumber: '', risk: '' };

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.greeting = this.getRandomGreeting(greetingsData);
    this.generateRecall(inkData);
    this.setGreeting1();
    this.getUsername();
    console.log('Username: ', this.username);
  }

  /**
   * Fetches user's first_name with apiservice method getUser() that returns first_name from User
   * Then sets variable username value as returned value
   */
  getUsername() {
    this.apiService.getUser().subscribe({
      next: (data) => {
        this.username = data.first_name;
        console.log(data);
      },
    });
  }

  /*
   * Generates random number and fetches string in an index of array
   * @param greetingsData: Array of strings; string[]
   * returns string in greetings[index]
   */
  getRandomGreeting(greetingsData: string[]) {
    const greetings = greetingsData;
    const index = Math.floor(Math.random() * greetings.length);
    return greetings[index];
  }

  /*
   * Simulates recalled inks new section in the mainpage
   * Uses recursion to create illusion of continuous loop
   * @param inkData = Array of Objects of interface RecalledInk [{}]
   * recalledInk-variable value gets changed after every index * 4000ms iteration
   */
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

  /*
   * Generates greeting according to current time
   * new Date().getHours() method fetches current hours of day
   * if-else-block checks the time and returns an according value
   * class variable greeting1 value will be set accordingly
   */

  setGreeting1() {
    const hour = new Date().getHours();

    if (hour < 12) {
      this.greeting1 = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      this.greeting1 = 'Good afternoon';
    } else {
      this.greeting1 = 'Good evening';
    }
  }
}
