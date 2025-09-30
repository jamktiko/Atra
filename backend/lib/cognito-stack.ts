import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps, aws_cognito as cognito } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Parameters } from '../helpers';

// Cognito Stack joka luo User Poolin ja User Pool Clientin
export class CognitoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ssm = new Parameters(this);
    const frontendDomain = ssm.distributionDomainName;

    const userPool = this.createUserPool();
    const userPoolClient = this.createUserPoolClient(userPool, frontendDomain);

    ssm.cognitoUserPoolId = userPool.userPoolId;
    ssm.cognitoClientId = userPoolClient.userPoolClientId;
  }

  // Luo User Poolin (eli käyttäjätietokanta)
  createUserPool() {
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'users',
      selfSignUpEnabled: true, // salli käyttäjien itse rekisteröityä
      signInAliases: { email: true }, // kirjaudu sisään sähköpostilla
      autoVerify: { email: true }, // vahvista sähköposti automaattisesti
      passwordPolicy: {
        // salasanapolitiikka
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
        requireDigits: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // tämä tarkoittaa, että user pool poistetaan stackin poistamisen yhteydessä -> ei tuotantokäytössä (RETAIN)!
      //accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      //userVerification: {
      // emailSubject: 'Welcome to Atra App!',
      // emailBody: 'Click the link to activate your account: {####}',
      // emailStyle: cognito.VerificationEmailStyle.LINK,
      //},
    });
    return userPool;
  }

  // Luo User Pool Clientin (= sovellus, joka käyttää User Poolia)
  // client on se, joka hoitaa kirjautumisen ja tokenien hallinnan
  // clientin kautta käyttäjät voi kirjautua sisään ja saada JWT tokenit,
  // joita API GW voi sitten validoida
  createUserPoolClient(userPool: cognito.UserPool, frontendDomain: string) {
    const client = userPool.addClient('cognitoClient', {
      userPoolClientName: 'AtraAppClient',
      // salli nämä auth flowt = tavat kirjautua:
      authFlows: {
        userPassword: true,
        userSrp: true, // Secure Remote Password (SRP) -protokolla, eli salasanaa ei lähetetä suoraan
      },
      // attribuutit, joita client pyytää käyttäjältä rekisteröityessä
      writeAttributes: new cognito.ClientAttributes().withStandardAttributes({
        givenName: true,
        familyName: true,
        email: true,
      }),
      // OAuth 2.0 asetukset = miten client hoitaa kirjautumisen
      oAuth: {
        flows: {
          // authorizationCodeGrant eli koodivaihe, jossa käyttäjä ohjataan Cognitoon kirjautumaan
          // ja Cognito palauttaa koodin, jolla client voi hakea tokenit
          authorizationCodeGrant: true,
        },
        // callbackUrl: mihin Cognito palauttaa käyttäjän kirjautumisen jälkeen
        // logoutUrl: mihin käyttäjä ohjataan uloskirjautumisen jälkeen
        // !!!!!!! REPLACE WITH CLOUDFRONT DOMAIN !!!!!!!!!!!!
        callbackUrls: [`https://${frontendDomain}/*`],
        logoutUrls: [`https://${frontendDomain}/logout`],
      },
    });
    return client;
  }
}
