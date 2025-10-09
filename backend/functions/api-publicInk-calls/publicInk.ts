import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

export async function listPublicInks() {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT ink_id, product_name, manufacturer, color, recalled, image_url, size
    FROM PublicInk
    ORDER BY manufacturer`
  );
  return successResponse(rows);
}

export async function getPublicInk(ink_id: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT ink_id, product_name, manufacturer, color, recalled, image_url, size
    FROM PublicInk
    WHERE ink_id = ?`,
    [ink_id]
  );

  if ((rows as any).length === 0) {
    return notFoundResponse('Ink not found');
  }
  return successResponse((rows as any)[0]);
}

/* More calls */
