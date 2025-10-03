import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

export async function listOwnInks(userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT  
    pi.product_name, pi.manufacturer, pi.color, pi.size, ui.batch_number, ui.opened_at, 
    ui.expires_at, ui.favorite, pi.recalled, pi.image_url  
    FROM UserInk ui
    INNER JOIN PublicInk pi
    ON ui.PublicInk_ink_id = pi.ink_id  
    WHERE ui.User_user_id = ?;`,
    [userId]
  );
  return successResponse(rows);
}

export async function getUserInk(userInkId: string, userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT ui.user_ink_id, ui.batch_number, ui.opened_at, ui.expires_at, ui.favorite,
    pi.ink_id, pi.product_name, pi.manufacturer, pi.color, pi.size
    FROM UserInk ui
    JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
    WHERE ui.user_ink_id = ? AND ui.User_user_id = ? `,
    [userInkId, userId]
  );

  if ((rows as any).length === 0) {
    return notFoundResponse('Ink not found');
  }
  return successResponse((rows as any)[0]);
}

export async function addUserInk(userId: string, body: any) {
  const pool = await getPool();
  const items = Array.isArray(body) ? body : [body];

  const values = items.map((ink) => [
    ink.batchNumber,
    ink.openedAt || null,
    ink.imageUrl || null,
    ink.expiresAt || null,
    ink.favorite ? 1 : 0,
    ink.publicInkId,
    userId,
  ]);

  const [result] = await pool.query(
    `INSERT INTO UserInk 
    (batch_number, opened_at, image_url, expires_at, favorite, PublicInk_ink_id, User_user_id)
    VALUES ?`,
    [values]
  );
  return successResponse({
    insertedCount: items.length,
    insertId: (result as any).insertId,
  });
}

/* More calls */
