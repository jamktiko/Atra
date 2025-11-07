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
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-singleentry',
  templateUrl: './singleentry.page.html',
  styleUrls: ['./singleentry.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgToastComponent,
    IonModal,
    IonSearchbar,
  ],
})
export class SingleentryPage implements OnInit {
  @Input() chosenEntry!: Entry;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Entry>();

  inkGroup = new FormGroup({
    chosenInks: new FormArray([]),
  });

  get chosenInks(): FormArray {
    return this.inkGroup.get('chosenInks') as FormArray;
  }

  singleInkGet: any;

  searchInk: string = '';

  userInks: UserInk[] = [];

  showUpdateModal: boolean = false;

  constructor(
    private apiService: ApiService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUserInks();

    this.inkGroup = new FormGroup({
      chosenInks: new FormArray([]),
    });

    this.initializeChosenInks();
  }

  initializeChosenInks() {
    const formArray = this.chosenInks;
    this.chosenEntry.inks.forEach((ink: any) => {
      formArray.push(new FormControl(ink.user_ink_id));
    });
  }

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

  submit(chosenEntry: any) {
    const inkArray = this.getChosenInkIds();

    this.apiService
      .updateEntry(
        chosenEntry.entry_id,
        chosenEntry.entry_date,
        chosenEntry.comments,
        chosenEntry.customer_id,
        inkArray
      )
      .subscribe({
        next: (data) => {
          this.chosenEntry = data;
          console.log('Update success!');
          this.toggleUpdateModal(false);
          this.sendClose();
          this.toast.success('Entry updated successfully');
          this.router.navigate(['/tabs/entries']);
        },
        error: (err) => {
          console.error('Something went wrong: ', err);
        },
      });
  }

  getUserInks() {
    this.apiService.getAllUserInks().subscribe({
      next: (data) => {
        this.userInks = data;
        console.log(data);
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

  chooseInk(ink: any) {
    const inks = this.chosenInks;

    if (
      !inks.value.some((chosenInk: any) => chosenInk.id === ink.user_ink_id)
    ) {
      inks.push(
        new FormGroup({
          user_ink_id: new FormControl(ink.user_ink_id),
          product_name: new FormControl(ink.product_name),
          manufacturer: new FormControl(ink.manufacturer),
          color: new FormControl(ink.color),
          image_url: new FormControl(ink.image_url),
        })
      );
      this.chosenEntry.inks.push(ink);
    } else {
      console.log('Ink already chosen: ', ink.user_ink_id);
    }
  }

  getChosenInkIds(): number[] {
    const inkarray = this.chosenInks;
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

  // getInk(id: number) {
  //   console.log('Get ink clicked, id-number: ', id);
  //   this.apiService.getOneUserInk(id).subscribe({
  //     next: (data) => {
  //       this.singleInkGet = data;
  //     },
  //   });
  //   return this.singleInkGet;
  // }

  handleInkDelete(user_ink_id: number) {
    const inksArray = this.chosenInks;

    const index = inksArray.value.indexOf(user_ink_id);

    if (index > -1) {
      inksArray.removeAt(index);
      this.chosenEntry.inks = this.chosenEntry.inks.filter(
        (ink) => ink.user_ink_id !== user_ink_id
      );
    }
  }
}
