import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Entry } from 'src/interface';
import { IonSearchbar } from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { of, map, mergeMap, reduce, groupBy, toArray } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  styleUrls: [],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    CommonModule,
    FormsModule,
  ],
})
export class EntriesPage implements OnInit {
  entries: Entry[] = [];

  searchItem: string = '';

  groupedEntries: { date: string; entries: Entry[] }[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.apiService.getAllEntries().subscribe({
      next: (data) => {
        this.entries = data;
        this.sortByDate(this.entries);
      },
      error: (err) => {
        console.error('No entries found: ', err);
      },
    });
  }

  updateEntry() {}

  deleteEntry() {}

  addNew() {
    this.router.navigate(['/tabs/entries/addentry']);
  }

  filteredSearch() {}

  /**
   * Funktio lajittelee kirjaukset päiväyksen perusteella
   * @param entries Entry[] = array of Entry interface shaped objects
   * Paremetrina annettu taulukko entries haetaan ApiServicen avulla tietokannasta. Alustetaan ngOnInit-funktiossa.
   * @returns groupedEntries: Record<string, Entry[]> {} = an object filled with date string as key and Entry array of single entries as value
   *  tallennetaan Record-muodossa (avain-arvo-pareina), joka tallentaa päivän eli date string-avaimeksi, ja se ottaa taulukon kirjauksia eli Entryjä arvokseen.
   *
   * const date = entries[i].appointment_date
        .toLocaleDateString('en-CA')
        .split('T')[0];
   * * .toLocaleDateString('en-CA') tulostaa muodossa YYYY-MM-DDT00:00:0000
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
  sortByDate(entries: Entry[]) {
    let sorted: Record<string, Entry[]> = {};

    for (let i = 0; i < entries.length; i++) {
      const date = entries[i].appointment_date
        .toLocaleDateString('en-CA')
        .split('T')[0];

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
