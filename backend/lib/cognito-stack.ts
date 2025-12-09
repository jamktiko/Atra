/**
 * Cognito Stack for user authentication and registration.
 *
 * Creates a Cognito User Pool with email-based sign-in and a Lambda trigger
 * that automatically provisions new users in the RDS database after registration.
 *
 * @remarks
 * Production considerations:
 * - Change removalPolicy to RETAIN to prevent accidental user data loss
 * - Enable deletionProtection
 * - Review OAuth callback URLs and remove localhost entries
 */
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

export class CognitoStack extends Stack {
  /**
   * Creates the Cognito Stack.
   *
   * @param scope - CDK construct scope
   * @param id - Unique stack identifier
   * @param props - Stack properties including VPC and RDS configuration
   */
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

    // Lambda trigger to create database user after Cognito registration
    this.postConfirmationFn = new LambdaBuilder(
      this,
      'cognito-post-confirmation'
    )
      .setDescription(
        'Handles Cognito Post Confirmation trigger to create user in DB'
      )
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    const userPool = this.createUserPool();

    // Hosted UI domain for OAuth flows
    const domain = userPool.addDomain('CognitoHostedUiDomain', {
      cognitoDomain: {
        domainPrefix: 'atra-app',
      },
    });

    const userPoolClient = this.createUserPoolClient(userPool, frontendDomain);

    // Store IDs in SSM for use in other stacks
    ssm.cognitoUserPoolId = userPool.userPoolId;
    ssm.cognitoClientId = userPoolClient.userPoolClientId;
    ssm.cognitoDomainUrl = domain.baseUrl();
  }

  /**
   * Creates the Cognito User Pool with email-based authentication.
   *
   * @returns The configured User Pool
   *
   * @remarks
   * Requires email verification, first/last name, and enforces basic password policy.
   * Post-confirmation Lambda trigger automatically creates user records in RDS.
   *
   * RemovalPolicy.DESTROY is set for development > change to RETAIN for production
   * to prevent accidental user data deletion!
   */
  createUserPool() {
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'AtraAppUsers',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
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
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
        requireDigits: true,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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

  /**
   * Creates the User Pool Client for the Atra application.
   *
   * @param userPool - The User Pool to associate with this client
   * @param frontendDomain - Frontend domain for OAuth callback/logout redirects
   * @returns The configured User Pool Client
   *
   * @remarks
   * Supports both web (HTTPS) and mobile (custom scheme) OAuth flows.
   * Localhost URLs are included for local development testing.
   */
  createUserPoolClient(userPool: cognito.UserPool, frontendDomain: string) {
    const client = userPool.addClient('cognitoClient', {
      userPoolClientName: 'AtraAppClient',
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      writeAttributes: new cognito.ClientAttributes().withStandardAttributes({
        givenName: true,
        familyName: true,
        email: true,
      }),
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: [
          `https://${frontendDomain}/*`,
          `http://localhost:8100/tabs/mainpage`,
          `io.ionic.atra://callback`,
        ],
        logoutUrls: [
          `https://${frontendDomain}/logout`,
          `http://localhost:8100/firstpage`,
          `io.ionic.atra://logout`,
        ],
      },
    });
    return client;
  }
}
