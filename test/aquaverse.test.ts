import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as AquaverseIACStack from '../lib/aquaverse-stack';
import * as config from "../config/env";

test('SQS Queue Created', () => {
  const app = new cdk.App();
  const stack = new AquaverseIACStack.AquaverseIACStack(app, `Aquaverse-test-${config.env.NODE_ENV}`);
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  });
});
