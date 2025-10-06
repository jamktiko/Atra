import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { VpcStack } from '../lib/vpc-stack';

describe('VpcStack', () => {
  let app: App;
  let template: Template;

  beforeEach(() => {
    app = new App();
    const stack = new VpcStack(app, 'TestVpcStack');
    template = Template.fromStack(stack);
  });

  it('creates a VPC', () => {
    template.resourceCountIs('AWS::EC2::VPC', 1);
  });

  it('creates subnets', () => {
    template.resourceCountIs('AWS::EC2::Subnet', 6);
  });

  it('creates private subnets', () => {
    template.hasResourceProperties('AWS::EC2::Subnet', {
      MapPublicIpOnLaunch: false,
    });
  });

  it('creates NAT Gateways for private subnets', () => {
    template.resourceCountIs('AWS::EC2::NatGateway', 1);
  });

  it('creates Internet Gateway', () => {
    template.resourceCountIs('AWS::EC2::InternetGateway', 1);
  });

  it('creates Security Groups', () => {
    template.resourceCountIs('AWS::EC2::SecurityGroup', 2);
  });

  //finds any Security Group that allows ingress on port 3306 from another SG
  it('allows Lambda SG to access RDS on MySQL port', () => {
    const resources = template.findResources('AWS::EC2::SecurityGroup');
    const rdsSg = Object.values(resources).find((res: any) =>
      res.Properties?.SecurityGroupIngress?.some(
        (rule: any) => rule.FromPort === 3306 && rule.ToPort === 3306
      )
    );
    expect(rdsSg).toBeDefined();
  });
});
