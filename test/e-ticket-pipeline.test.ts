import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ETicketPipeline from '../lib/aquaverse-stack';
import * as config from "../config/env";

test('SQS Queue Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new ETicketPipeline.ETicketPipelineStack(app, `Aquaverse-test-${config.env.NODE_ENV}`);
    // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  });
});
