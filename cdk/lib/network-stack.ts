import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class NetworkStack extends cdk.Stack {
  public vpc: ec2.Vpc;
  public sgLambda: ec2.SecurityGroup;
  public sgRds: ec2.SecurityGroup;
  public sgRdsProxy: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC w/ public + private subnets across 2 AZ's:

    this.vpc = new ec2.Vpc(this, 'atra-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0, // käytetään VPC Endpointteja
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'public subnet 1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24, // vai 20?
        },
        {
          name: 'private subnet 1',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED, // jos tarvitaan internet yhteys niin PRIVATE_WITH_EGRESS + NAT gateway
          cidrMask: 24,
        },
        {
          name: 'private subnet 2',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED, // jos tarvitaan internet yhteys niin PRIVATE_WITH_EGRESS + NAT gateway
          cidrMask: 24,
        },
      ],
    });

    // Security Groups:

    this.sgLambda = new ec2.SecurityGroup(this, 'lambdaSG', {
      vpc: this.vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });
    this.sgRds = new ec2.SecurityGroup(this, 'rdsSG', {
      vpc: this.vpc,
      description: 'Security group for RDS instance',
      allowAllOutbound: true,
    });
    this.sgRdsProxy = new ec2.SecurityGroup(this, 'rdsProxySG', {
      vpc: this.vpc,
      description: 'Security group for RDS Proxy',
      allowAllOutbound: true,
    });

    // Allow Lambda -> RDS Proxy
    this.sgRdsProxy.addIngressRule(
      this.sgLambda,
      ec2.Port.tcp(3306),
      'Allow Lambda to connect to RDS Proxy'
    );

    // Allow Proxy -> RDS
    this.sgRds.addIngressRule(
      this.sgRdsProxy,
      ec2.Port.tcp(3306),
      'Allow RDS Proxy to connect to RDS'
    );

    // VPC Enpoints:

    // Gateway endpoint for S3:
    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    // Interface endpoints:
    const interfaceServices = [
      ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
      ec2.InterfaceVpcEndpointAwsService.STS,
    ];

    for (const service of interfaceServices) {
      this.vpc.addInterfaceEndpoint(`${service.shortName}Endpoint`, {
        service,
        privateDnsEnabled: true,
        subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        securityGroups: [this.sgLambda],
      });
    }

    // Outputs:

    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
    });
    new cdk.CfnOutput(this, 'PrivateSubnetIds', {
      value: this.vpc.privateSubnets.map((s) => s.subnetId).join(','),
    });
    new cdk.CfnOutput(this, 'LambdaSgId', {
      value: this.sgLambda.securityGroupId,
    });
    new cdk.CfnOutput(this, 'RdsSgId', {
      value: this.sgRds.securityGroupId,
    });
    new cdk.CfnOutput(this, 'RdsProxySgId', {
      value: this.sgRdsProxy.securityGroupId,
    });
  }
}
