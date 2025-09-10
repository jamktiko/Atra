import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-modalmainpage',
  templateUrl: './modalmainpage.page.html',
  styleUrls: ['./modalmainpage.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ModalmainpagePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
