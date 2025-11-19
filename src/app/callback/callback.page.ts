import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss'],
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
export class CallbackPage implements OnInit {
  constructor(private oidc: OidcSecurityService, private router: Router) {}

  ngOnInit() {
    this.oidc.checkAuthIncludingServer().subscribe({
      next: (result) => {
        if (result.isAuthenticated) {
          console.log('Login successful, navigating to main page');
          this.router.navigate(['/tabs/mainpage']);
        } else {
          console.log('Login failed, redirecting to firstpage');
          this.router.navigate(['/firstpage']);
        }
      },
      error: (err) => {
        console.error('OIDC callback error:', err);
        this.router.navigate(['/firstpage']);
      },
    });
  }
}
