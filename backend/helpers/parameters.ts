// parameters on helpperi joka hoitaa SSM Parameter Storeen tallentamisen ja hakemisen

import { aws_ssm as ssm } from 'aws-cdk-lib';
import { Construct } from 'constructs';

enum ParameterNames {
  cognitoUserPoolId = '/cognito/userPoolId',
  cognitoClientId = '/cognito/clientId',
  rdsInstanceEndpoint = '/rds/instance/endpoint',
  rdsSecurityGroupId = '/sg/rds',
  lambdaSecurityGroupId = '/sg/lambda',
  distributionDomainName = '/frontend/distributionDomainName',
  cognitoDomainUrl = '/cognito/domainUrl',
}

export default class Parameters {
  constructor(private scope: Construct) {}

  //private getParameter(name: ParameterNames) {
  //return ssm.StringParameter.valueFromLookup(this.scope, name);
  //}

  private getParameter(name: ParameterNames) {
    return ssm.StringParameter.fromStringParameterName(
      this.scope,
      `GetParam${name}`,
      name
    ).stringValue;
  }

  private setParameter(name: ParameterNames, value: string) {
    new ssm.StringParameter(this.scope, `SetParam${name}`, {
      parameterName: name,
      stringValue: value,
    });
  }

  public set cognitoUserPoolId(value: string) {
    this.setParameter(ParameterNames.cognitoUserPoolId, value);
  }

  public get cognitoUserPoolId() {
    return this.getParameter(ParameterNames.cognitoUserPoolId);
  }

  public set cognitoClientId(value: string) {
    this.setParameter(ParameterNames.cognitoClientId, value);
  }

  public get cognitoClientId() {
    return this.getParameter(ParameterNames.cognitoClientId);
  }

  public set rdsInstanceEndpoint(value: string) {
    this.setParameter(ParameterNames.rdsInstanceEndpoint, value);
  }

  public get rdsInstanceEndpoint() {
    return this.getParameter(ParameterNames.rdsInstanceEndpoint);
  }

  public set rdsSecurityGroupId(value: string) {
    this.setParameter(ParameterNames.rdsSecurityGroupId, value);
  }

  public get rdsSecurityGroupId() {
    return this.getParameter(ParameterNames.rdsSecurityGroupId);
  }

  public set lambdaSecurityGroupId(value: string) {
    this.setParameter(ParameterNames.lambdaSecurityGroupId, value);
  }

  public get lambdaSecurityGroupId() {
    return this.getParameter(ParameterNames.lambdaSecurityGroupId);
  }

  public set distributionDomainName(value: string) {
    this.setParameter(ParameterNames.distributionDomainName, value);
  }

  public get distributionDomainName() {
    return this.getParameter(ParameterNames.distributionDomainName);
  }

  public set cognitoDomainUrl(value: string) {
    this.setParameter(ParameterNames.cognitoDomainUrl, value);
  }

  public get cognitoDomainUrl() {
    return this.getParameter(ParameterNames.cognitoDomainUrl);
  }
}
