import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

// List all customers for a user
export async function listCustomers(userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT c.customer_id, c.first_name, c.last_name, c.email FROM Customer c WHERE user_id = ?`,
    [userId]
  );
  return successResponse(rows);
}

// Get specific customer by id
export async function getCustomer(customer_id: string, userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT c.customer_id, c.first_name, c.last_name, c.email, c.notes
    FROM Customer c
    WHERE c.customer_id = ? AND c.user_id = ?`,
    [customer_id, userId]
  );

  if ((rows as any).length === 0) {
    return notFoundResponse('Customer not found');
  }
  return successResponse((rows as any)[0]);
}

// Add new customer
export async function addCustomer(userId: string, body: string) {
  const pool = await getPool();
  let data: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };

  try {
    data = JSON.parse(body);
  } catch {
    return clientErrorResponse('Invalid jason body');
  }

  if (!data.email || !data.first_name || !data.last_name) {
    return clientErrorResponse('Missing some required fields');
  }

  // Insert new customer to database
  const [result] = await pool.query(
    `INSERT INTO Customer (user_id, email, first_name, last_name, phone) 
    VALUES (?, ?, ?, ?, ?)`,
    [userId, data.email, data.first_name, data.last_name, data.phone ?? null]
  );
  return successResponse({ insertedId: (result as any).insertId });
}

// Delete customer by id
export async function deleteCustomer(customer_id: string, userId: string) {
  if (!customer_id) {
    return clientErrorResponse('Missing customer id');
  }

  try {
    const pool = await getPool();
    const [result] = await pool.query(
      'DELETE FROM Customer WHERE customer_id = ? AND user_id = ?',
      [customer_id, userId]
    );
    const { affectedRows } = result as any;

    if (affectedRows === 0) {
      return notFoundResponse('Customer not found');
    }

    return successResponse({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    return clientErrorResponse('Delete failed');
  }
}

// Updating customer info
export async function updateCustomer(
  customer_id: string,
  userId: string,
  body: string | null
) {
  const pool = await getPool();
  let data: {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };

  try {
    data = body ? JSON.parse(body) : {};
  } catch {
    return clientErrorResponse('Invalid jason body'); //jason lol
  }

  // Dynamic query construction
  const fields: string[] = [];
  const values: any[] = [];

  if (data.email !== undefined) {
    fields.push('email = ?');
    values.push(data.email);
  }
  if (data.first_name !== undefined) {
    fields.push('first_name = ?');
    values.push(data.first_name);
  }
  if (data.last_name !== undefined) {
    fields.push('last_name = ?');
    values.push(data.last_name);
  }
  if (data.phone !== undefined) {
    fields.push('phone = ?');
    values.push(data.phone);
  }

  if (fields.length === 0) {
    return clientErrorResponse('No fields to update');
  }

  values.push(customer_id, userId);

  // Execute update query
  const [result] = await pool.query(
    `UPDATE Customer
     SET ${fields.join(', ')}
     WHERE customer_id = ? AND user_id = ?`,
    values
  );

  const { affectedRows } = result as any;
  if (affectedRows === 0) {
    return notFoundResponse('Customer not found');
  }

  // Fetch and return updated customer
  const [rows] = await pool.query(
    `SELECT customer_id, email, first_name, last_name, phone
     FROM Customer
     WHERE customer_id = ? AND user_id = ?`,
    [customer_id, userId]
  );

  const updatedCustomer = (rows as any[])[0];

  return successResponse({
    message: 'Customer updated successfully',
    customer: updatedCustomer,
  });
}