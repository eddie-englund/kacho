import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { intializeRoutes } from './router';
import { HTTPException } from 'hono/http-exception';

export const app = new Hono();

app.use(logger());

app.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return new Response('Internal Server Error', {
    status: 500,
  });
});

intializeRoutes(app);

serve({ fetch: app.fetch, port: 8080 }, (info) =>
  console.log(`Listening on http://localhost:${info.port}`),
);
