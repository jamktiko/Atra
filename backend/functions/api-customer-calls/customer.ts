import {
  successResponse,
  clientErrorResponse,
  notFoundResponse,
} from '../shared/utils';
import { getPool } from '../shared/db';

export async function listCustomers(userId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    'SELECT c.first_name, c.last_name, c.email FROM Customer c WHERE User_user_id = ?',
    [userId]
  );
  return successResponse(rows);
}

export async function getCustomer(userId: string, customerId: string) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT c.first_name, c.last_name, c.email
    FROM Customer c
    WHERE c.customer_id = ? AND c.User_user_id = ?`,
    [customerId, userId]
  );

  if ((rows as any).length === 0) {
    return notFoundResponse('Customer not found');
  }
  return successResponse((rows as any)[0]);
}

export async function addCustomer(userId: string, body: string) {
  const pool = await getPool();
  let data: { email: string; firstName: string; lastName: string };

  try {
    data = JSON.parse(body);
  } catch {
    return clientErrorResponse('Invalid jason body');
  }

  if (!data.email || !data.firstName || !data.lastName) {
    return clientErrorResponse('Missing some required fields');
  }

  const [result] = await pool.query(
    `INSERT INTO Customer (email, first_name, last_name, User_user_id) 
    VALUES (?, ?, ?, ?)`,
    [data.email, data.firstName, data.lastName, userId]
  );
  return successResponse({ insertedId: (result as any).insertId });
}

/* More calls */
