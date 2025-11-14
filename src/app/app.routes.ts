import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./user/components/logout/logout.page').then((m) => m.LogoutPage),
  },

  {
    path: 'inks/addnewink',
    loadComponent: () =>
      import('./inks/components/addnewink/addnewink.page').then(
        (m) => m.AddnewinkPage
      ),
  },
  {
    path: 'inks/modalink',
    loadComponent: () =>
      import('./inks/components/modalink/modalink.page').then(
        (m) => m.ModalinkPage
      ),
  },
  {
    path: 'tabs/customers/addnewcustomer',
    loadComponent: () =>
      import('./customers/components/addnewcustomer/addnewcustomer.page').then(
        (m) => m.AddnewcustomerPage
      ),
  },
  {
    path: 'tabs/entries/addentry',
    loadComponent: () =>
      import('./entries/components/addentry/addentry.page').then(
        (m) => m.AddentryPage
      ),
  },
  {
    path: 'firstpage',
    loadComponent: () =>
      import('./firstpage/firstpage.page').then((m) => m.FirstpagePage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./firstpage/components/register/register.page').then(
        (m) => m.RegisterPage
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./firstpage/components/login/login.page').then(
        (m) => m.LoginPage
      ),
  },
  {
    path: 'entries/singleentry',
    loadComponent: () =>
      import('./entries/components/singleentry/singleentry.page').then(
        (m) => m.SingleentryPage
      ),
  },
  {
    path: 'entries/modalentry',
    loadComponent: () =>
      import('./entries/components/modalentry/modalentry.page').then(
        (m) => m.ModalentryPage
      ),
  },
  {
    path: 'tabs/user/usersettings',
    loadComponent: () =>
      import('./user/components/usersettings/usersettings.page').then(
        (m) => m.UsersettingsPage
      ),
  },
  {
    path: 'tabs/user/contacthelp',
    loadComponent: () =>
      import('./user/components/contacthelp/contacthelp.page').then(
        (m) => m.ContacthelpPage
      ),
  },
  {
    path: 'tabs/user/privacy',
    loadComponent: () =>
      import('./user/components/privacy/privacy.page').then(
        (m) => m.PrivacyPage
      ),
  },
  {
    path: 'tabs/user/appsettings',
    loadComponent: () =>
      import('./user/components/appsettings/appsettings.page').then(
        (m) => m.AppsettingsPage
      ),
  },
];
