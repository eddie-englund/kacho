import { Pool } from 'pg';
import { config } from '../config';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const db = drizzle(pool);
