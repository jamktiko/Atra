import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

interface LoginCognitoCredentials {
  username: string;
  password: string;
}

export default (on: any, config: any) => {
  on('task', {
    async loginCognito({ username, password }: LoginCognitoCredentials) {
      const client = new CognitoIdentityProviderClient({
        region: 'eu-north-1',
      });

      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: Cypress.env('COGNITO_CLIENT_ID') as string,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response = await client.send(command);

      if (!response.AuthenticationResult) {
        throw new Error('Cognito login failed: ' + JSON.stringify(response));
      }

      return response.AuthenticationResult; // { IdToken, AccessToken, RefreshToken }
    },
  });
};
