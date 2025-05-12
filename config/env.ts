import { get } from "env-var";
import { config } from 'dotenv';

export const ENV_NAMES = {
  production: "prod",
  staging: "staging",
  test: "test",
  development: "dev",
  pent: "pent",
} as const;

config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

export const envName = get("NODE_ENV").asString() as keyof typeof ENV_NAMES;

export const env = {
  NODE_ENV: get("NODE_ENV").default('dev').asString(),
  OWNER: get("OWNER").required().asString(),
  PROJECT: get("PROJECT").required().asString(),
  SUB_PROJECT: get("SUB_PROJECT").required().asString(),
  ENV: ENV_NAMES[envName] || process.env.NODE_ENV || "dev",
  CDK_DEFAULT_ACCOUNT: get("CDK_DEFAULT_ACCOUNT").required().asString(),
  CDK_DEFAULT_REGION: get("CDK_DEFAULT_REGION").required().asString(),
  VPC_ID: get("VPC_ID").required().asString(),
  CLUSTER_NAME: get("CLUSTER_NAME").required().asString(),
  ECS_SERVICE_NAME: get("ECS_SERVICE_NAME").required().asString(),
  REPOSITORY_NAME: get("REPOSITORY_NAME").required().asString(),
  ECS_TASK_DEFINITION_NAME: get("ECS_TASK_DEFINITION_NAME").required().asString(),
  CERTIFICATE_ARN: get("CERTIFICATE_ARN").required().asString(),
  PORT: get("PORT").default('3000').asPortNumber(),
};

