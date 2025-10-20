# ATRA serverless application infrastructure

This CDK project builds a serverless application with multiple stacks and helpers.

The `cdk.json` file tells the CDK Toolkit how to execute the app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `cdk deploy --all --outputs-file ./cdk-outputs.json` deploy whole stack within a project
- `cdk deploy --hotswap` quickly deploy lambda

## Folder structure

bin/cdk.ts is the application file that defines the CDK app.

Under lib/ we have the stack files. A stack file defines AWS resources and properties using constructs.

- lib/api-stack = creates the api gateway and lambda function.
- lib/cognito-stack = creates the user pool and user pool client for Cognito.
- lib/database-stack = creates the RDS instance and Proxy.
- lib/frontend-stack = creates the Cloudfront distribution to serve the frontend and S3 bucket to store the objects.
- lib/vpc-stack = creates VPC, private and public subnets and security groups for Lambda and RDS.

In /helpers we have some helper functions the stack can use.

- /lambdaBuilder.ts is called in api-stack and it builds and returs the NodejsFunction.
- /parameters.ts handles saving and retrieving to/from SSM Parameter Store.
- /index.ts exports the handlers for others to use.

functions folder consists of sub-folders: shared and all the different api-calls.

api-customer-calls, api-publicInk-calls, api-userInk-calls and migrations. All of these have two files:
the main file named after the table in the database and index.ts.

- /tablename.ts has all the different querys the lambdas make to the database.
- /index.ts routes the calls to the right handler.

migrations is a folder that has one file: index.ts. It's a lambda function that's called when we create the tables and seed test data into the database.
The function is called from Github Actions after CDK deployments.

shared:

- /aws.ts retrieves secrets from the Secrets Manager.
- /db.ts connects to the mysql database with RDS Proxy and Secrets Manager.
- /utils.ts has some general functions, like error responses and such.
- /index.ts exports for others to use.

## Full flow and details

### Sign up and login

User opens the application that's distributed through Cloudfront. The contents are stored in a S3 Bucket.
Frontend calls Cognito:

- User signs up -> Cognito stores the user
- Once verified, the user can log in with email and password
- When a user authenticates, Cognito returns JWT tokens (ID, Access, Refresh)
- Frontend stores the tokens

### API Gateway

Api Gateway receives the requests and verifies the JWT token is valid and from the correct user pool.

- If valid, the request is passed to the correct Lambda.
- Every request to the backend API includes the Authorization: Bearer <JWT> header

### Lambdas

The Lambda queries the database via RDS Proxy (not directly to the database, for better pooling/scaling).

### Database

The RDS Proxy forwards the request to the MySQL database.

- Data is returned to the Lambda.
- Lambda processes and sends the response back through API Gateway -> to the frontend.
