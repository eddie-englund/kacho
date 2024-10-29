import { subscriptionsTable } from '../../db/tables/subscriptions-table';
import { createInsertSchema } from 'drizzle-zod';
import { db } from '../../db/db';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';
import type { Hono } from 'hono';
import { consola } from 'consola';
import { eq } from 'drizzle-orm';

const schema = createInsertSchema(subscriptionsTable);

export const putSubscription = (app: Hono) =>
  app.put('/api/subscription', zValidator('json', schema), async (c) => {
    const body = await c.req.json();

    const {
      service,
      serviceUrl,
      serviceImg,
      cost,
      title,
      currency,
      billingInterval,
      active,
    } = body;

    await db
      .update(subscriptionsTable)
      .set({
        service,
        serviceUrl,
        serviceImg,
        cost,
        title,
        currency,
        billingInterval,
        active,
      })
      .where(eq(subscriptionsTable.id, body.id))
      .catch((err) => {
        consola.error(err);

        throw new HTTPException(500, {
          message: 'Failed to get subscriptions',
        });
      });

    return c.json({ success: true });
  });
