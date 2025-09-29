import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Parameters } from '../helpers';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack, StackProps } from 'aws-cdk-lib';

const MYSQL_PORT = 3306;

interface VpcStackProps extends StackProps {}

// VPC Stack joka luo VPC:n, Security Groupit Lambdalle ja RDS:lle:
export class VpcStack extends Stack {
  // Julkinen getter VPC:lle, jotta muut stackit voivat käyttää sitä
  public vpc: ec2.Vpc;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Luo VPC:n ja Security Groupit
    this.vpc = this.createVpc();
    const lambdaSecurityGroup = this.createLambdaSecurityGroup();
    const rdsSecurityGroup = this.createRdsSecurityGroup();

    // Sallii liikenteen Lambda SG:sta RDS Security Groupin MySQL-portissa
    rdsSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(lambdaSecurityGroup.securityGroupId),
      ec2.Port.tcp(MYSQL_PORT),
      'Allow Lambda SG to access RDS on MySQL port'
    );

    // Tallentaa Security Group ID:t ja muut parametrit SSM:ään,
    // jotta muut stackit voi käyttää niitä
    const ssm = new Parameters(this);
    ssm.lambdaSecurityGroupId = lambdaSecurityGroup.securityGroupId;
    ssm.rdsSecurityGroupId = rdsSecurityGroup.securityGroupId;
  }

  // Luo VPC:n, jossa on julkiset, yksityiset ja eristetyt aliverkot
  private createVpc() {
    const vpc = new ec2.Vpc(this, 'AtraVpc', {
      vpcName: 'AtraVpc',
      maxAzs: 2,
      natGateways: 1, // Yksi NAT Gateway privaatille aliverkoille
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC, // Julkinen aliverkko (IGW yhteys)
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, // Yksityinen aliverkko (NAT Gatewayn kautta ulos)
        },
        {
          cidrMask: 24,
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED, // Eristetty aliverkko (ei ulospäin yhteyttä)
        },
      ],
    });
    return vpc;
  }

  // Luo Security Groupin Lambdalle
  private createLambdaSecurityGroup(): ec2.SecurityGroup {
    return new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });
  }

  // Luo Security Groupin RDS:lle
  private createRdsSecurityGroup(): ec2.SecurityGroup {
    return new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for RDS instance',
      allowAllOutbound: true,
    });
  }
}
