import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { intializeRoutes } from './router';
import { HTTPException } from 'hono/http-exception';
import consola from 'consola';
import { config } from './config';

export const app = new Hono();

app.use(logger());
app.use(
  '*',
  cors({
    origin: config.corsOrigins as string[],
  }),
);

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
