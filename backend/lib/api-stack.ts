/**
 * API Stack for the Atra application.
 *
 * Creates an HTTP API Gateway with JWT authorization via Cognito,
 * and provisions Lambda functions for database CRUD operations.
 * All Lambda functions are deployed within a VPC to securely access RDS.
 *
 * @remarks
 * The API enforces authentication on all routes except public ink endpoints,
 * which allow unauthenticated read access for public sharing features.
 */

import {
  Stack,
  StackProps,
  aws_apigatewayv2 as apigw2,
  aws_ec2 as ec2,
  aws_cognito as cognito,
} from 'aws-cdk-lib';
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';
import { LambdaBuilder, Parameters } from '../helpers';
import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { HttpNoneAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2';

interface ApiStackProps extends StackProps {
  vpc: ec2.IVpc;
  rdsSecretName: string;
}

export class ApiStack extends Stack {
  /**
   * Creates the API Stack.
   *
   * @param scope - CDK construct scope
   * @param id - Unique stack identifier
   * @param props - Stack properties including VPC and RDS configuration
   */
  private api: apigw2.HttpApi;
  private vpc: ec2.IVpc;
  private lambdaSecurityGroup: ec2.ISecurityGroup;
  private rdsSecretName: string;
  private rdsInstanceEndpoint: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const ssm = new Parameters(this);
    const frontendDomain = ssm.distributionDomainName;
    const { vpc, rdsSecretName } = props;
    this.vpc = vpc;
    this.rdsSecretName = rdsSecretName;
    this.rdsInstanceEndpoint = ssm.rdsInstanceEndpoint;

    this.lambdaSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'LambdaSG',
      ssm.lambdaSecurityGroupId
    );
    const cognitoUserPool = cognito.UserPool.fromUserPoolId(
      this,
      'UserPool',
      ssm.cognitoUserPoolId
    );

    this.api = this.createApi(
      'AtraApi',
      cognitoUserPool,
      ssm.cognitoClientId,
      frontendDomain
    );

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: this.api.apiEndpoint,
      exportName: 'ApiEndpoint',
    });

    this.migrationsRoute();
    this.dropSchemaRoute();

    this.customerRoute();
    this.publicInkRoute();
    this.userInkRoute();
    this.entryRoute();
    this.userRoute();
  }

  /**
   * Creates the HTTP API Gateway with Cognito JWT authorization.
   *
   * @param name - API name for CloudFormation resource
   * @param cognitoUserPool - User pool for JWT validation
   * @param cognitoClientId - Client ID used as JWT audience claim
   * @param frontendDomain - Domain for CORS allow-origin header
   * @returns Configured HTTP API instance
   *
   * @remarks
   * Localhost is included in CORS origins for local development.
   * Remove before production deployment.
   */
  private createApi(
    name: string,
    cognitoUserPool: cognito.IUserPool,
    cognitoClientId: string,
    frontendDomain: string
  ) {
    const issuer = `https://cognito-idp.${this.region}.amazonaws.com/${cognitoUserPool.userPoolId}`; // issuer = user pool's URL

    // JWT authorizer for Cognito User Pool
    // Authorizer checks that token is valid and from the correct user pool
    // Audience is Client ID - the app that uses the user pool
    const authorizer = new HttpJwtAuthorizer('CognitoAuthorizer', issuer, {
      jwtAudience: [cognitoClientId],
    });
    const api = new apigw2.HttpApi(this, 'AtraApi', {
      apiName: name,
      defaultAuthorizer: authorizer,

      // CORS settings, allowed domains, methods and headers
      // so that frontend can make requests
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [
          apigw2.CorsHttpMethod.GET,
          apigw2.CorsHttpMethod.POST,
          apigw2.CorsHttpMethod.PUT,
          apigw2.CorsHttpMethod.DELETE,
          apigw2.CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: [`https://${frontendDomain}`, `http://localhost:8100`], // localhost pois kun ei tarvita enää testaukseen
      },
    });
    return api;
  }

  private migrationsRoute() {
    const migrationsFn = new LambdaBuilder(this, 'migrations')
      .setDescription('Run DB migrations and seed test data')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    new cdk.CfnOutput(this, 'MigrationsFnArn', {
      value: migrationsFn.functionArn,
      exportName: 'MigrationsFnArn',
    });
  }

  private dropSchemaRoute() {
    const dropSchemaFn = new LambdaBuilder(this, 'drop-schema')
      .setDescription('Run DB drop schema to kill all data')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    new cdk.CfnOutput(this, 'DropSchemaFnArn', {
      value: dropSchemaFn.functionArn,
      exportName: 'DropSchemaFnArn',
    });
  }

  // Routes for CRUD operations, Lambda functions integrated
  // functions are built with a separate builder (in helpers file)
  private customerRoute() {
    const fn = new LambdaBuilder(this, 'api-customer-calls')
      .setDescription('CRUD operations for customer management')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
        //DEMO_USER_ID: 'demo-user-123', // DEMOA VARTEN !!!!
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    // API GW calls this function when route /customer is called
    const integration = new HttpLambdaIntegration('CustomerCallsFn', fn);

    this.api.addRoutes({
      path: '/customer',
      methods: [apigw2.HttpMethod.POST, apigw2.HttpMethod.GET],
      integration,
    });

    this.api.addRoutes({
      path: '/customer/{id}',
      methods: [
        apigw2.HttpMethod.POST,
        apigw2.HttpMethod.GET,
        apigw2.HttpMethod.DELETE,
        apigw2.HttpMethod.PUT,
      ],
      integration,
    });
  }

  /**
   * Provisions the public ink routes.
   *
   * @remarks
   * Uses HttpNoneAuthorizer to allow unauthenticated access.
   * This enables public sharing of ink galleries without login.
   * Will be removed if public access is no longer required.
   */
  private publicInkRoute() {
    const fn = new LambdaBuilder(this, 'api-publicInk-calls')
      .setDescription('CRUD operations for getting public ink(s)')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    const integration = new HttpLambdaIntegration('publicInkCallsFn', fn);

    this.api.addRoutes({
      path: '/publicInk',
      methods: [apigw2.HttpMethod.GET],
      integration,
      authorizer: new HttpNoneAuthorizer(), // tän voisi ottaa prod vaiheessa pois --> fix handlers
    });

    this.api.addRoutes({
      path: '/publicInk/{id}',
      methods: [apigw2.HttpMethod.GET],
      integration,
      authorizer: new HttpNoneAuthorizer(), // tän voisi ottaa prod vaiheessa pois --> fix handlers
    });
  }

  private userInkRoute() {
    const fn = new LambdaBuilder(this, 'api-userInk-calls')
      .setDescription('CRUD operations for managing user ink(s)')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    const integration = new HttpLambdaIntegration('userInkCallsFn', fn);

    this.api.addRoutes({
      path: '/userInk',
      methods: [apigw2.HttpMethod.POST, apigw2.HttpMethod.GET],
      integration,
    });

    this.api.addRoutes({
      path: '/userInk/{id}',
      methods: [
        apigw2.HttpMethod.POST,
        apigw2.HttpMethod.GET,
        apigw2.HttpMethod.DELETE,
        apigw2.HttpMethod.PUT,
      ],
      integration,
    });
  }

  private entryRoute() {
    const fn = new LambdaBuilder(this, 'api-entry-calls')
      .setDescription('CRUD operations for managing entries')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    const integration = new HttpLambdaIntegration('entryCallsFn', fn);

    this.api.addRoutes({
      path: '/entry',
      methods: [apigw2.HttpMethod.POST, apigw2.HttpMethod.GET],
      integration,
    });

    this.api.addRoutes({
      path: '/entry/{id}',
      methods: [
        apigw2.HttpMethod.POST,
        apigw2.HttpMethod.GET,
        apigw2.HttpMethod.DELETE,
        apigw2.HttpMethod.PUT,
      ],
      integration,
    });
  }

  // mainly for dev (for now)
  private userRoute() {
    const fn = new LambdaBuilder(this, 'api-user-calls')
      .setDescription('CRUD operations for getting user(s)')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_INSTANCE_HOST: this.rdsInstanceEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    const integration = new HttpLambdaIntegration('userCallsFn', fn);

    this.api.addRoutes({
      path: '/user/me',
      methods: [apigw2.HttpMethod.GET],
      integration,
    });
  }
}
