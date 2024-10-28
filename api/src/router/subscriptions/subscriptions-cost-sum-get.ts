import { subscriptionsTable } from '../../db/tables/subscriptions-table';
import { db } from '../../db/db';
import { HTTPException } from 'hono/http-exception';
import type { Hono } from 'hono';
import { config } from '../../config';
import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import { sum } from 'radash';
import { BillingInterval } from '../../../../lib/index';
import { consola } from 'consola';

const fxSchema = z.array(
  z.object({
    iso: z.string(),
    change: z.number(),
    value: z.number(),
  }),
);

export const getTotalSumOfSubscriptions = (app: Hono) =>
  app.get('/api/subscriptions/total-cost', async (c) => {
    const baseCurrency = config.baseCurrency.toUpperCase();

    const subscriptions = await db
      .select({
        cost: subscriptionsTable.cost,
        currency: subscriptionsTable.currency,
        interval: subscriptionsTable.billingInterval,
      })
      .from(subscriptionsTable)
      .catch((err) => {
        consola.error(err);

        throw new HTTPException(500, {
          message: 'Failed to get subscriptions from db',
        });
      });

    if (!subscriptions.length) {
      return c.json({
        success: true,
        data: {
          currency: config.baseCurrency,
          total: 0.0,
        },
      });
    }

    const currencyConvertions = await fetch(
      `https://api.valuta.se/api/${config.baseCurrency.toLocaleLowerCase()}/rates/`,
    ).catch((err) => {
      consola.error(err);
      throw new HTTPException(500, {
        message: 'Failed to get currency conversions',
      });
    });

    const json = await currencyConvertions.json().catch((err) => {
      consola.error(err);
      throw new HTTPException(500, {
        message: 'Failed parse forex conversions',
      });
    });

    const forexRates = await fxSchema.parseAsync(json).catch((err) => {
      consola.error(err);
      throw new HTTPException(500, {
        message:
          'Forex convertions did not match schema, man in the middle attack?',
      });
    });

    const avalibleFxRateCurrencies = forexRates.map((fx) => fx.iso);

    const exchangeableSubscriptions = subscriptions.filter(
      (subscription) =>
        avalibleFxRateCurrencies.includes(subscription.currency) ||
        subscription.currency.toUpperCase() === baseCurrency,
    );

    function exchangeSubscriptions(
      _subscriptions: typeof subscriptions,
    ): number[] {
      return _subscriptions.map((subscription) => {
        const currency = subscription.currency.toUpperCase();

        if (currency === baseCurrency) {
          return subscription.cost;
        }

        const fxRateFrom = forexRates.find(
          (fx) => fx.iso.toUpperCase() === currency,
        );

        if (!fxRateFrom)
          throw new HTTPException(500, {
            message: 'Invalid from currency in exchanged subscriptions',
          });

        return (fxRateFrom.value / 100) * subscription.cost;
      });
    }

    const yearly = exchangeableSubscriptions.filter(
      (e) => e.interval === BillingInterval.yearly,
    );

    const monthly = exchangeableSubscriptions.filter(
      (e) => e.interval === BillingInterval.monthly,
    );

    const exchangedYearlySubscriptions = exchangeSubscriptions(yearly);
    const exchangedMonthlySubscriptions = exchangeSubscriptions(monthly);
    consola.log(exchangedMonthlySubscriptions);
    const exchangedMonthlySplit = exchangeSubscriptions([
      ...monthly,
      ...yearly.map((e) => ({ ...e, cost: e.cost / 12 })), // split by 12 for a monthly breakdown
    ]);

    const exchangedYearlySplit = exchangeSubscriptions([
      ...yearly,
      ...monthly.map((e) => ({ ...e, cost: e.cost * 12 })), // times 12 for a yearly breakdown,
    ]);

    return c.json({
      success: true,
      data: {
        currency: baseCurrency,
        monthlyTotal: sum(exchangedMonthlySubscriptions),
        monthlySplitTotal: sum(exchangedMonthlySplit),
        yearlyTotal: sum(exchangedYearlySubscriptions),
        yearlySplitTotal: sum(exchangedYearlySplit),
      },
    });
  });
