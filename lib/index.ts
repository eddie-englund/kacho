export type ConstEnum<T> = T[keyof T];

export const BillingInterval = {
  monthly: 'monthly',
  yearly: 'yearly',
} as const;

export type BillingInterval = ConstEnum<typeof BillingInterval>;
