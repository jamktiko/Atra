import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacthelp',
  templateUrl: './contacthelp.page.html',
  styleUrls: ['./contacthelp.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class ContacthelpPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  return() {
    this.router.navigate(['/tabs/user']);
  }
}
