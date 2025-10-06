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

// Props välitetään stackin konstruktoriin.
// Interface määrittelee vaaditut propsit.
interface ApiStackProps extends StackProps {
  vpc: ec2.IVpc;
  rdsSecretName: string;
}

// API Stack joka luo API Gatewayn ja Lambda funktion
// API GW käyttää cognitoa käyttäjien autentikointiin
// lambda funktio hoitaa CRUD operaatiot Proxyn kautta
export class ApiStack extends Stack {
  private api: apigw2.HttpApi;
  private vpc: ec2.IVpc;
  private lambdaSecurityGroup: ec2.ISecurityGroup;
  private rdsSecretName: string;
  private rdsProxyEndpoint: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const ssm = new Parameters(this);
    const frontendDomain = ssm.distributionDomainName;
    const { vpc, rdsSecretName } = props;
    this.vpc = vpc;
    this.rdsSecretName = rdsSecretName;
    this.rdsProxyEndpoint = ssm.rdsProxyEndpoint;

    this.lambdaSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'LambdaSG',
      ssm.lambdaSecurityGroupId
    );
    //const cognitoUserPool = cognito.UserPool.fromUserPoolId(
    //this,
    //'UserPool',
    //ssm.cognitoUserPoolId
    //);

    // Kutsutaan apin luontimetodia ja reittien metodia
    this.api = this.createApi(
      'AtraApi',
      //cognitoUserPool,
      //ssm.cognitoClientId,
      frontendDomain
    );

    // ei tarpeellinen tässä vaiheessa
    this.migrationsRoute();

    this.customerRoute();
    this.publicInkRoute();
    this.userInkRoute();
  }

  private createApi(
    name: string,
    //cognitoUserPool: cognito.IUserPool,
    //cognitoClientId: string,
    frontendDomain: string
  ) {
    //const issuer = `https://cognito-idp.${this.region}.amazonaws.com/${cognitoUserPool.userPoolId}`; // issuer = user poolin URL

    // JWT authorizer Cognito User Poolia varten
    // Authorizer tarkistaa, että token on validi ja peräisin oikeasta user poolista
    // Audience on client ID, eli siis sovellus, joka käyttää kyseistä user poolia
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! kommentoitu pois authorizer demoa varten!!
    //const authorizer = new HttpJwtAuthorizer('CognitoAuthorizer', issuer, {
    //jwtAudience: [cognitoClientId],
    //});
    const api = new apigw2.HttpApi(this, 'AtraApi', {
      apiName: name,
      //defaultAuthorizer: authorizer,

      // tässä määritellään CORS asetukset, eli sallitut domainit, metodit ja headerit
      // jotta frontti voi tehdä pyyntöjä apille
      // Muista lisätä frontin domaini allowOrigins:iin !!!!
      corsPreflight: {
        allowHeaders: ['Content-Type'], // <-- lisää 'Authorization' takas!
        allowMethods: [
          apigw2.CorsHttpMethod.GET,
          apigw2.CorsHttpMethod.POST,
          apigw2.CorsHttpMethod.PUT,
          apigw2.CorsHttpMethod.DELETE,
        ],
        allowOrigins: [`https://${frontendDomain}`],
      },
    });
    return api;
  }

  private migrationsRoute() {
    const migrationsFn = new LambdaBuilder(this, 'migrations')
      .setDescription('Run DB migrations and seed test data')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_PROXY_HOST: this.rdsProxyEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    new cdk.CfnOutput(this, 'MigrationsFnArn', {
      value: migrationsFn.functionArn,
      exportName: 'MigrationsFnArn',
    });
  }

  // Reitti CRUD operaatioille
  // Integraationa Lambda funktio
  // Funktio on rakennettu erillisellä builderilla (helpers kansiossa)
  private customerRoute() {
    const fn = new LambdaBuilder(this, 'api-customer-calls')
      .setDescription('CRUD operations for customer management')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_PROXY_HOST: this.rdsProxyEndpoint,
        DEMO_USER_ID: 'demo-user-123', // DEMOA VARTEN !!!!
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    // API GW kutsuu tätä funktiota kun reittiä /customer kutsutaan
    const integration = new HttpLambdaIntegration('CustomerCallsFn', fn);

    this.api.addRoutes({
      path: '/customer',
      methods: [apigw2.HttpMethod.ANY],
      integration,
    });

    this.api.addRoutes({
      path: '/customer/{id}',
      methods: [apigw2.HttpMethod.ANY],
      integration,
    });

    /* Tänne loput reitit */
  }

  private publicInkRoute() {
    const fn = new LambdaBuilder(this, 'api-publicInk-calls')
      .setDescription('CRUD operations for getting public ink(s)')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_PROXY_HOST: this.rdsProxyEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    // API GW kutsuu tätä funktiota kun reittiä /publicInk kutsutaan
    const integration = new HttpLambdaIntegration('publicInkCallsFn', fn);

    this.api.addRoutes({
      path: '/publicInk',
      methods: [apigw2.HttpMethod.ANY],
      integration,
    });

    this.api.addRoutes({
      path: '/publicInk/{id}',
      methods: [apigw2.HttpMethod.ANY],
      integration,
    });

    /* Tänne loput reitit */
  }

  private userInkRoute() {
    const fn = new LambdaBuilder(this, 'api-userInk-calls')
      .setDescription('CRUD operations for managing user ink(s)')
      .setEnv({
        RDS_SECRET_NAME: this.rdsSecretName,
        RDS_PROXY_HOST: this.rdsProxyEndpoint,
      })
      .allowSecretsManager()
      .connectVPC(this.vpc, this.lambdaSecurityGroup)
      .build();

    // API GW kutsuu tätä funktiota kun reittiä /userInk kutsutaan
    const integration = new HttpLambdaIntegration('userInkCallsFn', fn);

    this.api.addRoutes({
      path: '/userInk',
      methods: [apigw2.HttpMethod.ANY],
      integration,
    });

    this.api.addRoutes({
      path: '/userInk/{id}',
      methods: [apigw2.HttpMethod.ANY],
      integration,
    });

    /* Tänne loput reitit */
  }
}
