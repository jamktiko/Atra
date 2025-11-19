import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CustomSecureStorage } from './customsecurestorage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public oidc: OidcSecurityService,
    private router: Router,
    private storage: CustomSecureStorage
  ) {}

  /*
   * Calls for Cognito's Hosted UI and redirects to that hosted login page: handles also registration, forgot password etc.
   */

  login() {
    this.oidc.authorize();
  }

  /*
   * Calls for OIDC-logoff-method which also revokes access_token and refresh_token
   */

  async logout(): Promise<void> {
    try {
      // 1️⃣ Clear stored tokens
      this.storage.clear();
      console.log('CustomSecureStorage cleared');

      // 2️⃣ Call OIDC logoff
      await this.oidc.logoff().subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.error('Error: ', err);
        },
      }); // automatically clears runtime state and redirects
      console.log('OIDC logoff called');
    } catch (err) {
      console.error('Logout failed: ', err);
    }
  }

  /*
   * The checkAuth OIDC-library method returns an RxJS Observable that emits a LoginResponse object once the authentication check is complete.
   * The accessToken value is then picked from that object and set to key of 'access_token'
   * If resreshToken exists, it is also set and collected
   */

  async checkAuth(): Promise<boolean> {
    const result = await firstValueFrom(this.oidc.checkAuth());
    if (result.isAuthenticated) {
      // save tokens to storage for page reloads
      if (result.accessToken)
        this.storage.write('access_token', result.accessToken);
      if (result.idToken) this.storage.write('id_token', result.idToken);
    }
    return result.isAuthenticated;
  }

  async getAccessToken(): Promise<string | null> {
    return firstValueFrom(this.oidc.getAccessToken());
  }
}
