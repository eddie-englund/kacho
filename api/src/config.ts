import { createConfigLoader } from '@neato/config';
import { z } from 'zod';

const schema = z.object({
  databaseUrl: z.string().url(),
});

export const config = createConfigLoader()
  .addFromEnvironment()
  .addFromFile('.env')
  .addZodSchema(schema)
  .load();
