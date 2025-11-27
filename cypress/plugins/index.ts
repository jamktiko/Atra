const {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

interface LoginCognitoCredentials {
  username: string;
  password: string;
}

type TaskHandler = (...args: any[]) => any;

interface PluginOn {
  (event: 'task', tasks: Record<string, TaskHandler>): void;
}

interface PluginConfig {
  [key: string]: any;
}

module.exports = (on: PluginOn, config: PluginConfig) => {
  on('task', {
    async loginCognito({
      username,
      password,
    }: LoginCognitoCredentials): Promise<string | undefined> {
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
      return response.AuthenticationResult.IdToken;
    },
  });
};
