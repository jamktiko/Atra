import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideNgToast } from 'ng-angular-popup';
import { environment } from './environments/environment';
import { Capacitor } from '@capacitor/core';
import { AuthInterceptor } from './app/http-interceptors/auth.interceptor';
import { AuthGuard } from './app/authguards/auth.guard';
import { AuthService } from './app/services/auth.service';
import { CustomSecureStorage } from './app/services/customsecurestorage';
import { AbstractSecurityStorage } from 'angular-auth-oidc-client';
import { provideAuth, LogLevel } from 'angular-auth-oidc-client';

const isHybrid = Capacitor.isNativePlatform();

const redirectUrl = isHybrid
  ? 'io.ionic.atra://callback'
  : window.location.origin + '/tabs/mainpage';

const postLogoutRedirectUri = isHybrid
  ? 'io.ionic.atra://logout'
  : window.location.origin + '/firstpage';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAuth({
      config: {
        clientId: '3sfdbebp66d23d5kj6svpi3qbj',
        authority:
          'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_v3KWSl9JX',
        redirectUrl,
        postLogoutRedirectUri,
        responseType: 'code',
        scope: 'email openid profile',
        silentRenew: false,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
        authWellknownEndpoints: {
          tokenEndpoint:
            'https://atra-app.auth.eu-north-1.amazoncognito.com/oauth2/token',
          userInfoEndpoint:
            'https://atra-app.auth.eu-north-1.amazoncognito.com/oauth2/userInfo',

          endSessionEndpoint: `https://atra-app.auth.eu-north-1.amazoncognito.com/logout?client_id=3sfdbebp66d23d5kj6svpi3qbj&logout_uri=${encodeURIComponent(
            postLogoutRedirectUri
          )}`,
          jwksUri:
            'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_AAeXTWJo1/.well-known/jwks.json',
        },
      },
    }),

    { provide: AbstractSecurityStorage, useClass: CustomSecureStorage },
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideNgToast(),
  ],
});
