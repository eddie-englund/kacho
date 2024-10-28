import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { intializeRoutes } from './router';
import { HTTPException } from 'hono/http-exception';
import consola from 'consola';

export const app = new Hono();

app.use(logger());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json({ msg: err.message });
  }
  return new Response('Internal Server Error', {
    status: 500,
  });
});

intializeRoutes(app);

serve({ fetch: app.fetch, port: 8080 }, (info) =>
  consola.info(`Listening on http://localhost:${info.port}`),
);
