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

// Database Stack that creates RDS instance
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
    // RDS instanssi omassa netodissa
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

    ssm.rdsInstanceEndpoint = instance.dbInstanceEndpointAddress;
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
      removalPolicy: RemovalPolicy.DESTROY,
      deletionProtection: false,
    });
    return instance;
  }
}
