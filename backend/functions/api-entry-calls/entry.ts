import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

export async function insertAssociation(
  conn: any,
  user_ink_id: number,
  entry_id: number
) {
  await conn.query(
    `INSERT INTO UserInk_has_Entry (
      UserInk_user_ink_id, Entry_entry_id,
      snapshot_product_name, snapshot_manufacturer, snapshot_color,
      snapshot_batch_number, snapshot_image_url, snapshot_size
    )
    SELECT ui.user_ink_id, ?, pi.product_name, pi.manufacturer, pi.color,
    ui.batch_number, pi.image_url, pi.size
    FROM UserInk ui
    JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
    WHERE ui.user_ink_id = ?
    ON DUPLICATE KEY UPDATE created_at = created_at;`,
    [entry_id, user_ink_id]
  );
}

export async function listEntries(userId: string) {
  const pool = await getPool();
  try {
    const [rows] = await pool.query(
      `SELECT e.entry_id, e.entry_date, e.Customer_customer_id
       FROM Entry e
       LEFT JOIN Customer c ON e.Customer_customer_id = c.customer_id
       WHERE e.User_user_id = ?
       ORDER BY e.entry_date DESC`,
      [userId]
    );
    return successResponse(rows);
  } catch (error) {
    console.error('Error listing entries:', error);
    return clientErrorResponse('Could not fetch entries');
  }
}

/*
export async function getEntry(entry_id: string, userId: string) {
  const pool = await getPool();
  try {
    const [rows]: any = await pool.query(
      `SELECT e.entry_id, e.entry_date, e.comments, c.customer_id, c.first_name, c.last_name, 
      FROM Entry e
      LEFT JOIN Customer c ON e.Customer_customer_id = c.customer_id
      WHERE e.entry_id = ? AND e.User_user_id = ?`,
      [entry_id, userId]
    );
    if (!rows.length) return notFoundResponse('Entry not found');
    const entry = rows[0];

    const [inks]: any = await pool.query(
      `SELECT 
         uie.UserInk_user_ink_id AS user_ink_id,
         ui.batch_number,
         pi.product_name,
         pi.manufacturer,
         pi.color
       FROM UserInk_has_Entry uie
       LEFT JOIN UserInk ui ON uie.UserInk_user_ink_id = ui.user_ink_id
       LEFT JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
       WHERE uie.Entry_entry_id = ?`,
      [entry_id]
    );

    entry.inks = inks;
    return successResponse(entry);
  } catch (err) {
    console.error('getEntry error:', err);
    return clientErrorResponse('Could not fetch entry');
  }
}
*/

// Get entry with inks (prefer snapshots, fallback to current values)
export async function getEntry(entry_id: string, userId: string) {
  const pool = await getPool();
  try {
    const [rows]: any = await pool.query(
      `SELECT e.entry_id, e.entry_date, e.comments, c.customer_id, c.first_name, c.last_name
       FROM Entry e
       LEFT JOIN Customer c ON e.Customer_customer_id = c.customer_id
       WHERE e.entry_id = ? AND e.User_user_id = ?`,
      [entry_id, userId]
    );
    if (!rows.length) return notFoundResponse('Entry not found');
    const entry = rows[0];

    const [inks]: any = await pool.query(
      `
      SELECT
        uhe.id,
        uhe.UserInk_user_ink_id AS user_ink_id,
        -- snapshot values (may be NULL)
        uhe.snapshot_product_name,
        uhe.snapshot_manufacturer,
        uhe.snapshot_color,
        uhe.snapshot_batch_number,
        uhe.snapshot_image_url,
        uhe.snapshot_size,
        -- fallbacks to current values when snapshot is NULL
        COALESCE(uhe.snapshot_product_name, pi.product_name) AS product_name,
        COALESCE(uhe.snapshot_manufacturer, pi.manufacturer) AS manufacturer,
        COALESCE(uhe.snapshot_color, pi.color) AS color,
        COALESCE(uhe.snapshot_batch_number, ui.batch_number) AS batch_number,
        COALESCE(uhe.snapshot_image_url, pi.image_url) AS image_url,
        COALESCE(uhe.snapshot_size, pi.size) AS size,
        ui.favorite AS current_favorite
      FROM UserInk_has_Entry uhe
      LEFT JOIN UserInk ui ON uhe.UserInk_user_ink_id = ui.user_ink_id
      LEFT JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      WHERE uhe.Entry_entry_id = ?
      ORDER BY uhe.created_at ASC
      `,
      [entry_id]
    );

    entry.inks = inks;
    return successResponse(entry);
  } catch (err) {
    console.error('getEntry error:', err);
    return clientErrorResponse('Could not fetch entry');
  }
}

export async function addEntry(
  userId: string,
  customer_id: number,
  entry_date: string,
  user_ink_id: number[],
  comments: string
) {
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [entryResult]: any = await conn.query(
      `INSERT INTO Entry (entry_date, comments, User_user_id, Customer_customer_id)
       VALUES (?, ?, ?, ?)`,
      [entry_date, comments || null, userId, customer_id]
    );

    const entryId = entryResult.insertId;

    if (user_ink_id.length > 0) {
      const inkValues = user_ink_id.map((id) => [id, entryId]);
      await conn.query(
        `INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id)
         VALUES ?`,
        [inkValues]
      );
    }

    await conn.commit();
    return successResponse({ message: 'Entry added', entry_id: entryId });
  } catch (err) {
    await conn.rollback();
    console.error('addEntry error:', err);
    return clientErrorResponse('Could not add entry');
  } finally {
    conn.release();
  }
}

export async function updateEntry(
  entry_id: number,
  userId: string,
  fields: {
    entry_date?: string;
    comments?: string;
    customer_id?: number | null;
  }
) {
  const pool = await getPool();
  const updates = [];
  const values: any[] = [];

  if (fields.entry_date !== undefined) {
    updates.push('entry_date = ?');
    values.push(fields.entry_date);
  }
  if (fields.comments !== undefined) {
    updates.push('comments = ?');
    values.push(fields.comments);
  }
  if (fields.customer_id !== undefined) {
    updates.push('Customer_customer_id = ?');
    values.push(fields.customer_id);
  }

  if (updates.length === 0) return clientErrorResponse('No fields to update');

  values.push(entry_id, userId);

  try {
    const [result]: any = await pool.query(
      `UPDATE Entry SET ${updates.join(
        ', '
      )} WHERE entry_id = ? AND User_user_id = ?`,
      values
    );

    if (result.affectedRows === 0) return notFoundResponse('Entry not found');

    return successResponse({ message: 'Entry updated' });
  } catch (err) {
    console.error('updateEntry error:', err);
    return clientErrorResponse('Could not update entry');
  }
}

export async function deleteEntry(entry_id: number, userId: string) {
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`DELETE FROM UserInk_has_Entry WHERE Entry_entry_id = ?`, [
      entry_id,
    ]);
    const [result]: any = await conn.query(
      `DELETE FROM Entry WHERE entry_id = ? AND User_user_id = ?`,
      [entry_id, userId]
    );

    await conn.commit();

    if (result.affectedRows === 0)
      return notFoundResponse('Entry not found or not owned by user');

    return successResponse({ message: 'Entry deleted' });
  } catch (err) {
    await conn.rollback();
    console.error('deleteEntry error:', err);
    return clientErrorResponse('Could not delete entry');
  } finally {
    conn.release();
  }
}
