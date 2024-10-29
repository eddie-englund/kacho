import { ref, computed, type ShallowRef, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { watchDebounced } from '@vueuse/core';
import { CreateSubscriptionSchemas } from '@/util/subscription-util';
import type { ZodSchema } from 'zod';
import { BillingInterval } from 'subscription-manager/lib/index';

const {
  titleSchema,
  serviceSchema,
  serviceImgSchema,
  serviceUrlSchema,
  costSchema,
  currencySchema,
  billingIntervalSchema,
} = CreateSubscriptionSchemas;

export const useSubscriptionStore = defineStore('subscription-store', () => {
  const validate =
    (
      value: ShallowRef<unknown>,
      schema: ZodSchema,
      validityRef: ShallowRef<boolean>,
      initRef: ShallowRef<boolean>,
    ) =>
    (): void => {
      initRef.value = false;
      const validation = schema.safeParse(value.value);
      validityRef.value = validation.success;
    };

  const isNewSubscription = shallowRef<boolean>(false);
  const subscriptionId = shallowRef<string>();

  const title = shallowRef<string>('');
  const service = shallowRef<string>('');
  const serviceUrl = shallowRef<string>('');
  const serviceImgUrl = shallowRef<string>();
  const cost = shallowRef<number>(1);
  const currency = shallowRef<string>('SEK');
  const interval = shallowRef<string>('monthly');

  const titleInit = shallowRef<boolean>(true);
  const serviceInit = shallowRef<boolean>(true);
  const serviceUrlInit = shallowRef<boolean>(true);
  const serviceImgUrlInit = shallowRef<boolean>(true);
  const costInit = shallowRef<boolean>(true);
  const currencyInit = shallowRef<boolean>(true);
  const intervalInit = shallowRef<boolean>(true);

  const titleValid = shallowRef<boolean>(false);
  const serviceValid = shallowRef<boolean>(false);
  const serviceUrlValid = shallowRef<boolean>(false);
  const serviceImgUrlValid = shallowRef<boolean>(true);
  const costValid = shallowRef<boolean>(true);
  const currencyValid = shallowRef<boolean>(true);
  const intervalValid = shallowRef<boolean>(true);

  const validateTitle = validate(title, titleSchema, titleValid, titleInit);
  const validateService = validate(
    service,
    serviceSchema,
    serviceValid,
    serviceInit,
  );
  const validateServiceUrl = validate(
    serviceUrl,
    serviceUrlSchema,
    serviceUrlValid,
    serviceUrlInit,
  );
  const validateServiceImgUrl = validate(
    serviceImgUrl,
    serviceImgSchema,
    serviceImgUrlValid,
    serviceImgUrlInit,
  );
  const validateCost = validate(cost, costSchema, costValid, costInit);
  const validateCurrency = validate(
    currency,
    currencySchema,
    currencyValid,
    currencyInit,
  );
  const validateInterval = validate(
    interval,
    billingIntervalSchema,
    intervalValid,
    intervalInit,
  );

  const formValid = computed(
    () =>
      titleValid.value &&
      serviceValid.value &&
      serviceUrlValid.value &&
      serviceImgUrlValid &&
      costValid.value &&
      currencyValid.value,
  );

  const debounce = 200;

  watchDebounced(title, () => validateTitle(), { debounce });
  watchDebounced(service, () => validateService(), { debounce });
  watchDebounced(serviceUrl, () => validateServiceUrl(), { debounce });
  watchDebounced(serviceImgUrl, () => validateServiceImgUrl(), { debounce });
  watchDebounced(cost, () => validateCost(), { debounce });
  watchDebounced(currency, () => validateCurrency(), { debounce });
  watchDebounced(interval, () => validateInterval(), { debounce });

  function $reset() {
    title.value = '';
    titleValid.value = true;
    titleInit.value = true;
    service.value = '';
    serviceInit.value = true;
    serviceValid.value = true;
    serviceUrl.value = '';
    serviceUrlValid.value = true;
    serviceUrlInit.value = true;
    serviceImgUrl.value = undefined;
    serviceImgUrlInit.value = true;
    serviceImgUrlValid.value = true;
    cost.value = 0.0;
    costValid.value = true;
    costInit.value = true;
    currency.value = 'SEK';
    currencyValid.value = true;
    currencyInit.value = true;
    interval.value = BillingInterval.monthly;
    intervalInit.value = true;
    intervalValid.value = true;
    isNewSubscription.value = false;
    subscriptionId.value = undefined;
  }

  return {
    formValid,
    title,
    titleValid,
    titleInit,
    service,
    serviceInit,
    serviceValid,
    serviceUrl,
    serviceUrlValid,
    serviceUrlInit,
    serviceImgUrl,
    serviceImgUrlInit,
    serviceImgUrlValid,
    cost,
    costValid,
    costInit,
    currency,
    currencyValid,
    currencyInit,
    interval,
    intervalInit,
    intervalValid,
    isNewSubscription,
    subscriptionId,
    $reset,
  };
});
