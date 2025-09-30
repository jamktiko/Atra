import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

export async function list(userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    'SELECT c.first_name, c.last_name, c.email FROM Customer c WHERE User_user_id = ?',
    [userId]
  );
  return successResponse(rows);
}
