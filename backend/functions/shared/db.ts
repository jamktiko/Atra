// db.ts deals wuth database connection pooling using mysql2 and gets credentials from Secrets Manager

import mysql from 'mysql2/promise';
import * as aws from './aws';

const { RDS_SECRET_NAME, RDS_INSTANCE_HOST } = process.env;
let pool: mysql.Pool | null = null;

export async function getPool() {
  if (pool) {
    return pool;
  }

  const dbSecretJson = await aws.getSecret(RDS_SECRET_NAME!);
  const dbSecret = JSON.parse(dbSecretJson ?? '{}');

  pool = mysql.createPool({
    user: dbSecret.username,
    host: RDS_INSTANCE_HOST || dbSecret.host,
    database: 'AtraDatabase',
    password: dbSecret.password,
    port: dbSecret.port,
    ssl: { rejectUnauthorized: false },
    // can add multiple tables in one query etc
    multipleStatements: true,
  });
  return pool;
}
