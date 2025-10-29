import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { IonSearchbar } from '@ionic/angular/standalone';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';
import { UserInk } from 'src/interface';
import {
  FormsModule,
  FormControl,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-addentry',
  templateUrl: './addentry.page.html',
  styleUrls: ['./addentry.page.css'],
  standalone: true,
  imports: [
    NgToastComponent,
    IonContent,
    CommonModule,
    FormsModule,
    IonSearchbar,
  ],
})
export class AddentryPage implements OnInit {
  searchInk: string = '';
  searchCustomer: string = '';

  userInks: UserInk[] = [];

  inksToAdd: any = [];

  /* Muuttuja, jonka avulla ylläpidetään modalentry-komponentin näkyvyyttä */
  showReview: boolean = false;

  /**
   * FormGroup, johon tallennetaan valitut musteet eli chosenInks FormArraynaFormGroupeja
   * Eli chosenInks: new FormArray([FormGroup: {inkid: value, productname: value...}])
   * */
  inkGroup = new FormGroup({
    chosenInks: new FormArray([]),
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.getUserInks();
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
}
