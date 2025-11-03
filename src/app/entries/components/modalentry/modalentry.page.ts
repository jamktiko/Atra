import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { EntryCreation, UserInk } from 'src/interface';
import { ApiService } from 'src/app/services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-modalentry',
  templateUrl: './modalentry.page.html',
  styleUrls: ['./modalentry.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule],
})
export class ModalentryPage implements OnInit {
  @Input() reviewEntry!: EntryCreation;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<EntryCreation>();

  reviewInks: UserInk[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
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
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
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
