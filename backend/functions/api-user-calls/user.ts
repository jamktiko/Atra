import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

export async function listUsers() {
    const pool = await getPool();
    const [rows] = await pool.query(
        `SELECT user_id, email, first_name, last_name FROM User`
    );
    return successResponse(rows);
}

export async function getUser(userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT first_name
    FROM User
    WHERE user_id = ?`,
    [userId]
  );

  if ((rows as any).length === 0) {
    return notFoundResponse('User not found');
  }
  return successResponse((rows as any)[0]);
}