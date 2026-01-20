import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import * as path from 'path';

export function createLambdaAndApi(scope: cdk.Stack) {
  const lambdaAsset = path.join(__dirname, '../../janitor-nuxt/target/output.zip');

  const nuxtLambda = new lambda.Function(scope, 'NuxtLambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'server/index.handler',
    code: lambda.Code.fromAsset(lambdaAsset),
    memorySize: 1024,
    timeout: cdk.Duration.seconds(15),
    description: 'Nuxt server output built by scripts/build.sh',
  });

  const api = new apigateway.RestApi(scope, 'NuxtApi', {
    description: 'API Gateway for Nuxt Lambda',
    deployOptions: {
      stageName: 'prod',
    },
  });

  const lambdaIntegration = new apigateway.LambdaIntegration(nuxtLambda);
  api.root.addMethod('ANY', lambdaIntegration);
  api.root.addResource('{proxy+}').addMethod('ANY', lambdaIntegration);

  return { nuxtLambda, api };
}
