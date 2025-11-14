import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'user',
        loadComponent: () =>
          import('../user/user.page').then((x) => x.UserPage),
      },

      {
        path: 'customers',
        loadComponent: () =>
          import('../customers/customers.page').then((m) => m.CustomersPage),
      },

      {
        path: 'customers/modalcustomer',
        loadComponent: () =>
          import(
            '../customers/components/modalcustomer/modalcustomer.page'
          ).then((m) => m.ModalcustomerPage),
      },

      {
        path: 'inks',
        loadComponent: () =>
          import('../inks/inks.page').then((m) => m.InksPage),
      },

      {
        path: 'inks/publiclibrary',
        loadComponent: () =>
          import('../inks/components/publiclibrary/publiclibrary.page').then(
            (m) => m.PubliclibraryPage
          ),
      },

      {
        path: 'entries',
        loadComponent: () =>
          import('../entries/entries.page').then((m) => m.EntriesPage),
      },

      {
        path: 'mainpage',
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
