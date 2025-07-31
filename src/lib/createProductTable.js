import { executeQuery } from './db';

export async function createProductTable(tableName) {
  const safeTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');

  const query = `
    CREATE TABLE IF NOT EXISTS \`${safeTableName}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      location_id INT,
      serial_number VARCHAR(100),
      user_id INT,
      client_status VARCHAR(100),
      admin_status VARCHAR(100),
      type VARCHAR(100),
      details_id INT,
      manufacturing_date DATE,
      delivery_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  await executeQuery({ query });
  console.log(`✅ Table '${safeTableName}' created.`);
}
