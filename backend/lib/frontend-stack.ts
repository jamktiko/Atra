/**
 * Frontend Stack that creates S3 bucket and CloudFront distribution.
 *
 * @remarks
 * S3 bucket is used to host the frontend application.
 * Cloudfront distribution serves the frontend with low latency.
 *
 * Production considerations:
 * - Change removalPolicy to RETAIN to prevent accidental data loss.
 * - Enable versioning on the S3 bucket for better data protection.
 * - Review CloudFront settings for production workloads.
 *
 */

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
  /**
   * Creates the Frontend Stack.
   *
   * @param scope - CDK construction scope
   * @param id - Unique stack identifier
   * @param props - Stack properties
   *
   */
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly distributionDomainName: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'FrontendBucket', {
      bucketName: 'atra-frontend-bucket',
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      defaultRootObject: 'index.html',
      comment: `Frontend distribution for ${id}`,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    this.distributionDomainName = this.distribution.distributionDomainName;

    const ssm = new Parameters(this);
    ssm.distributionDomainName = this.distributionDomainName;
  }
}
