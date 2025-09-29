import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Parameters } from '../helpers';

export interface FrontendStackProps extends StackProps {}

export class FrontendStack extends Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly distributionDomainName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for hosting the frontend
    this.bucket = new s3.Bucket(this, 'FrontendBucket', {
      bucketName: 'atra-frontend-bucket',
      removalPolicy: RemovalPolicy.DESTROY, // tuotantoon ei
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
    // CloudFront distribution to serve the frontend
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      comment: `Frontend distribution for ${id}`,
    });

    this.distributionDomainName = this.distribution.distributionDomainName;

    const ssm = new Parameters(this);
    ssm.distributionDomainName = this.distributionDomainName;
  }
}
