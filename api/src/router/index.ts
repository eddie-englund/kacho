import type { Hono } from 'hono';
import { postSubscription } from './subscriptions/subscription-post';
import { getSubscriptions } from './subscriptions/subscriptions-get';
import { getSubscriptionById } from './subscriptions/subscription-get';
import { getTotalSumOfSubscriptions } from './subscriptions/subscriptions-cost-sum-get';

export const intializeRoutes = (app: Hono) => {
  // Subscriptions
  postSubscription(app);
  getSubscriptionById(app);
  getSubscriptions(app);
  getTotalSumOfSubscriptions(app);
};
