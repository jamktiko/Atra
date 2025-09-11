import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-appsettings',
  templateUrl: './appsettings.page.html',
  styleUrls: ['./appsettings.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule, FormsModule],
})
export class AppsettingsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
