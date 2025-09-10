import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },

  {
    path: 'header',
    loadComponent: () =>
      import('./shared/header/header.page').then((m) => m.HeaderPage),
  },
  {
    path: 'universalmodal',
    loadComponent: () =>
      import('./shared/universalmodal/universalmodal.page').then(
        (m) => m.UniversalmodalPage
      ),
  },
];
