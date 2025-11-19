import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CustomSecureStorage } from 'src/app/services/customsecurestorage';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LogoutPage implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private storage: CustomSecureStorage
  ) {}

  ngOnInit() {}

  async logout() {
    console.log('User clicked logout');
    await this.auth.logout(); // Hosted UI + local cache cleared
  }
}
