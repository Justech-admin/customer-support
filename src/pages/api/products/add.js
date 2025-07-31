import { executeQuery } from '@/lib/db';
import { createProductTable } from '@/lib/createProductTable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, tableName } = req.body;

  if (!name || !tableName) {
    return res.status(400).json({ error: 'Both display name and table name are required' });
  }

  try {
    // 1. Insert into products table
    await executeQuery({
      query: 'INSERT INTO products (name) VALUES (?)',
      values: [tableName],
    });

    // 2. Create table for that product
    await createProductTable(tableName);

    res.status(201).json({ message: `Product '${name}' added and table '${tableName}' created.` });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
