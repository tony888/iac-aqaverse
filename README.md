# Aquaverse Bugaboo Shop IAC

This project implements an Aquaverse Bugaboo Shop processing iac using AWS CDK.


### Prerequisites

-   Node.js and npm
-   AWS CLI configured with appropriate credentials
-   AWS CDK Toolkit (`npm install -g aws-cdk`)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd e-ticket-pipeline
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Deployment

1.  Build the project:
    ```bash
    npm run build
    ```
2.  Bootstrap your AWS environment (if you haven't already for this account/region):
    ```bash
    cdk bootstrap aws://<YOUR_AWS_ACCOUNT_ID>/<YOUR_AWS_REGION>
    ```
3.  Deploy the stack:
    ```bash
    npm run cdk -- deploy
    ```
    Or, if you prefer to use the `cdk` command directly:
    ```bash
    cdk deploy
    ```


## Useful CDK Commands

The `package.json` file includes scripts for common CDK operations:

-   `npm run build`: Compile typescript to js
-   `npm run watch`: Watch for changes and compile
-   `npm run test`: Perform the jest unit tests
-   `npm run cdk -- <cdk-command>`: Executes CDK commands. For example:
    -   `npm run cdk -- synth`: Emits the synthesized CloudFormation template
    -   `npm run cdk -- diff`: Compares deployed stack with current state
    -   `npm run cdk -- deploy`: Deploys the stack to your default AWS account/region
    -   `npm run cdk -- destroy`: Destroys the stack

For more information on CDK commands, refer to the [AWS CDK Toolkit documentation](https://docs.aws.amazon.com/cdk/latest/guide/cli.html).