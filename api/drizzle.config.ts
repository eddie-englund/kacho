import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

export default defineConfig({
  out: './drizzle',
  schema: ['./src/db/tables/subscriptions-table.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
});
