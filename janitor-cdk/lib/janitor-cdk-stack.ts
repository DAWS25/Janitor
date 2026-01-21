import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createLambdaAndApi } from './lambda-api';
import { setupCustomDomain } from './custom-domain';

export class JanitorCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda and API Gateway
    const { api } = createLambdaAndApi(this);

    // Optionally set up custom domain if env vars are set
    setupCustomDomain(this, { api });

    // Output the API endpoint
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'Nuxt application URL',
    });
  }
}
