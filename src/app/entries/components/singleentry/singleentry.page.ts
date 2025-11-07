import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormArray, FormControl, FormGroup } from '@angular/forms';
import { IonContent, IonModal } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Entry, UserInk } from 'src/interface';

@Component({
  selector: 'app-singleentry',
  templateUrl: './singleentry.page.html',
  styleUrls: ['./singleentry.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgToastComponent, IonModal],
})
export class SingleentryPage implements OnInit {
  @Input() chosenEntry!: Entry;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Entry>();

  inkGroup = new FormGroup({
    chosenInks: new FormArray([]),
  });

  singleInkGet: any;

  searchInk: string = '';

  userInks: UserInk[] = [];

  showUpdateModal: boolean = false;

  constructor(
    private apiService: ApiService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit() {}

  sendClose() {
    this.close.emit();
  }

  sendDelete(chosenEntry: Entry) {
    this.delete.emit(chosenEntry);
    this.close.emit();
  }

  toggleUpdateModal(show: boolean) {
    this.showUpdateModal = show;
  }

  updateEntry(chosenEntry: any) {
    const dateString = chosenEntry.entry_date.toLocaleDateString('en-CA');
    this.apiService
      .updateEntry(
        chosenEntry.entry_id,
        dateString,
        chosenEntry.comments,
        chosenEntry.customer_id,
        chosenEntry.replace_user_ink_id
      )
      .subscribe({
        next: (data) => {
          this.chosenEntry = data;
          this.router.navigate(['/tabs/entries']);
        },
        error: (err) => {
          console.error('Something went wrong: ', err);
        },
      });
  }

  filteredInks(): any {
    const search = this.searchInk.toLowerCase() ?? '';

    return this.userInks.filter(
      (ink) =>
        ink.product_name.toLowerCase().includes(search) ||
        ink.color.toLowerCase().includes(search) ||
        ink.manufacturer.toLowerCase().includes(search)
    );
  }

  chooseInk(ink: UserInk) {
    const inks = this.getChosenInks();

    if (
      !inks.value.some((chosenInk: any) => chosenInk.id === ink.user_ink_id)
    ) {
      inks.push(
        new FormGroup({
          user_ink_id: new FormControl(ink.user_ink_id),
          batch_number: new FormControl(ink.batch_number),
          opened_at: new FormControl(ink.opened_at),
          expires_at: new FormControl(ink.expires_at),
          favorite: new FormControl(ink.favorite),
          publicink_ink_id: new FormControl(ink.publicink_ink_id),
          product_name: new FormControl(ink.product_name),
          manufacturer: new FormControl(ink.manufacturer),
          color: new FormControl(ink.color),
          recalled: new FormControl(ink.recalled),
          image_url: new FormControl(ink.image_url),
          size: new FormControl(ink.size),
          User_user_id: new FormControl(ink.User_user_id),
        })
      );

      console.log(inks.value);
    } else {
      console.log('Ink already chosen: ', ink.user_ink_id);
      console.log(inks.value);
    }
  }

  getChosenInks(): FormArray {
    return this.inkGroup.get('chosenInks') as FormArray;
  }

  getChosenInkIds(): number[] {
    const inkarray = this.getChosenInks();
    if (!inkarray) {
      return [];
    } else {
      const inkIds: number[] = [];

      for (let i = 0; i < inkarray.length; i++) {
        const inkGroupInArray = inkarray.at(i) as FormGroup;
        const idNumber = inkGroupInArray.get('user_ink_id')?.value;
        inkIds.push(idNumber);
      }
      console.log(inkIds);
      return inkIds;
    }
  }

  getInk(id: number) {
    console.log('Get ink clicked, id-number: ', id);
    this.apiService.getOneUserInk(id).subscribe({
      next: (data) => {
        this.singleInkGet = data;
      },
    });
    return this.singleInkGet;
  }
}
