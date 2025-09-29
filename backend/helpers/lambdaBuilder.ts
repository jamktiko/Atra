// Kutsutaan lib/api-stackissa
// LambdaBuilder auttaa Lambda-funktioiden luomisessa ja konfiguroinnissa
// Esim. addPolicy, setEnv, connectVPC jne. metodit palauttaa this,
// --> metodeja voi ketjuttaa
// Lopuksi kutsutaan build() metodia, joka luo ja palauttaa NodejsFunctionin

import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Architecture, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { IVpc, ISecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

// tämä tyyppi poistaa readonly ominaisuuden tyypistä T
// jotta voimme muokata props-oliota rakentelun aikana
// esim. lisätä initialPolicyyn uusia politiikkoja
/* Tämä on tekoälyn koodia (type Mutable) */
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export default class LambdaBuilder {
  // props on Mutable, jotta voimme muokata sitä
  private props: Mutable<NodejsFunctionProps>;
  constructor(private scope: Construct, private functionName: string) {
    // Asetetaan oletuspropsit
    this.props = {
      // bundling tarkoittaa, että CDK pakkaa koodin ja sen riippuvuudet yhteen tiedostoon
      // jotta Lambda voi ajaa sen ilman erillisiä node_modules kansioita
      bundling: {
        target: 'node20',
        nodeModules: [],
        externalModules: [],
        // loaders määrittelee, miten tietyt tiedostotyypit käsitellään
        loader: {
          '.pem': 'file',
          '.html': 'text',
        },
      },
      tracing: Tracing.DISABLED,
      //logRetention: RetentionDays.ONE_WEEK, // Säilytä logit 7 päivää -> prod vaiheeseen yleensä 30 tai 90 päivää
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      handler: 'handler',
      timeout: Duration.seconds(30),
      initialPolicy: [],
      description: '',
      memorySize: 256,
    };
  }

  // lisää IAM politiikan Lambdaan
  addPolicy(policy: PolicyStatement) {
    this.props.initialPolicy?.push(policy);
    return this;
  }

  // kuvaus Lambda funktiolle
  setDescription(text: string) {
    this.props.description = text;
    return this;
  }

  // ympäristömuuttujat Lambdaan
  setEnv(env: { [key: string]: string }) {
    this.props.environment = env;
    return this;
  }

  // sallii pääsyn Secrets Manageriin
  allowSecretsManager() {
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['secretsmanager:GetSecretValue'],
      resources: ['*'],
    });
    return this.addPolicy(policy);
  }

  // yhdistää Lambdan VPC:hen ja asettaa security groupit
  connectVPC(vpc: IVpc, ...groups: ISecurityGroup[]) {
    this.props.securityGroups = groups;
    this.props.vpc = vpc;
    return this;
  }

  // rakentaa ja palauttaa NodejsFunctionin
  build() {
    const id = `${this.functionName}Fn`;
    const entry = path.join(
      __dirname,
      '../',
      'functions',
      this.functionName,
      'index.ts'
    );
    const fn = new NodejsFunction(this.scope, id, {
      entry,
      functionName: this.functionName,
      ...this.props,
    });
    return fn;
  }

  setTimeout(seconds: number) {
    this.props.timeout = Duration.seconds(seconds);
    return this;
  }

  setMemory(mb: number) {
    this.props.memorySize = mb;
    return this;
  }

  // lisää node_modules, jotka bundlataan mukaan
  // esim. addNodeModules(['mysql2', 'aws-sdk'])
  // lisää myös ulkoiset moduulit, joita ei bundlata
  // esim. addExternalModules(['aws-sdk']) koska Lambda ympäristössä on jo aws-sdk
  // eli sitä ei tarvitse bundlata mukaan
  addNodeModules(moduleNames: string | string[]) {
    if (Array.isArray(moduleNames)) {
      this.props.bundling?.nodeModules?.push(...moduleNames);
    } else {
      this.props.bundling?.nodeModules?.push(moduleNames);
    }
    return this;
  }
  addExternalModules(moduleNames: string | string[]) {
    if (Array.isArray(moduleNames)) {
      this.props.bundling?.externalModules?.push(...moduleNames);
    } else {
      this.props.bundling?.externalModules?.push(moduleNames);
    }
    return this;
  }

  // allowEventBridge sallii Lambdan lähettää EventBridge tapahtumia
  // esim. audit logit tai muut tapahtumat
  // resource voi olla '*' tai tietty EventBus ARN
  allowEventBridge() {
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['events:PutEvents'],
      resources: ['*'],
    });
    return this.addPolicy(policy);
  }

  // sallii Lambdan kutsua KMS:ää allekirjoitukseen (Sign) ja salauksen purkuun (Decrypt)
  // esim. JWT tokenien allekirjoitus ja purku
  // resource voi olla '*' tai tietty KMS key ARN
  allowKmsSign() {
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['kms:Sign'],
      resources: ['*'],
    });
    return this.addPolicy(policy);
  }
  allowKmsDecrypt() {
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['kms:Decrypt'],
      resources: ['*'],
    });
    return this.addPolicy(policy);
  }

  // sallii Lambdan lähettää sähköposteja SES:llä
  // resource voi olla '*' tai tietty SES identity ARN
  allowSendEmail() {
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendTemplatedEmail'],
      resources: ['*'],
    });
    return this.addPolicy(policy);
  }
}
