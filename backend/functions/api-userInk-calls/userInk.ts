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
    ON ui.PublicInk_ink_id = pi.ink_id  
    WHERE ui.User_cognito_sub = ?;`,
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
    JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
    WHERE ui.user_ink_id = ? AND ui.User_cognito_sub = ? `,
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

  // Insert values into UserInk
  const [result] = await pool.query(
    `INSERT INTO UserInk 
    (batch_number, opened_at, expires_at, PublicInk_ink_id, User_cognito_sub)
    VALUES ?`,
    [values]
  );
  return successResponse({
    insertedCount: items.length,
    insertId: (result as any).insertId,
  });
}

// Poistetaan userink
export async function deleteUserInk(user_ink_id: string, userId: string) {
  try {
    const pool = await getPool();
    const [result] = await pool.query(
      'DELETE FROM UserInk ui WHERE user_ink_id = ? AND ui.User_cognito_sub = ?',
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

// Päivitetään userink tiedot
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

  // Vain sallitut kentät, vältetään kaikella tavalla public inkiin koskemista
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

  // Lisätään where ehtoon ink id ja käyttäjä id
  values.push(user_ink_id, userId);

  const [result] = await pool.query(
    `UPDATE UserInk
     SET ${fields.join(', ')}
     WHERE user_ink_id = ? AND User_cognito_sub = ?`,
    values
  );

  const { affectedRows } = result as any;
  if (affectedRows === 0) {
    return notFoundResponse('User ink not found or not owned by user');
  }

  // Palautetaan päivitetty
  const [rows] = await pool.query(
    `SELECT user_ink_id, batch_number, opened_at, expires_at, favorite, PublicInk_ink_id
     FROM UserInk
     WHERE user_ink_id = ? AND User_cognito_sub = ?`,
    [user_ink_id, userId]
  );

  const updatedInk = (rows as any[])[0];

  return successResponse({
    message: 'User ink updated successfully',
    ink: updatedInk,
  });
}

/* More calls */
