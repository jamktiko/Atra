import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-usersettings',
  templateUrl: './usersettings.page.html',
  styleUrls: ['./usersettings.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule, FormsModule],
})
export class UsersettingsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
