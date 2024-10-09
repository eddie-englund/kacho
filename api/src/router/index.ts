import type { Hono } from 'hono';
import { postSubscription } from './subscriptions/subscription-post';
import { getSubscriptions } from './subscriptions/subscriptions-get';

export const intializeRoutes = (app: Hono) => {
  postSubscription(app);
  getSubscriptions(app);
};
