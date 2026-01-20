import * as cdk from 'aws-cdk-lib';
import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { aws_route53 as route53 } from 'aws-cdk-lib';
import { aws_route53_targets as targets } from 'aws-cdk-lib';
import { Construct } from 'constructs';

interface CustomDomainProps {
  api: apigateway.RestApi;
}

export function setupCustomDomain(scope: Construct, props: CustomDomainProps) {
  const domainName = process.env.JANITOR_DOMAIN_NAME;
  const hostedZoneId = process.env.JANITOR_HOSTED_ZONE_ID;
  const certArn = process.env.JANITOR_ACM_CERT_ARN;

  if (!domainName || !hostedZoneId || !certArn) {
    return;
  }

  const zone = route53.HostedZone.fromHostedZoneAttributes(scope, 'JanitorHostedZone', {
    hostedZoneId,
    zoneName: domainName,
  });

  const domain = new apigateway.DomainName(scope, 'CustomDomain', {
    domainName,
    certificate: cdk.aws_certificatemanager.Certificate.fromCertificateArn(scope, 'JanitorCert', certArn),
    endpointType: apigateway.EndpointType.EDGE,
    securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
  });

  new apigateway.BasePathMapping(scope, 'BasePathMapping', {
    domainName: domain,
    restApi: props.api,
    basePath: '',
  });

  new route53.ARecord(scope, 'CustomDomainAliasRecord', {
    zone,
    recordName: domainName,
    target: route53.RecordTarget.fromAlias(new targets.ApiGatewayDomain(domain)),
  });
}
