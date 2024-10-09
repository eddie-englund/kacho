import {
  pgTable,
  uuid,
  varchar,
  text,
  doublePrecision,
  boolean,
} from 'drizzle-orm/pg-core';
import Crypto from 'node:crypto';

export const subscriptionsTable = pgTable('subscriptions', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => Crypto.randomUUID()),
  service: varchar('service', { length: 64 }).notNull(),
  serviceUrl: text('service_url').notNull(),
  serviceImg: text('service_img_url'),
  title: varchar('title', { length: 128 }).notNull(),
  cost: doublePrecision('cost').notNull(),
  currency: varchar('currency', { length: 10 }).notNull(), // Longer than 3 because of crypto
  billingInterval: varchar('billing_interval', { length: 16 }).notNull(),
  active: boolean('active').notNull(),
});
