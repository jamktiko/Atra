/**
 * Authservice käsittelee käyttäjän kirjautumisen hallinnoinnin käyttöliittymässä.
 */

import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { App } from '@capacitor/app';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oidc: OidcSecurityService) {
    App.addListener('appUrlOpen', async (event: any) => {
      if (event.url.startsWith('io.ionic.atra://callback')) {
        await this.oidc.checkAuthIncludingServer();
        await this.checkAuth();
      }
    });
  }

  /*
   * Calls for Cognito's Hosted UI and redirects to that hosted login page: handles also registration, forgot password etc.
   */
  login() {
    this.oidc.authorize();
  }

  /*
   * Calls for OIDC-logoff-method which also revokes access_token and refresh_token
   */
  async logout() {
    await this.oidc.logoffAndRevokeTokens();
    await SecureStoragePlugin.remove({ key: 'access_token' });
    await SecureStoragePlugin.remove({ key: 'refresh_token' });
  }

  /*
   * The checkAuth OIDC-library method returns an RxJS Observable that emits a LoginResponse object once the authentication check is complete.
   * The accessToken value is then picked from that object and set to key of 'access_token'
   * If resreshToken exists, it is also set and collected
   */
  async checkAuth() {
    const result = await firstValueFrom(this.oidc.checkAuth());
    if (result.isAuthenticated) {
      await SecureStoragePlugin.set({
        key: 'access_token',
        value: result.accessToken,
      });
    }
    const refreshToken = await firstValueFrom(this.oidc.getRefreshToken());
    if (refreshToken) {
      await SecureStoragePlugin.set({
        key: 'refresh_token',
        value: refreshToken,
      });
    }
    return result.isAuthenticated;
  }

  async storeRefreshToken(refreshToken: string) {
    await SecureStoragePlugin.set({
      key: 'refresh_token',
      value: refreshToken,
    });
  }
  /*
   * Fetches the value set to access_token during
  * SecureStoragePlugin.set({
          key: 'access_token',
          value: result.accessToken,
        });
   */
  async getAccessToken() {
    const { value } = await SecureStoragePlugin.get({ key: 'access_token' });
    return value;
  }

  /*
   * Fetches refresh_token manually if needed at some point
   * However, useRefreshToken: true and silentRenew: true in main.ts provideAuth handles automatic refresh token
   * fetch when the access token expires: only need to store securely
   */
  async getRefreshToken() {
    const { value } = await SecureStoragePlugin.get({ key: 'refresh_token' });
    return value;
  }
}
