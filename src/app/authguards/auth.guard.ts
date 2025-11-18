// import { Injectable } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';
// import {
//   AuthenticatedResult,
//   OidcSecurityService,
// } from 'angular-auth-oidc-client';
// import { Observable, map } from 'rxjs';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private oidc: OidcSecurityService, private router: Router) {}

//   canActivate(): Observable<boolean | UrlTree> {
//     return this.oidc.isAuthenticated$.pipe(
//       map((authResult: AuthenticatedResult) => {
//         if (authResult.isAuthenticated) {
//           console.log('authResult gives true: allow access');
//           return true;
//         }
//         console.log('authResult gives false: redirect to firstpage');
//         return this.router.parseUrl('/firstpage');
//       })
//     );
//   }
// }
