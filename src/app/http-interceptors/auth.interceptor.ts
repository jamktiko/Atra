import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
/*
 * AuthInterceptor fetched accessToken and automatically attaches the Bearer-token to  every HTTP-request:
 * backend can access the token and allows CRUD-methods to be executed. Configured in main.ts
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private oidc: OidcSecurityService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.oidc.getAccessToken()).pipe(
      mergeMap((token) => {
        if (token) {
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Sending to backend: ', clonedReq);
          return next.handle(clonedReq);
        }
        return next.handle(req);
      })
    );
  }
}
