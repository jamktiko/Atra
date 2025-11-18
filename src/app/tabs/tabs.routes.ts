import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../authguards/auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'user',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('../user/user.page').then((x) => x.UserPage),
      },

      {
        path: 'customers',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('../customers/customers.page').then((m) => m.CustomersPage),
      },

      {
        path: 'customers/modalcustomer',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            '../customers/components/modalcustomer/modalcustomer.page'
          ).then((m) => m.ModalcustomerPage),
      },

      {
        path: 'inks',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('../inks/inks.page').then((m) => m.InksPage),
      },

      {
        path: 'inks/publiclibrary',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('../inks/components/publiclibrary/publiclibrary.page').then(
            (m) => m.PubliclibraryPage
          ),
      },

      {
        path: 'entries',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('../entries/entries.page').then((m) => m.EntriesPage),
      },

      {
        path: 'mainpage',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('../mainpage/mainpage.page').then((m) => m.MainpagePage),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/mainpage',
    pathMatch: 'full',
  },
];
