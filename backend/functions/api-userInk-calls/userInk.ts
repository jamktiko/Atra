import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

// List all inks owned by user
export async function listOwnInks(userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT  
    pi.product_name, pi.manufacturer, pi.color, pi.size, ui.batch_number, ui.opened_at, 
    ui.expires_at, ui.favorite, ui.user_ink_id, pi.recalled, pi.image_url  
    FROM UserInk ui
    INNER JOIN PublicInk pi
    ON ui.public_ink_id = pi.ink_id  
    WHERE ui.user_id = ?;`,
    [userId]
  );
  return successResponse(rows);
}

// Get specific user ink by id
export async function getUserInk(user_ink_id: string, userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT ui.user_ink_id, ui.batch_number, ui.opened_at, ui.expires_at, ui.favorite, ui.user_ink_id,
    pi.ink_id, pi.product_name, pi.manufacturer, pi.color, pi.size
    FROM UserInk ui
    JOIN PublicInk pi ON ui.public_ink_id = pi.ink_id
    WHERE ui.user_ink_id = ? AND ui.user_id = ? `,
    [user_ink_id, userId]
  );

  if ((rows as any).length === 0) {
    return notFoundResponse('Ink not found');
  }
  return successResponse((rows as any)[0]);
}

// Add new user ink(s)
export async function addUserInk(userId: string, body: any) {
  const pool = await getPool();
  const items = Array.isArray(body) ? body : [body];

  // map items to values array
  const values = items.map((ink) => [
    ink.batch_number,
    ink.opened_at || null,
    ink.expires_at || null,
    ink.PublicInk_ink_id,
    userId,
  ]);

  // Insert values into userink
  const [result] = await pool.query(
    `INSERT INTO UserInk 
    (batch_number, opened_at, expires_at, public_ink_id, user_id)
    VALUES ?`,
    [values]
  );
  return successResponse({
    insertedCount: items.length,
    insertId: (result as any).insertId,
  });
}

// Remove userink
export async function deleteUserInk(user_ink_id: string, userId: string) {
  try {
    const pool = await getPool();
    const [result] = await pool.query(
      'DELETE FROM UserInk ui WHERE user_ink_id = ? AND ui.user_id = ?',
      [user_ink_id, userId]
    );
    const { affectedRows } = result as any;

    if (affectedRows === 0) {
      return notFoundResponse('Ink not found');
    }

    return successResponse({ message: 'User ink deleted successfully' });
  } catch (err) {
    return clientErrorResponse('Delete failed');
  }
}

// Update user ink
export async function updateUserInk(
  user_ink_id: string,
  userId: string,
  body: string | null
) {
  const pool = await getPool();
  let data: {
    batch_number?: string;
    opened_at?: string | null;
    expires_at?: string | null;
    favorite?: boolean | number;
  };

  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    return clientErrorResponse('Invalid jason body');
  }

  // Only allowed filds
  const allowedFields = ['batch_number', 'opened_at', 'expires_at', 'favorite'];
  const fields: string[] = [];
  const values: any[] = [];

  for (const key of allowedFields) {
    if (data[key as keyof typeof data] !== undefined) {
      fields.push(`${key} = ?`);

      if (key === 'favorite') {
        values.push(data.favorite ? 1 : 0);
      } else {
        values.push(data[key as keyof typeof data]);
      }
    }
  }

  if (fields.length === 0) {
    return clientErrorResponse('No valid fields to update');
  }

  // Add ink id and user id to where clause
  values.push(user_ink_id, userId);

  const [result] = await pool.query(
    `UPDATE UserInk
     SET ${fields.join(', ')}
     WHERE user_ink_id = ? AND user_id = ?`,
    values
  );

  const { affectedRows } = result as any;
  if (affectedRows === 0) {
    return notFoundResponse('User ink not found or not owned by user');
  }

  // Return updated ink
  const [rows] = await pool.query(
    `SELECT user_ink_id, batch_number, opened_at, expires_at, favorite, public_ink_id
     FROM UserInk
     WHERE user_ink_id = ? AND user_id = ?`,
    [user_ink_id, userId]
  );

  const updatedInk = (rows as any[])[0];

  return successResponse({
    message: 'User ink updated successfully',
    ink: updatedInk,
  });
}
