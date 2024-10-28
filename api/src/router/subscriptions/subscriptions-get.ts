import { subscriptionsTable } from '../../db/tables/subscriptions-table';
import { db } from '../../db/db';
import { HTTPException } from 'hono/http-exception';
import type { Hono } from 'hono';
import { consola } from 'consola';

const { id, serviceImg, cost, currency, title, active } = subscriptionsTable;

export const getSubscriptions = (app: Hono) =>
  app.get('/api/subscriptions', async (c) => {
    const data = await db
      .select({ id, serviceImg, cost, currency, title, active })
      .from(subscriptionsTable)
      .catch((err) => {
        consola.error(err);

        throw new HTTPException(500, {
          message: 'Failed to get subscriptions from db',
        });
      });

    return c.json({ success: true, data });
  });
