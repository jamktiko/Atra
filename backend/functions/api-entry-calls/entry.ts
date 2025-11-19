import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

// Inserts association between UserInk and Entry, populating snapshot fields
// from current UserInk and PublicInk data
// Used when adding a new Entry!
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

// List all entries for a user
export async function listEntries(userId: string) {
  const pool = await getPool();
  try {
    const [rows] = await pool.query(
      `SELECT e.entry_id, e.entry_date, e.Customer_customer_id, c.first_name, c.last_name
       FROM Entry e
       LEFT JOIN Customer c ON e.Customer_customer_id = c.customer_id
       WHERE e.User_cognito_sub = ?
       ORDER BY e.entry_date DESC`,
      [userId]
    );
    return successResponse(rows);
  } catch (error) {
    console.error('Error listing entries:', error);
    return clientErrorResponse('Could not fetch entries');
  }
}

// Get entry with inks (prefer snapshots, fallback to current values)
export async function getEntry(entry_id: string, userId: string) {
  const pool = await getPool();
  try {
    const [rows]: any = await pool.query(
      `SELECT e.entry_id, e.entry_date, e.comments, c.customer_id, c.first_name, c.last_name
       FROM Entry e
       LEFT JOIN Customer c ON e.Customer_customer_id = c.customer_id
       WHERE e.entry_id = ? AND e.User_cognito_sub = ?`,
      [entry_id, userId]
    );
    if (!rows.length) return notFoundResponse('Entry not found');
    const entry = rows[0];

    const [inks]: any = await pool.query(
      `SELECT
        uhe.id,
        uhe.UserInk_user_ink_id AS user_ink_id,
        COALESCE(uhe.snapshot_product_name, pi.product_name) AS product_name,
        COALESCE(uhe.snapshot_manufacturer, pi.manufacturer) AS manufacturer,
        COALESCE(uhe.snapshot_color, pi.color) AS color,
        COALESCE(uhe.snapshot_batch_number, ui.batch_number) AS batch_number,
        COALESCE(uhe.snapshot_image_url, pi.image_url) AS image_url,
        COALESCE(uhe.snapshot_size, pi.size) AS size
      FROM UserInk_has_Entry uhe
      LEFT JOIN UserInk ui ON uhe.UserInk_user_ink_id = ui.user_ink_id
      LEFT JOIN PublicInk pi ON ui.PublicInk_ink_id = pi.ink_id
      WHERE uhe.Entry_entry_id = ?
      ORDER BY uhe.created_at ASC
      `,
      [entry_id]
    );

    const result = {
      entry_id: entry.entry_id,
      entry_date: entry.entry_date,
      comments: entry.comments ?? null,
      customer_id: entry.customer_id ?? null,
      first_name: entry.first_name ?? null,
      last_name: entry.last_name ?? null,
      inks: inks ?? [],
    };
    return successResponse(result);
  } catch (error) {
    console.error('getEntry error:', error);
    return clientErrorResponse('Could not fetch entry');
  }
}

// Add entry and attach inks (user_ink_id array). Populates snapshots for each association.
export async function addEntry(
  userId: string,
  customer_id: number | null,
  entry_date: string,
  user_ink_id: number[] = [],
  comments: string | null = null
) {
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // validate customer if provided
    if (customer_id !== null) {
      const [cust]: any = await conn.query(
        `SELECT 1 FROM Customer WHERE customer_id = ? AND User_cognito_sub = ?`,
        [customer_id, userId]
      );
      if (!cust.length) {
        await conn.rollback();
        return clientErrorResponse('Invalid customer for this user');
      }
    }

    const [entryResult]: any = await conn.query(
      `INSERT INTO Entry (entry_date, comments, User_cognito_sub, Customer_customer_id)
       VALUES (?, ?, ?, ?)`,
      [entry_date, comments, userId, customer_id]
    );

    const entryId = entryResult.insertId;

    // Attach inks and populate snapshots
    for (const inkId of user_ink_id) {
      await insertAssociation(conn, inkId, entryId);
    }

    await conn.commit();
    return successResponse({ message: 'Entry added', entry_id: entryId });
  } catch (error) {
    await conn.rollback();
    console.error('addEntry error:', error);
    return clientErrorResponse('Could not add entry');
  } finally {
    conn.release();
  }
}

// remove and add inks in two separate arrays:
/*
// Update entry fields and optionally replace attached inks
export async function updateEntry(
  entry_id: number,
  userId: string,
  entry_date?: string,
  comments?: string,
  customer_id?: number | null,
  add_user_ink_id?: number[],
  remove_user_ink_id?: number[]
) {
  const pool = await getPool();
  const conn = await pool.getConnection();

  // Validation
  if (entry_date && isNaN(Date.parse(entry_date))) {
    return clientErrorResponse('Invalid entry_date');
  }
  if (add_user_ink_id && !Array.isArray(add_user_ink_id)) {
    return clientErrorResponse('add_user_ink_id must be an array');
  }
  if (remove_user_ink_id && !Array.isArray(remove_user_ink_id)) {
    return clientErrorResponse('remove_user_ink_id must be an array');
  }

  const updates = [];
  const values: any[] = [];

  if (entry_date !== undefined) {
    updates.push('entry_date = ?');
    values.push(entry_date);
  }
  if (comments !== undefined) {
    updates.push('comments = ?');
    values.push(comments);
  }
  if (customer_id !== undefined) {
    updates.push('Customer_customer_id = ?');
    values.push(customer_id);
  }

  // If nothing to do:
  if (
    updates.length === 0 &&
    !add_user_ink_id?.length &&
    !remove_user_ink_id?.length
  ) {
    conn.release();
    return clientErrorResponse('No fields to update');
  }

  try {
    await conn.beginTransaction();
    // Update Entry base fields:
    if (updates.length > 0) {
      values.push(entry_id, userId);
      const [result]: any = await conn.query(
        `UPDATE Entry 
        SET ${updates.join(', ')} 
        WHERE entry_id = ? AND User_cognito_sub = ?`,
        values
      );
      if (result.affectedRows === 0) {
        await conn.rollback();
        conn.release();
        return notFoundResponse('Entry not found or not owned by user');
      }
    }

    // Add inks:
    if (add_user_ink_id && add_user_ink_id.length > 0) {
      // avoiding duplicates here: only insert inks not already linked
      const [existing]: any = await conn.query(
        `SELECT UserInk_user_ink_id FROM UserInk_has_Entry WHERE Entry_entry_id = ?`,
        [entry_id]
      );
      const existingIds = existing.map((e: any) => e.UserInk_user_ink_id);
      const newIds = add_user_ink_id.filter((id) => !existingIds.includes(id));

      if (newIds.length > 0) {
        const valuesToInsert = newIds.map((id) => [id, entry_id]);
        await conn.query(
          `INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id) VALUES ?`,
          [valuesToInsert]
        );
      }
    }
    

    //Remove inks:
    if (remove_user_ink_id && remove_user_ink_id.length > 0) {
      await conn.query(
        `DELETE FROM UserInk_has_Entry
        WHERE Entry_entry_id = ?
        AND UserInk_user_ink_id IN (?)`,
        [entry_id, remove_user_ink_id]
      );
    }
    await conn.commit();
    return successResponse({ message: 'Entry updated' });
  } catch (error) {
    await conn.rollback();
    console.error('updateEntry error:', error);
    return clientErrorResponse('Could not update entry');
  } finally {
    conn.release();
  }
}
*/

export async function updateEntry(
  entry_id: number,
  userId: string,
  entry_date?: string,
  comments?: string,
  customer_id?: number | null,
  replace_user_ink_id?: number[]
) {
  const pool = await getPool();
  const conn = await pool.getConnection();

  // Validation
  if (entry_date && isNaN(Date.parse(entry_date))) {
    return clientErrorResponse('Invalid entry_date');
  }
  if (replace_user_ink_id && !Array.isArray(replace_user_ink_id)) {
    return clientErrorResponse('replace_user_ink_id must be an array');
  }

  const updates = [];
  const values: any[] = [];

  if (entry_date !== undefined) {
    updates.push('entry_date = ?');
    values.push(entry_date);
  }
  if (comments !== undefined) {
    updates.push('comments = ?');
    values.push(comments);
  }
  if (customer_id !== undefined) {
    updates.push('Customer_customer_id = ?');
    values.push(customer_id);
  }
  if (updates.length === 0 && !replace_user_ink_id) {
    conn.release();
    return clientErrorResponse('No fields to update');
  }

  try {
    await conn.beginTransaction();
    if (updates.length > 0) {
      values.push(entry_id, userId);
      const [result]: any = await conn.query(
        `UPDATE Entry 
        SET ${updates.join(', ')} 
        WHERE entry_id = ? AND User_cognito_sub = ?`,
        values
      );
      if (result.affectedRows === 0) {
        await conn.rollback();
        conn.release();
        return notFoundResponse('Entry not found or not owned by user');
      }
    }
    if (replace_user_ink_id) {
      await conn.query(
        `DELETE FROM UserInk_has_Entry WHERE Entry_entry_id = ?`,
        [entry_id]
      );
      for (const inkId of replace_user_ink_id) {
        await insertAssociation(conn, inkId, entry_id);
      }
      if (replace_user_ink_id.length > 0) {
        const inkValues = replace_user_ink_id.map((id) => [id, entry_id]);
        await conn.query(
          `INSERT INTO UserInk_has_Entry (UserInk_user_ink_id, Entry_entry_id)
          VALUES ?`,
          [inkValues]
        );
      }
    }
    await conn.commit();
    return successResponse({ message: 'Entry updated' });
  } catch (error) {
    await conn.rollback();
    console.error('updateEntry error:', error);
    return clientErrorResponse('Could not update entry');
  } finally {
    conn.release();
  }
}

// Delete entry and its associations
export async function deleteEntry(entry_id: number, userId: string) {
  const pool = await getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Delete associations first
    await conn.query(`DELETE FROM UserInk_has_Entry WHERE Entry_entry_id = ?`, [
      entry_id,
    ]);
    // Delete entry itself
    const [result]: any = await conn.query(
      `DELETE FROM Entry WHERE entry_id = ? AND User_cognito_sub = ?`,
      [entry_id, userId]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return notFoundResponse('Entry not found or not owned by user');
    }

    await conn.commit();
    return successResponse({ message: 'Entry deleted' });
  } catch (error) {
    await conn.rollback();
    console.error('deleteEntry error:', error);
    return clientErrorResponse('Could not delete entry');
  } finally {
    conn.release();
  }
}
