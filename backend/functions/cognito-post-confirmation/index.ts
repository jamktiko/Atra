import { PostConfirmationTriggerEvent } from 'aws-lambda';
import { Handler } from 'aws-lambda';
import { getPool } from '../shared/db';

export const handler: Handler<PostConfirmationTriggerEvent> = async (event) => {
  console.log('PostConfirmation event: ', JSON.stringify(event));

  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    console.log('Not a sign up confirmation event, exiting.');
    return event;
  }

  const user_id = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  const firstName = event.request.userAttributes.given_name;
  const lastName = event.request.userAttributes.family_name;

  const pool = await getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO User (user_id, email, first_name, last_name)
       VALUES (?, ?, ?, ?)`,
      [user_id, email, firstName, lastName]
    );

    await conn.commit();
    console.log(`Inserted new user with id ${user_id}`);
  } catch (error) {
    await conn.rollback();
    console.error('Error inserting user into database: ', error);
    throw error;
  } finally {
    conn.release();
  }

  return event;
};
