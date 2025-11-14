import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { LoginPage } from './components/login/login.page';

@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.page.html',
  styleUrls: ['./firstpage.page.css'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LoginPage],
})
export class FirstpagePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
