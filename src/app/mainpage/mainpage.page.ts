import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { User } from 'src/interface';
import { Tiina } from 'src/temporarydata';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.page.html',
  styleUrls: ['./mainpage.page.css'],
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
export class MainpagePage implements OnInit {
  user: User = Tiina;
  data!: any;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getTables().subscribe({
      next: (data) => {
        this.data = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Jodain meni bieleen: ', err);
      },
    });
  }
}
