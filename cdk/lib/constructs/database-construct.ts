import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface DatabaseConstructProps {
  vpc: ec2.IVpc;
  sgLambda: ec2.ISecurityGroup;
  sgRds: ec2.ISecurityGroup;
  sgRdsProxy: ec2.ISecurityGroup;
}

export class DatabaseConstruct extends Construct {
  public dbInstance: rds.DatabaseInstance;
  public proxy: rds.DatabaseProxy;
  public dbCredentialSecret: secretsmanager.Secret;
  public lambdaRole: iam.Role;

  constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
    super(scope, id);

    // Secrets Manager: DB creds

    this.dbCredentialSecret = new secretsmanager.Secret(this, 'DbCredentials', {
      secretName: 'db-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'mysqldb' }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: 'password',
      },
    });

    // RDS MySQL instance:

    this.dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_36,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3, // tarkista nämä
        ec2.InstanceSize.MEDIUM
      ),
      credentials: rds.Credentials.fromSecret(this.dbCredentialSecret),
      multiAz: false,
      allocatedStorage: 50, // tarkista storaget
      maxAllocatedStorage: 100,
      allowMajorVersionUpgrade: true,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(1), // vai 0????
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      databaseName: 'atradb',
      securityGroups: [props.sgRds],
    });

    // RDS Proxy:

    this.proxy = this.dbInstance.addProxy('DbProxy', {
      secrets: [this.dbCredentialSecret],
      debugLogging: true,
      vpc: props.vpc,
      requireTLS: false,
      securityGroups: [props.sgRdsProxy],
    });

    // IAM role for Lambda functions:

    this.lambdaRole = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaVPCAccessExecutionRole'
        ),
      ],
    });

    // Allow Lambda to read DB creds

    this.dbCredentialSecret.grantRead(this.lambdaRole);

    // Outputs:

    new cdk.CfnOutput(this, 'DbProxyEndpoint', {
      value: this.proxy.endpoint,
    });
    new cdk.CfnOutput(this, 'DbSecretArn', {
      value: this.dbCredentialSecret.secretArn,
    });
  }
}
