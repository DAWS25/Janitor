import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

export class JanitorCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaAsset = path.join(__dirname, '../../janitor-nuxt/target/output.zip');

    const nuxtLambda = new lambda.Function(this, 'NuxtLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'server/index.handler',
      code: lambda.Code.fromAsset(lambdaAsset),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(15),
      description: 'Nuxt server output built by scripts/build.sh',
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'NuxtApi', {
      description: 'API Gateway for Nuxt Lambda',
      deployOptions: {
        stageName: 'prod',
      },
    });

    // Integrate Lambda with API Gateway
    const lambdaIntegration = new apigateway.LambdaIntegration(nuxtLambda);
    
    // Route all requests to Lambda
    api.root.addMethod('ANY', lambdaIntegration);
    api.root.addResource('{proxy+}').addMethod('ANY', lambdaIntegration);

    // Output the API endpoint
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'Nuxt application URL',
    });
  }
}
