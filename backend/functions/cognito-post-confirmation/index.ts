import { PostConfirmationTriggerEvent } from 'aws-lambda';
import { Handler } from 'aws-lambda';
import { getPool } from '../shared/db';
import { randomUUID } from 'crypto';

export const handler: Handler<PostConfirmationTriggerEvent> = async (event) => {
  console.log('PostConfirmation event: ', JSON.stringify(event));

  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    console.log('Not a sign up confirmation event, exiting.');
    return event;
  }

  const sub = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  const firstName = event.request.userAttributes.given_name;
  const lastName = event.request.userAttributes.family_name;

  const pool = await getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Check if user already exists
    const [existing] = await conn.query(
      'SELECT user_id FROM User WHERE cognito_sub = ? LIMIT 1',
      [sub]
    );

    if ((existing as any[]).length > 0) {
      console.log(`User already exists for sub ${sub}, skipping insert.`);
      await conn.commit();
      return event;
    }

    const userId = randomUUID();

    await conn.query(
      `INSERT INTO User (user_id, cognito_sub, email, first_name, last_name)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, sub, email, firstName, lastName]
    );

    await conn.commit();
    console.log(`Inserted new user with id ${userId} for cognito sub ${sub}`);
  } catch (error) {
    await conn.rollback();
    console.error('Error inserting user into database: ', error);
    throw error;
  } finally {
    conn.release();
  }

  return event;
};
