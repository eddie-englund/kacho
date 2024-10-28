import { subscriptionsTable } from '../../db/tables/subscriptions-table';
import { createInsertSchema } from 'drizzle-zod';
import { db } from '../../db/db';
import { app } from '../../app';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import type { Hono } from 'hono';
import { consola } from 'consola'


const schema = createInsertSchema(subscriptionsTable).omit({ id: true });

export const postSubscription = (app: Hono) =>
  app.post('/api/subscription', zValidator('json', schema), async (c) => {
    const body = await c.req.json();

    await db
      .insert(subscriptionsTable)
      .values(body)
      .catch((err) => {
        consola.error(err);

        throw new HTTPException(500, {
          message: 'Failed to get subscriptions',
        });
      });

    return c.json({ success: true });
  });
