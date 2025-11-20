import * as cdk from 'aws-cdk-lib';
import {
  Stack,
  StackProps,
  aws_cognito as cognito,
  aws_ec2 as ec2,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Parameters, LambdaBuilder } from '../helpers';

interface CognitoStackProps extends StackProps {
  vpc: ec2.IVpc;
  rdsSecretName: string;
}

// Cognito stack that creates User Pool and User Pool Client
export class CognitoStack extends Stack {
  private vpc: ec2.IVpc;
  private rdsSecretName: string;
  private rdsInstanceEndpoint: string;
  private lambdaSecurityGroup: ec2.ISecurityGroup;
  private postConfirmationFn: any;
  constructor(scope: Construct, id: string, props: CognitoStackProps) {
    super(scope, id, props);

    const ssm = new Parameters(this);
    const { vpc, rdsSecretName } = props;

    this.vpc = vpc;
    this.rdsSecretName = rdsSecretName;
    this.rdsInstanceEndpoint = ssm.rdsInstanceEndpoint;

    this.lambdaSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'LambdaSG',
      ssm.lambdaSecurityGroupId
    );

    const frontendDomain = ssm.distributionDomainName;

    // Lambda function that is triggered when a new user registers
    this.postConfirmationFn = new LambdaBuilder(
      this,
      'cognito-post-confirmation')
      .setDescription(
        'Handles Cognito Post Confirmation trigger to create user in DB')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

      
    const userPool = this.createUserPool();
    const domain = userPool.addDomain("CognitoHostedUiDomain", {
      cognitoDomain: {
        domainPrefix: "atra-app",
      }
    });
    const userPoolClient = this.createUserPoolClient(userPool, frontendDomain);

    ssm.cognitoUserPoolId = userPool.userPoolId;
    ssm.cognitoClientId = userPoolClient.userPoolClientId;
    ssm.cognitoDomainUrl = domain.baseUrl();
  }

  // Creates User Pool
  createUserPool() {
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'AtraAppUsers',
      selfSignUpEnabled: true, // allows users to register 
      signInAliases: { email: true }, // sign in with email
      //autoVerify: { email: true },
      lambdaTriggers: {
        postConfirmation: this.postConfirmationFn,
      },
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        }
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
        requireDigits: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // user pool is removed when stack is removed -> not for production (RETAIN)!
      deletionProtection: false,
      //accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      //userVerification: {
      // emailSubject: 'Welcome to Atra App!',
      // emailBody: 'Click the link to activate your account: {####}',
      // emailStyle: cognito.VerificationEmailStyle.LINK,
      //},
    });
    return userPool;
  }

 
  // clientin kautta käyttäjät voi kirjautua sisään ja saada JWT tokenit,
  // joita API GW voi sitten validoida
  // Creates User Pool Client, client is the thing that handles sign in and token management
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
        callbackUrls: [`https://${frontendDomain}/*`, `http://localhost:8100/tabs/mainpage`, `io.ionic.atra://callback`],
        logoutUrls: [`https://${frontendDomain}/logout`, `http://localhost:8100/firstpage`, `io.ionic.atra://logout`],
      },
    });
    return client;
  }
}
