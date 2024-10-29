import type { Hono } from 'hono';
import { postSubscription } from './subscriptions/subscription-post';
import { getSubscriptions } from './subscriptions/subscriptions-get';
import { getSubscriptionById } from './subscriptions/subscription-get';
import { getTotalSumOfSubscriptions } from './subscriptions/subscriptions-cost-sum-get';
import { putSubscription } from './subscriptions/subscription-put';
import { deleteSubscription } from './subscriptions/subscription-delete';

export const intializeRoutes = (app: Hono) => {
  // Subscriptions
  postSubscription(app);
  putSubscription(app);
  getSubscriptionById(app);
  deleteSubscription(app);
  getSubscriptions(app);

  getTotalSumOfSubscriptions(app);
};
