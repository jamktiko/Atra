import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

export async function list(userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    'SELECT customer_id, first_name, last_name FROM Customer WHERE User_user_id = ?',
    [userId]
  );
  return successResponse(rows);
}
