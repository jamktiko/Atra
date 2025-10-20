import { App } from 'aws-cdk-lib';
import { CognitoStack } from '../lib/cognito-stack';
import { Match, Template } from 'aws-cdk-lib/assertions';

const app = new App();
const stack = new CognitoStack(app, 'TestStack');
const template = Template.fromStack(stack);

describe('CognitoStack', () => {
  test('Creates a Cognito User Pool Client with OAuth settings', () => {
    template.hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'AtraAppClient',
      ExplicitAuthFlows: Match.arrayWith([
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_USER_SRP_AUTH',
      ]),
      SupportedIdentityProviders: ['COGNITO'],
      CallbackURLs: Match.anyValue(), //checks only that the property exists
      LogoutURLs: Match.anyValue(), //checks only that the property exists
    });
  });

  test('Creates SSM parameters for User Pool ID and Client ID', () => {
    template.resourceCountIs('AWS::SSM::Parameter', 2);
  });

  // TODO: implement test if users would be created in the user pool automatically
  /*   test('Creates a User in the User Pool', () => {
  }) */
});
