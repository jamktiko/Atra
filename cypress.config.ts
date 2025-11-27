import { defineConfig } from 'cypress';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8100',
    setupNodeEvents(on, config) {
      on('task', {
        async loginCognito({ username, password }) {
          const client = new CognitoIdentityProviderClient({
            region: 'eu-north-1',
          });
          const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: config.env['COGNITO_CLIENT_ID'],
            AuthParameters: {
              USERNAME: username,
              PASSWORD: password,
            },
          });
          const response = await client.send(command);
          if (
            !response.AuthenticationResult ||
            !response.AuthenticationResult.IdToken
          ) {
            throw new Error(
              'Cognito authentication failed: missing IdToken in response'
            );
          }
          return response.AuthenticationResult.IdToken;
        },
      });
      return config;
    },
  },
});
