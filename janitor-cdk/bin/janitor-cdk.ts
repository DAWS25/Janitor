#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { JanitorCdkStack } from '../lib/janitor-cdk-stack';

const app = new cdk.App();
new JanitorCdkStack(app, 'janitor-cdk-stack', {});
