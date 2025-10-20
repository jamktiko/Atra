import { App } from 'aws-cdk-lib';
import { FrontendStack } from '../lib/frontend-stack';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Template } from 'aws-cdk-lib/assertions';

describe('FrontendStack', () => {
  const app = new App();
  const stack = new FrontendStack(app, 'TestFrontendStack');
  const template = Template.fromStack(stack);

  test('S3 bucket is created with correct properties', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'atra-frontend-bucket',
      //add more properties in the test?
    });
  });

  test('CloudFront distribution is created', () => {
    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
  });

  test('Bucket blocks public access', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    });
  });

  test('SSM parameter is created for distribution domain name', () => {
    template.resourceCountIs('AWS::SSM::Parameter', 1);
  });
});
