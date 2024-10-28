export type ConstEnum<T> = T[keyof T];

export const BillingInterval = {
  monthly: 'monthly',
  weekly: 'daily',
  yearly: 'yearly',
} as const;

export type BillingInterval = ConstEnum<typeof BillingInterval>;
