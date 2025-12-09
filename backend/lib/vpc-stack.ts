/**
 * Creates a VPC with public, private, and isolates subnets, along with Security Groups for Lambda and RDS.
 *
 * The VPC is configured with:
 * - Public subnets with Internet Gateway access.
 * - Private subnets with NAT Gateway access for outbound internet connection.
 * - Isolated subnets without outbound access for RDS instance.
 *
 * @remarks
 * Security Groups:
 * - Lambda SG allows outbound traffic.
 * - RDS SG allows inbound MySQL traffic from Lambda SG.
 *
 * Parameters such as Security Group IDs are stored in SSM for use in other stacks.
 *
 */

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Parameters } from '../helpers';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack, StackProps } from 'aws-cdk-lib';

const MYSQL_PORT = 3306;

interface VpcStackProps extends StackProps {}

export class VpcStack extends Stack {
  /**
   * Creates the VPC Stack.
   *
   * @param scope - CDK construct scope.
   * @param id - Unique stack identifier.
   * @param props - Stack properties.
   *
   */
  public vpc: ec2.Vpc;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.vpc = this.createVpc();
    const lambdaSecurityGroup = this.createLambdaSecurityGroup();
    const rdsSecurityGroup = this.createRdsSecurityGroup();

    rdsSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(lambdaSecurityGroup.securityGroupId),
      ec2.Port.tcp(MYSQL_PORT),
      'Allow Lambda SG to access RDS on MySQL port'
    );

    const ssm = new Parameters(this);
    ssm.lambdaSecurityGroupId = lambdaSecurityGroup.securityGroupId;
    ssm.rdsSecurityGroupId = rdsSecurityGroup.securityGroupId;
  }

  /**
   *
   * @returns The created VPC
   * @remarks
   * Creates a VPC with public, private, and isolated subnets.
   */
  private createVpc() {
    const vpc = new ec2.Vpc(this, 'AtraVpc', {
      vpcName: 'AtraVpc',
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
    return vpc;
  }

  /**
   * @returns The created Security Group for Lambda functions
   */
  private createLambdaSecurityGroup(): ec2.SecurityGroup {
    return new ec2.SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });
  }

  /**
   * @returns The created Security Group for RDS instance.
   */
  private createRdsSecurityGroup(): ec2.SecurityGroup {
    return new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for RDS instance',
      allowAllOutbound: true,
    });
  }
}
