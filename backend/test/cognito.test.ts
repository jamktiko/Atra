import { App, Stack } from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito-stack';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

describe('CognitoStack', () => {
  let app: App;
  let template: Template;

  beforeEach(() => {
    app = new App();

    // Luo erillinen VPC-stack
    const vpcStack = new Stack(app, 'TestVpcStack');
    const vpc = new ec2.Vpc(vpcStack, 'TestVpc', {
      maxAzs: 1,
      subnetConfiguration: [
        { name: 'Public', subnetType: ec2.SubnetType.PUBLIC, cidrMask: 24 },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    const stack = new CognitoStack(app, 'TestStack', {
      vpc,
      rdsSecretName: 'dummy-secret',
    });

    template = Template.fromStack(stack);
  });

  test('Creates a Cognito User Pool Client with OAuth settings', () => {
    template.hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'AtraAppClient',
      ExplicitAuthFlows: Match.arrayWith([
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_USER_SRP_AUTH',
      ]),
      SupportedIdentityProviders: ['COGNITO'],
      CallbackURLs: Match.anyValue(),
      LogoutURLs: Match.anyValue(),
    });
  });

  test('Creates SSM parameters for User Pool ID and Client ID', () => {
    template.resourceCountIs('AWS::SSM::Parameter', 2);
  });
});
