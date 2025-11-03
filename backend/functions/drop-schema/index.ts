import { Handler } from 'aws-lambda';
import { getPool } from '../shared/db';

/**
 * Drop the AtraDatabase schema. To run this handler you MUST set environment variable:
 *   DROP_SCHEMA_CONFIRM = "YES"
 *
 * This prevents accidental destructive operations.
 */

export const handler: Handler = async (Event, ctx) => {
  if (process.env.DROP_SCHEMA_CONFIRM !== 'YES') {
    console.warn('DROP_SCHEMA_CONFIRM not set to YES - aborting drop');
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'DROP_SCHEMA_CONFIRM not set to YES' }),
    };
  }
  console.log('Dropping AtraDatabase schema...');
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    await conn.query('DROP SCHEMA IF EXISTS AtraDatabase CASCADE;');
    console.log('Schema dropped: AtraDatabase');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'AtraDatabase schema dropped' }),
    };
  } catch (error) {
    console.error('Error dropping schema:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  } finally {
    conn.release();
  }
};
