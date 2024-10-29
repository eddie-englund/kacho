import { subscriptionsTable } from '../../db/tables/subscriptions-table';
import { createInsertSchema } from 'drizzle-zod';
import { db } from '../../db/db';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import type { Hono } from 'hono';
import { consola } from 'consola';
import { eq } from 'drizzle-orm';
import type { z } from 'zod';

const schema = createInsertSchema(subscriptionsTable)
  .pick({ id: true })
  .required();

export const deleteSubscription = (app: Hono) =>
  app.delete('/api/subscription', zValidator('json', schema), async (c) => {
    const body = await c.req.json<z.infer<typeof schema>>();

    const [result] = await db
      .delete(subscriptionsTable)
      .where(eq(subscriptionsTable.id, body.id))
      .returning({ deletedId: subscriptionsTable.id })
      .catch((err) => {
        consola.error(err);

        throw new HTTPException(500, {
          message: `Failed to delete subscription with id ${body.id}`,
        });
      });

    if (!result) {
      throw new HTTPException(400, {
        message: 'No subscription with that id',
      });
    }

    return c.json({ success: true });
  });
