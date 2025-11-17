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
import { AuthInterceptor } from './app/http-interceptors/auth.interceptor';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideNgToast } from 'ng-angular-popup';
import { provideAuth, LogLevel } from 'angular-auth-oidc-client';
import { environment } from './environments/environment';
import { AuthGuard } from './app/authguards/auth.guard';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './app/services/auth.service';

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

    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideNgToast(),
    provideAuth({
      config: {
        authority: environment.cognitoUserPoolAuthority,
        clientId: environment.cognitoClientId,
        redirectUrl,
        postLogoutRedirectUri,
        responseType: 'code',
        scope: 'aws.cognito.signin.user.admin email openid phone profile',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
      },
    }),
    { provide: AuthGuard },
    AuthService,
  ],
});

export { isHybrid };
