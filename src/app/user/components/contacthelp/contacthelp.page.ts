import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-contacthelp',
  templateUrl: './contacthelp.page.html',
  styleUrls: ['./contacthelp.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule, FormsModule],
})
export class ContacthelpPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
