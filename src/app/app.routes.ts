import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },  {
    path: 'logout',
    loadComponent: () => import('./user/components/logout/logout.page').then( m => m.LogoutPage)
  },

];
