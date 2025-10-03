/**
 * Tabs-komponentti toimii Ionicin tabs-reitityksen ytimenä
 * Angular-routerissa otetaan sisälle tabs.routes.ts, jonka kautta sovelluksen reititys rakennetaan
 * Tärkeää, että tämän komponentin sisältöihin ei koske muut kuin käyttöliittymädevaajat!
 */

import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.css'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ triangle, ellipse, square });
  }
}
