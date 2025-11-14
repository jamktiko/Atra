import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DatabaseStack } from '../lib/database-stack';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack } from 'aws-cdk-lib';

describe('DatabaseStack', () => {
  let app: App;
  let template: Template;

  // beforeEach hook to set up the app and stack before each test
  // need to set up a fake VPC as well since DatabaseStack requires it
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
    const instanceClass = ec2.InstanceClass.BURSTABLE3;
    const instanceSize = ec2.InstanceSize.MICRO;
    const dbStack = new DatabaseStack(app, 'TestDatabaseStack', {
      vpc,
      rdsSecretName: 'test-secret',
      instanceClass,
      instanceSize,
    });
    template = Template.fromStack(dbStack);
  });

  // tests that a secret is created in Secrets Manager with the correct name
  it('should create secrets in Secrets Manager', () => {
    template.hasResourceProperties('AWS::SecretsManager::Secret', {
      Name: 'test-secret',
    });
  });

  // tests that an RDS instance is created with the correct properties
  it('should create an RDS instance', () => {
    template.hasResourceProperties('AWS::RDS::DBInstance', {
      DBInstanceClass: 'db.t3.micro',
      Engine: 'mysql',
    });
  });

  // tests that an RDS Proxy is created with the correct properties
  //commented out due to RDS Proxy not being included in Free Tier
  /*   it('should create an RDS Proxy', () => {
    template.hasResourceProperties('AWS::RDS::DBProxy', {
      EngineFamily: 'MYSQL',
      RequireTLS: false, //usually true in production
    });
  }); */
});
