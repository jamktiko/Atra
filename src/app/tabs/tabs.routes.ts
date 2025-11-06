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
        path: 'user/appsettings',
        loadComponent: () =>
          import('../user/components/appsettings/appsettings.page').then(
            (m) => m.AppsettingsPage
          ),
      },

      {
        path: 'user/privacy',
        loadComponent: () =>
          import('../user/components/privacy/privacy.page').then(
            (m) => m.PrivacyPage
          ),
      },

      {
        path: 'user/contacthelp',
        loadComponent: () =>
          import('../user/components/contacthelp/contacthelp.page').then(
            (m) => m.ContacthelpPage
          ),
      },

      {
        path: 'user/usersettings',
        loadComponent: () =>
          import('../user/components/usersettings/usersettings.page').then(
            (m) => m.UsersettingsPage
          ),
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
        path: 'customers/addnewcustomer',
        loadComponent: () =>
          import(
            '../customers/components/addnewcustomer/addnewcustomer.page'
          ).then((m) => m.AddnewcustomerPage),
      },

      {
        path: 'inks',
        loadComponent: () =>
          import('../inks/inks.page').then((m) => m.InksPage),
      },

      {
        path: 'inks/addnewink',
        loadComponent: () =>
          import('../inks/components/addnewink/addnewink.page').then(
            (m) => m.AddnewinkPage
          ),
      },

      {
        path: 'inks/modalink',
        loadComponent: () =>
          import('../inks/components/modalink/modalink.page').then(
            (m) => m.ModalinkPage
          ),
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
        path: 'entries/addentry',
        loadComponent: () =>
          import('../entries/components/addentry/addentry.page').then(
            (m) => m.AddentryPage
          ),
      },
      {
        path: 'entries/modalentry',
        loadComponent: () =>
          import('../entries/components/modalentry/modalentry.page').then(
            (m) => m.ModalentryPage
          ),
      },
      {
        path: 'entries/singleentry',
        loadComponent: () =>
          import('../entries/components/singleentry/singleentry.page').then(
            (m) => m.SingleentryPage
          ),
      },

      {
        path: 'mainpage',
        loadComponent: () =>
          import('../mainpage/mainpage.page').then((m) => m.MainpagePage),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('../firstpage/components/login/login.page').then(
            (m) => m.LoginPage
          ),
      },
      {
        path: 'firstpage',
        loadComponent: () =>
          import('../firstpage/firstpage.page').then((m) => m.FirstpagePage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../firstpage/components/register/register.page').then(
            (m) => m.RegisterPage
          ),
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
