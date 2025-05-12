#!/opt/homebrew/opt/node/bin/node
import * as cdk from 'aws-cdk-lib';
import { ETicketPipelineStack } from '../lib/aquaverse-stack';
import * as config from "../config/env";

const app = new cdk.App();
new ETicketPipelineStack(app, `ETicketPipelineStack-${config.env.NODE_ENV}`, {
  env: {
    account: config.env.CDK_DEFAULT_ACCOUNT,
    region: config.env.CDK_DEFAULT_REGION,
  },
});

cdk.Tags.of(app).add("Owner", config.env.OWNER);
cdk.Tags.of(app).add("Project", config.env.PROJECT);
cdk.Tags.of(app).add("SubProject", config.env.SUB_PROJECT);
cdk.Tags.of(app).add("Env", config.env.NODE_ENV || "development");
cdk.Tags.of(app).add("Name", `${config.env.PROJECT}-${config.env.NODE_ENV}`);
app.synth();