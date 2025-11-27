import { Component, OnInit, output, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, FormGroup, FormArray } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonModal,
} from '@ionic/angular/standalone';
import { Entry, ListEntries, UserInk } from 'src/interface';
import { IonSearchbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import {
  NgToastComponent,
  NgToastService,
  TOAST_POSITIONS,
  ToastPosition,
} from 'ng-angular-popup';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { filter } from 'rxjs';
import { SingleentryPage } from './components/singleentry/singleentry.page';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  styleUrls: [],
  standalone: true,
  imports: [
    IonContent,
    // IonHeader,
    // IonTitle,
    // IonToolbar,
    IonSearchbar,
    CommonModule,
    FormsModule,

    SingleentryPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EntriesPage implements OnInit {
  entries: ListEntries[] = [];

  searchItem: string = '';

  singleEntryModal: boolean = false;

  chosenEntry!: Entry;

  groupedEntries: { date: string; entries: ListEntries[] }[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.loadEntries();
  }

  ionViewDidEnter() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/tabs/entries') {
          this.loadEntries();
        }
      });
  }

  ionViewWillEnter() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/tabs/entries') {
          this.loadEntries();
        }
      });
  }

  filteredEntries() {
    const search = this.searchItem.toLowerCase() ?? '';

    const filtered = this.entries.filter(
      (entry) =>
        (entry.first_name?.toLowerCase() ?? '').includes(search) ||
        (entry.last_name?.toLowerCase() ?? '').includes(search) ||
        (entry.entry_date?.toLowerCase?.() ?? '').includes(search)
    );

    this.sortByDate(filtered);

    return this.groupedEntries;
  }

  resetSearch() {
    this.searchItem = '';
    this.loadEntries();
  }
  handleClosed() {
    this.singleEntryModal = false;
    this.loadEntries();
  }

  chooseEntry(show: boolean, entryId: number) {
    this.apiService.getOneEntry(entryId).subscribe({
      next: (data) => {
        this.chosenEntry = data;
        this.singleEntryModal = show;
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
      },
    });
  }

  loadEntries() {
    this.apiService.getAllEntries().subscribe({
      next: (data) => {
        this.entries = data;
        this.sortByDate(this.entries);
      },
      error: (err) => {
        console.error('No entries found: ', err);
        this.toast.warning('Something went wrong');
      },
    });
  }

  deleteEntry(chosenEntry: any) {
    this.apiService.deleteEntry(chosenEntry.entry_id).subscribe({
      next: (data) => {
        this.chosenEntry = data;
        this.toast.success('Entry deleted successfully');
        this.loadEntries();
      },
      error: (err) => {
        console.error('Something went wrong: ', err);
        this.toast.warning('Something went wrong');
      },
    });
  }

  addNew() {
    this.router.navigate(['/tabs/entries/addentry']);
  }

  /**
   * Funktio lajittelee kirjaukset päiväyksen perusteella
   * @param entries Entry[] = array of Entry interface shaped objects
   * Paremetrina annettu taulukko entries haetaan ApiServicen avulla tietokannasta. Alustetaan ngOnInit-funktiossa.
   * @returns groupedEntries: Record<string, Entry[]> {} = an object filled with date string as key and Entry array of single entries as value
   *  tallennetaan Record-muodossa (avain-arvo-pareina), joka tallentaa päivän eli date string-avaimeksi, ja se ottaa taulukon kirjauksia eli Entryjä arvokseen.
   *
   * const dateObj = new Date(entries[i].entry_date);
      const date = dateObj.toLocaleDateString('en-CA').split('T')[0];
  * tulostaa muodossa YYYY-MM-DDT00:00:0000
   * 'T' toimii ajanerottajana (time separator) eli erottaa ajan päivämäärästä > saadaan pelkkä kellonaika 00:00:0000
   *
   * sorted[date] etsii taulukon kyseisen date-muuttujan arvolla, eli etsii kyseisen key-arvon
   * if (!(date in sorted)) tarkistaa, sisältääkö sorted-objekti key-arvoa date (eli sisältääkö kyseistä päivämäärää)
   * Jos antaa true > kyseistä päivämäärää ei vielä ole, ja se luo sille tyhjän taulukon arvoksi
   * Jos antaa false > kyseinen päivämäärä on jo olemassa, ja siirrytään suoraan riville sorted[date].push(entries[i]);
   *
   * Lopussa groupedEntries lajitellaan uusimmasta vanhimpaan .map ja .sort-metodeiden avulla
   *
   */
  sortByDate(entries: ListEntries[]) {
    let sorted: Record<string, ListEntries[]> = {};

    for (let i = 0; i < entries.length; i++) {
      const dateObj = new Date(entries[i].entry_date);
      const date = dateObj.toLocaleDateString('en-CA').split('T')[0];

      if (!(date in sorted)) {
        sorted[date] = [];
      }

      sorted[date].push(entries[i]);
    }

    this.groupedEntries = Object.entries(sorted)
      .map(([date, entries]) => ({ date, entries }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
