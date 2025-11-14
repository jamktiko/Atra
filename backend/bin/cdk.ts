#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { DatabaseStack } from '../lib/database-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { ApiStack } from '../lib/api-stack';
import { FrontendStack } from '../lib/frontend-stack';

const { CDK_DEFAULT_ACCOUNT } = process.env;
const env = { region: 'eu-north-1', account: CDK_DEFAULT_ACCOUNT };

const app = new cdk.App();

const vpc = new VpcStack(app, 'vpc', { env: env });
new CognitoStack(app, 'cognito', {
  env: env,
  vpc: vpc.vpc,
  rdsSecretName: 'RdsSecret',
});

new DatabaseStack(app, 'database', {
  env: env,
  vpc: vpc.vpc,
  rdsSecretName: 'RdsSecret',
  instanceClass: ec2.InstanceClass.T4G,
  instanceSize: ec2.InstanceSize.MICRO,
});

new ApiStack(app, 'api', {
  env: env,
  vpc: vpc.vpc,
  rdsSecretName: 'RdsSecret',
});

new FrontendStack(app, 'frontend', {
  env: env,
});
