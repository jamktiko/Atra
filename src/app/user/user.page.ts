import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LogoutPage } from './components/logout/logout.page';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.css'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, LogoutPage],
})
export class UserPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  appsettingsNavigate() {
    this.router.navigate(['/tabs/user/appsettings']);
  }

  contacthelpNavigate() {
    this.router.navigate(['/tabs/user/contacthelp']);
  }

  privacyNavigate() {
    this.router.navigate(['/tabs/user/privacy']);
  }

  usersettingsNavigate() {
    this.router.navigate(['/tabs/user/usersettings']);
  }

  logout() {
    console.log('Logout clicked');
  }
}
