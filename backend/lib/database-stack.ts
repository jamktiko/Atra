import {
  RemovalPolicy,
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_rds as rds,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Parameters } from '../helpers';

// Props välitetään stackin konstruktoriin.
// Interface määrittelee vaaditut propsit.
interface DatabaseStackProps extends StackProps {
  vpc: ec2.Vpc;
  rdsSecretName: string; // Secret Manager salaisuuden nimi, johon DB:n tunnukset tallennetaan
  instanceClass: ec2.InstanceClass;
  instanceSize: ec2.InstanceSize;
}

// Database Stack joka luo RDS instanssin ja RDS Proxyn
export class DatabaseStack extends Stack {
  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    // Purkaa propsit
    const { vpc, rdsSecretName, instanceClass, instanceSize } = props;

    // Parametrien tallennus SSM:ään
    const ssm = new Parameters(this);

    // Hakee Security Groupin ID:n SSM:stä
    const rdsSecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'RdsSecurityGroup',
      ssm.rdsSecurityGroupId
    );

    // Eristetyt aliverkot RDS:lle
    const subnetType = ec2.SubnetType.PRIVATE_ISOLATED;

    // Kutsutaan luontimetodeja kontsruktorissa
    // RDS instanssi ja Proxy luodaan omissa metodeissaan
    // jotta koodi pysyy siistimpänä ja selkeämpänä
    // Metodit on määritelty tämän classin sisällä private metodeina!
    const instance = this.createInstance(
      'AtraDatabase',
      vpc,
      subnetType,
      rdsSecurityGroup,
      rdsSecretName,
      instanceClass,
      instanceSize
    );

    const proxy = this.createProxy(
      'RdsProxy',
      instance,
      vpc,
      rdsSecurityGroup,
      subnetType
    );
    ssm.rdsProxyEndpoint = proxy.endpoint;
  }

  // Metodit on määritelty private, koska niitä ei tarvita stackin ulkopuolella
  // Ne ovat vain tämän stackin sisäisiä apumetodeja
  // Metodit palauttaa luodut resurssit
  private createInstance(
    databaseName: string,
    vpc: ec2.Vpc,
    subnetType: ec2.SubnetType,
    rdsSecurityGroup: ec2.ISecurityGroup,
    rdsSecretName: string,
    instanceClass: ec2.InstanceClass,
    instanceSize: ec2.InstanceSize
  ) {
    const instanceType = ec2.InstanceType.of(instanceClass, instanceSize);
    const engine = rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_42,
    });

    // Luodaan automaattisesti salaisuus (username + password),
    // joka tallennetaan Secrets Manageriin
    const credentials = rds.Credentials.fromGeneratedSecret('AtraDbSecret', {
      secretName: rdsSecretName,
      excludeCharacters: '"@/\\',
    });
    const instance = new rds.DatabaseInstance(this, 'AtraDatabase', {
      databaseName,
      engine,
      vpc,
      vpcSubnets: { subnetType },
      credentials,
      securityGroups: [rdsSecurityGroup],
      publiclyAccessible: false,
      instanceType,
      multiAz: false,
    });
    return instance;
  }

  private createProxy(
    name: string,
    instance: rds.DatabaseInstance,
    vpc: ec2.Vpc,
    rdsSecurityGroup: ec2.ISecurityGroup,
    subnetType: ec2.SubnetType
  ) {
    const proxy = instance.addProxy(name, {
      vpc,
      secrets: instance.secret ? [instance.secret] : [], // käyttää samaa secretia kuin instanssi
      securityGroups: [rdsSecurityGroup],
      requireTLS: false, // ei vaadi TLS:ää (deviin, prodissa yleensä true)
      vpcSubnets: { subnetType },
    });
    return proxy;
  }
}
