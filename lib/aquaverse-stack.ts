import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as config from "../config/env";


export class ETicketPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import the existing VPC by ID
    const vpc = ec2.Vpc.fromLookup(this, `Vpc-${config.env.NODE_ENV}`, {
      vpcId: config.env.VPC_ID,
    });

    // Create an ECS Cluster in the VPC
    const cluster = new ecs.Cluster(this, `Cluster-${config.env.CLUSTER_NAME}`, {
      clusterName: config.env.CLUSTER_NAME,
      vpc,
    });

    // Import the existing ECR repository for the development image.
    const repository = ecr.Repository.fromRepositoryName(this, `Repository-${config.env.NODE_ENV}`, `${config.env.REPOSITORY_NAME}`);

    // Define a Fargate Task Definition.
    const taskDef = new ecs.FargateTaskDefinition(this, `TaskDef-${config.env.ECS_TASK_DEFINITION_NAME}`, {
      memoryLimitMiB: 1024,
      cpu: 512,
    });

    // Add a container to the task definition.
    taskDef.addContainer(`${config.env.ECS_TASK_DEFINITION_NAME}-${config.env.NODE_ENV}`, {
      image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: `${config.env.ECS_TASK_DEFINITION_NAME}-${config.env.NODE_ENV}` }),
      portMappings: [{ containerPort: config.env.PORT }],
    });

    // Create the Fargate Service.
    const service = new ecs.FargateService(this, `Service-${config.env.NODE_ENV}`, {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      serviceName: `${config.env.ECS_SERVICE_NAME}-${config.env.NODE_ENV}`,
      // Using the ECS deployment controller (rolling update by default)
      deploymentController: { type: ecs.DeploymentControllerType.ECS },
      minHealthyPercent: 100,
    });

    // Create an Internet-facing Application Load Balancer.
    const lb = new elbv2.ApplicationLoadBalancer(this, `LB-${config.env.NODE_ENV}`, {
      vpc,
      internetFacing: true,
    });

    // Add a listener on port 443.
    const listener443 = lb.addListener(`Listener443-${config.env.NODE_ENV}`, {
      port: 443,
      open: true,
      certificates: [{certificateArn:`${config.env.CERTIFICATE_ARN}`}],
    });

    // Register the Fargate service as a target for the
    // ALB listener on port 443.
    listener443.addTargets(`Target443-${config.env.NODE_ENV}`, {
      port: 443,
      targets: [service],
      healthCheck: {
        path: '/healthcheck',
      },
    });
          

    // Add a listener on port 80.
    const listener80 = lb.addListener(`Listener80-${config.env.NODE_ENV}`, {
      port: 80,
      open: true,
    });

    // Register the Fargate service as a target for the ALB.
    listener80.addTargets(`Target80-${config.env.NODE_ENV}`, {
      port: 80,
      targets: [service],
      healthCheck: {
        path: '/healthcheck',
      },
    });

    // Output the DNS name for the load balancer.
    new cdk.CfnOutput(this, `LoadBalancerDNS-${config.env.NODE_ENV}`, {
      value: lb.loadBalancerDnsName,
    });
  }
}
