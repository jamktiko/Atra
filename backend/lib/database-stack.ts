/**
 * Database Stack that creates RDS Instance.
 *
 * Creates an RDS instance within the provided VPC and subnet configuration.
 *
 * @remarks
 * Production considerations:
 * - Change removalPolicy to RETAIN to prevent accidental data loss.
 * - Enable deletionProtection for added safety.
 * - Review instance class and size for production workloads.
 *
 */

import {
  RemovalPolicy,
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_rds as rds,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Parameters } from '../helpers';

interface DatabaseStackProps extends StackProps {
  vpc: ec2.Vpc;
  rdsSecretName: string;
  instanceClass: ec2.InstanceClass;
  instanceSize: ec2.InstanceSize;
}

export class DatabaseStack extends Stack {
  /**
   * Creates the Database Stack.
   *
   * @param scope - CDK construct scope
   * @param id - Unique stack identifier
   * @param props - Stack properties including VPC and RDS configuration
   */
  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    const { vpc, rdsSecretName, instanceClass, instanceSize } = props;

    const ssm = new Parameters(this);

    const rdsSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'RdsSecurityGroup',
      ssm.rdsSecurityGroupId
    );

    const subnetType = ec2.SubnetType.PRIVATE_ISOLATED;

    const instance = this.createInstance(
      'AtraDatabase',
      vpc,
      subnetType,
      rdsSecurityGroup,
      rdsSecretName,
      instanceClass,
      instanceSize
    );

    ssm.rdsInstanceEndpoint = instance.dbInstanceEndpointAddress;
  }

  /**
   *
   * @param databaseName - Name of the database
   * @param vpc
   * @param subnetType - Subnet type for the RDS instance
   * @param rdsSecurityGroup - Security group for the RDS instance
   * @param rdsSecretName - Name of the Secrets Manager sercet for RDS credentials
   * @param instanceClass - RDS instance class
   * @param instanceSize - RDS instance size
   * @returns The created RDS Database Instance
   * @remarks
   * Creates an RDS MySQL instance with generated credentials stored in Secrets Manager.
   */
  private createInstance(
    databaseName: string,
    vpc: ec2.Vpc,
    subnetType: ec2.SubnetType,
    rdsSecurityGroup: ec2.ISecurityGroup,
    rdsSecretName: string,
    instanceClass: ec2.InstanceClass,
    instanceSize: ec2.InstanceSize
  ) {
    const instanceType = ec2.InstanceType.of(instanceClass, instanceSize);
    const engine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_42,
    });

    const credentials = rds.Credentials.fromGeneratedSecret('DbSecret', {
      secretName: rdsSecretName,
      excludeCharacters: '"@/\\',
    });

    const instance = new rds.DatabaseInstance(this, 'AtraDatabase', {
      databaseName,
      engine,
      vpc,
      vpcSubnets: { subnetType },
      credentials,
      securityGroups: [rdsSecurityGroup],
      publiclyAccessible: false,
      instanceType,
      multiAz: false,
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: false,
    });
    return instance;
  }
}
