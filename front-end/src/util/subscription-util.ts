import { z } from 'zod';

const idSchema = z.string().uuid();
const serviceSchema = z.string().min(1).max(64);
const serviceUrlSchema = z.string().url();
const serviceImgSchema = z.string().url().optional();
const titleSchema = z.string().min(1).max(128);
const costSchema = z.number().positive().min(0.01);
const billingIntervalSchema = z.string().default('monthly');
const currencySchema = z.string().min(3).max(10);

export const SubscriptionSchema = z.object({
  id: idSchema,
  service: serviceSchema,
  serviceUrl: serviceUrlSchema,
  serviceImg: serviceImgSchema,
  title: titleSchema,
  cost: costSchema,
  currency: currencySchema,
  billingInterval: billingIntervalSchema,
  active: z.boolean(),
});

export type SubscriptionSchema = z.infer<typeof SubscriptionSchema>;

export const CreateSubscriptionSchemas = {
  serviceSchema,
  serviceUrlSchema,
  serviceImgSchema,
  titleSchema,
  costSchema,
  currencySchema,
  billingIntervalSchema,
  completeSchema: SubscriptionSchema.omit({
    id: true,
    active: true,
  }),
};

export const homeSchema = SubscriptionSchema.pick({
  id: true,
  serviceImg: true,
  cost: true,
  currency: true,
  title: true,
  active: true,
});

export type homeSchema = z.infer<typeof homeSchema>;

export const completeHomeSchema = z.object({
  success: z.boolean(),
  data: z.array(homeSchema),
});

export type completeHomeSchema = z.infer<typeof completeHomeSchema>;