import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { EntryCreation, UserInk } from 'src/interface';
import { ApiService } from 'src/app/services/api.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';

@Component({
  selector: 'app-modalentry',
  templateUrl: './modalentry.page.html',
  styleUrls: ['./modalentry.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgToastComponent, IonContent],
})
export class ModalentryPage implements OnInit {
  @Input() reviewEntry!: EntryCreation;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<EntryCreation>();

  reviewInks: UserInk[] = [];

  customerInfo!: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.loopThroughInks();
  }

  getCustomerInfo() {}

  ionViewWillEnter() {
    this.loopThroughInks();
  }

  /*
   * Funktio musteiden läpikäymiseen: forkJoin ottaa taulukon Observableja > hakee ja tallentaa reviewInksin arvot
   */
  loopThroughInks() {
    const inkArray = this.reviewEntry.inks.map((id) =>
      this.apiService.getOneUserInk(id)
    );
    forkJoin(inkArray).subscribe({
      next: (data) => {
        this.reviewInks = data;
        console.log(this.reviewInks);
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
        this.toast.warning('Something went wrong');
      },
    });
    return inkArray;
  }

  sendCancel() {
    this.cancel.emit();
  }

  sendConfirm() {
    this.confirm.emit(this.reviewEntry);
  }
}
