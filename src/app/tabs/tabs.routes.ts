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
        children: [
          {
            path: 'usersettings',
            loadComponent: () =>
              import('../user/components/usersettings/usersettings.page').then(
                (m) => m.UsersettingsPage
              ),
          },
          {
            path: 'appsettings',
            loadComponent: () =>
              import('../user/components/appsettings/appsettings.page').then(
                (m) => m.AppsettingsPage
              ),
          },
          {
            path: 'privacy',
            loadComponent: () =>
              import('../user/components/privacy/privacy.page').then(
                (m) => m.PrivacyPage
              ),
          },
          {
            path: 'contacthelp',
            loadComponent: () =>
              import('../user/components/contacthelp/contacthelp.page').then(
                (m) => m.ContacthelpPage
              ),
          },
        ],
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('../customers/customers.page').then((m) => m.CustomersPage),
        children: [
          {
            path: 'modalcustomer',
            loadComponent: () =>
              import(
                '../customers/components/modalcustomer/modalcustomer.page'
              ).then((m) => m.ModalcustomerPage),
          },
          {
            path: 'addnewcustomer',
            loadComponent: () =>
              import(
                '../customers/components/addnewcustomer/addnewcustomer.page'
              ).then((m) => m.AddnewcustomerPage),
          },
        ],
      },
      {
        path: 'inks',
        loadComponent: () =>
          import('../inks/inks.page').then((m) => m.InksPage),
        children: [
          {
            path: 'addnewink',
            loadComponent: () =>
              import('../inks/components/addnewink/addnewink.page').then(
                (m) => m.AddnewinkPage
              ),
          },
          {
            path: 'modalink',
            loadComponent: () =>
              import('../inks/components/modalink/modalink.page').then(
                (m) => m.ModalinkPage
              ),
          },
        ],
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
        children: [
          {
            path: 'addentry',
            loadComponent: () =>
              import('../entries/components/addentry/addentry.page').then(
                (m) => m.AddentryPage
              ),
          },
          {
            path: 'modalentry',
            loadComponent: () =>
              import('../entries/components/modalentry/modalentry.page').then(
                (m) => m.ModalentryPage
              ),
          },
        ],
      },
      {
        path: 'mainpage',
        loadComponent: () =>
          import('../mainpage/mainpage.page').then((m) => m.MainpagePage),
        children: [
          {
            path: 'entrymainpage',
            loadComponent: () =>
              import(
                '../mainpage/components/entrymainpage/entrymainpage.page'
              ).then((m) => m.EntrymainpagePage),
          },
          {
            path: 'modalmainpage',
            loadComponent: () =>
              import(
                '../mainpage/components/modalmainpage/modalmainpage.page'
              ).then((m) => m.ModalmainpagePage),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/mainpage',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/mainpage',
    pathMatch: 'full',
  },
];
