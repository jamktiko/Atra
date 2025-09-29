// db.ts hoitaa yhteyden MySQL tietokantaan käyttäen AWS RDS Proxyta ja Secrets Manageria

import mysql from 'mysql2/promise';
import * as aws from './aws';

const { RDS_SECRET_NAME, RDS_PROXY_HOST } = process.env;
let pool: mysql.Pool | null = null;

export async function getPool() {
  if (pool) {
    return pool;
  }

  const dbSecretJson = await aws.getSecret(RDS_SECRET_NAME!);
  const dbSecret = JSON.parse(dbSecretJson ?? '{}');

  pool = mysql.createPool({
    user: dbSecret.username,
    host: RDS_PROXY_HOST || dbSecret.host,
    database: dbSecret.dbname,
    password: dbSecret.password,
    port: dbSecret.port,
    ssl: { rejectUnauthorized: true },
  });
  return pool;
}
