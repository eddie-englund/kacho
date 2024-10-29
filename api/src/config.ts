import { createConfigLoader } from '@neato/config';
import { z } from 'zod';

const schema = z.object({
  databaseUrl: z.string().url(),
  baseCurrency: z.string().min(1).max(10).toUpperCase().default('SEK'),
  corsOrigins: z.string().transform((e) => e.split(',')),
});

export const config = createConfigLoader()
  .addFromEnvironment()
  .addFromFile('.env')
  .addZodSchema(schema)
  .load();
