import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack } from 'aws-cdk-lib';
import { ApiStack } from '../lib/api-stack';
import { Match } from 'aws-cdk-lib/assertions';

describe('ApiStack', () => {
  let app: App;
  let template: Template;

  // beforeEach hook to set up the app and stack before each test
  // need to set up a fake VPC as well since ApiStack requires it
  beforeEach(() => {
    app = new App();
    const vpcStack = new Stack(app, 'TestVpcStack');
    const vpc = new ec2.Vpc(vpcStack, 'TestVpc', {
      maxAzs: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
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

    //initialize a mock api stack
    const apiStack = new ApiStack(app, 'TestApiStack', {
      vpc,
      rdsSecretName: 'test-secret',
    });
    template = Template.fromStack(apiStack);
  });

  it('should create an API Gateway', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      Name: Match.anyValue(),
    });
  });

  it('should allow GET method on /customer route', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
      RouteKey: 'GET /customer',
    });
  });

  it('should allow POST method on /customer route', () => {
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
      RouteKey: 'POST /customer',
    });
  });

  //add more method tests if needed

  // test to see if migrations-lambda has access to RDS
  it('should configure Lambda with VPC access', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      VpcConfig: Match.anyValue(),
    });
  });
});
