import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.page.html',
  styleUrls: ['./callback.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class CallbackPage implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    const isAuth = await this.auth.checkAuth();
    if (isAuth) {
      this.router.navigate(['/tabs/mainpage']);
    }
  }
}
