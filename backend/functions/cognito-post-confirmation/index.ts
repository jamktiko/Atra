import { PostConfirmationTriggerEvent } from 'aws-lambda';
import { Handler } from 'aws-lambda';
import { getPool } from '../shared/db';
import { randomUUID } from 'crypto';

export const handler: Handler<PostConfirmationTriggerEvent> = async (
  event: PostConfirmationTriggerEvent
) => {
  console.log('PostConfirmation event: ', JSON.stringify(event));
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    console.log('Not a sign up confirmation event, exiting.');
    return event;
  }

  // Extract user info from cognito event
  const sub = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  const firstName = event.request.userAttributes.given_name;
  const lastName = event.request.userAttributes.family_name;

  const pool = await getPool();
  const conn = await pool.getConnection();

  try {
    const userId = randomUUID();
    await conn.beginTransaction();
    // Insert user into the database
    await conn.query(
      `INSERT INTO User (user_id, cognito_sub, email, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)`,
      [userId, sub, email, firstName, lastName]
    );
    await conn.commit();
    console.log(`Inserted new user with id ${userId} for cognito sub ${sub}`);
  } catch (error) {
    console.error('Error inserting user into database: ', error);
    throw error;
  } finally {
    conn.release();
  }
  return event;
};
