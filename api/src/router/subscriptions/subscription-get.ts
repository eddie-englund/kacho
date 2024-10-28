import { subscriptionsTable } from '../../db/tables/subscriptions-table';
import { db } from '../../db/db';
import { HTTPException } from 'hono/http-exception';
import type { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { consola } from 'consola'


export const getSubscriptionById = (app: Hono) =>
  app.get(
    '/api/subscription/:id',
    zValidator('param', z.object({ id: z.string().uuid() })),
    async (c) => {
      const id = c.req.param('id');

      if (!id) throw new HTTPException(400, { message: 'Bad request' });

      const data = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.id, id))
        .catch((err) => {
          consola.error(err);

          throw new HTTPException(500, {
            message: 'Failed to get subscriptions from db',
          });
        });

      if (!data.length) {
        throw new HTTPException(404, { message: 'No such subscription' });
      }

      return c.json({ success: true, data: data[0] });
    },
  );
