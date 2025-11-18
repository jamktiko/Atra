import { Routes } from '@angular/router';
// import { AuthGuard } from './authguards/auth.guard';

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
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./inks/components/addnewink/addnewink.page').then(
        (m) => m.AddnewinkPage
      ),
  },
  {
    path: 'inks/modalink',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./inks/components/modalink/modalink.page').then(
        (m) => m.ModalinkPage
      ),
  },
  {
    path: 'tabs/customers/addnewcustomer',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./customers/components/addnewcustomer/addnewcustomer.page').then(
        (m) => m.AddnewcustomerPage
      ),
  },
  {
    path: 'tabs/entries/addentry',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./entries/components/addentry/addentry.page').then(
        (m) => m.AddentryPage
      ),
  },

  {
    path: 'entries/singleentry',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./entries/components/singleentry/singleentry.page').then(
        (m) => m.SingleentryPage
      ),
  },
  {
    path: 'entries/modalentry',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./entries/components/modalentry/modalentry.page').then(
        (m) => m.ModalentryPage
      ),
  },
  {
    path: 'tabs/user/usersettings',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./user/components/usersettings/usersettings.page').then(
        (m) => m.UsersettingsPage
      ),
  },
  {
    path: 'tabs/user/contacthelp',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./user/components/contacthelp/contacthelp.page').then(
        (m) => m.ContacthelpPage
      ),
  },
  {
    path: 'tabs/user/privacy',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./user/components/privacy/privacy.page').then(
        (m) => m.PrivacyPage
      ),
  },
  {
    path: 'tabs/user/appsettings',
    // canActivate: [AuthGuard],
    loadComponent: () =>
      import('./user/components/appsettings/appsettings.page').then(
        (m) => m.AppsettingsPage
      ),
  },

  {
    path: 'firstpage',
    loadComponent: () =>
      import('./firstpage/firstpage.page').then((m) => m.FirstpagePage),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./firstpage/components/login/login.page').then(
        (m) => m.LoginPage
      ),
  },
  {
    path: '',
    redirectTo: '/firstpage',
    pathMatch: 'full',
  },
  {
    path: 'callback',
    loadComponent: () =>
      import('./callback/callback.page').then((m) => m.CallbackPage),
  },
];
