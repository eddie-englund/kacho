<script lang="ts" setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";
import kButton from "./k-button.vue";
import { CreateSubscriptionSchemas } from "@/util/subscription-util";
import { computed, shallowRef, type ShallowRef } from "vue";
import type { ZodSchema } from "zod";
import { useFetch, watchDebounced } from "@vueuse/core";
import consola from "consola";

const {
  titleSchema,
  serviceSchema,
  serviceImgSchema,
  serviceUrlSchema,
  costSchema,
  currencySchema,
  billingIntervalSchema,
} = CreateSubscriptionSchemas;

const emit = defineEmits(["close", "submit"]);

const validate =
  (
    value: ShallowRef<unknown>,
    schema: ZodSchema,
    validityRef: ShallowRef<boolean>,
    initRef: ShallowRef<boolean>
  ) =>
  (): void => {
    initRef.value = false;
    const validation = schema.safeParse(value.value);
    validityRef.value = validation.success;
  };

const title = shallowRef<string>("");
const service = shallowRef<string>("");
const serviceUrl = shallowRef<string>("");
const serviceImgUrl = shallowRef<string>();
const cost = shallowRef<number>(1);
const currency = shallowRef<string>("SEK");
const interval = shallowRef<string>("monthly");

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
  serviceInit
);
const validateServiceUrl = validate(
  serviceUrl,
  serviceUrlSchema,
  serviceUrlValid,
  serviceUrlInit
);
const validateServiceImgUrl = validate(
  serviceImgUrl,
  serviceImgSchema,
  serviceImgUrlValid,
  serviceImgUrlInit
);
const validateCost = validate(cost, costSchema, costValid, costInit);
const validateCurrency = validate(
  currency,
  currencySchema,
  currencyValid,
  currencyInit
);
const validateInterval = validate(
  interval,
  billingIntervalSchema,
  intervalValid,
  intervalInit
);

const formValid = computed(
  () =>
    titleValid.value &&
    serviceValid.value &&
    serviceUrlValid.value &&
    serviceImgUrlValid &&
    costValid.value &&
    currencyValid.value
);

const debounce = 200;

watchDebounced(title, () => validateTitle(), { debounce });
watchDebounced(service, () => validateService(), { debounce });
watchDebounced(serviceUrl, () => validateServiceUrl(), { debounce });
watchDebounced(serviceImgUrl, () => validateServiceImgUrl(), { debounce });
watchDebounced(cost, () => validateCost(), { debounce });
watchDebounced(currency, () => validateCurrency(), { debounce });
watchDebounced(interval, () => validateInterval(), { debounce });

const { post, isFetching, error } = useFetch(
  `${import.meta.env.VITE_BASE_URL}/subscription`,
  {
    immediate: false,
  }
);

async function handleSubmit() {
  if (!formValid.value || isFetching.value) {
    consola.log(
      `Form invalid: ${formValid.value} && isFetching: ${isFetching.value}`
    );
  }

  const finalForm = await CreateSubscriptionSchemas.completeSchema.parseAsync({
    service: service.value,
    serviceUrl: serviceUrl.value,
    serviceImg: serviceImgUrl.value,
    title: title.value,
    cost: cost.value,
    currency: currency.value,
    billingInterval: interval.value,
  });

  await post({ active: true, ...finalForm })
    .json()
    .execute();

  if (!error.value) return emit("submit");
}
</script>

<template>
  <Dialog class="relative z-50" as="div">
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
      <dialog-panel class="bg-slate-900 rounded p-6 min-w-[30rem]">
        <dialog-title class="text-2xl">New subscription</dialog-title>
        <dialog-description class="text-sm font-light">
          Another subscription, really? 🧐
        </dialog-description>
        <div class="grid grid-cols-1 gap-4 mt-4">
          <div class="grid grid-cols-1">
            <label class="text-sm" for="title">Title</label>
            <input
              v-model="title"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="title"
              required
              placeholder="Spotify family"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="!titleValid && !titleInit ? 'block' : 'invisible'"
            >
              Title is invalid
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="service">Service</label>
            <input
              v-model="service"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="service"
              required
              placeholder="Spotify"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="!serviceValid && !serviceInit ? 'block' : 'invisible'"
            >
              Service is invalid
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="service-url">Service URL</label>
            <input
              v-model="serviceUrl"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="service-url"
              required
              placeholder="https://spotify.com"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="
                !serviceUrlValid && !serviceUrlInit ? 'block' : 'invisible'
              "
            >
              Service is not a valid URL
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="cost">Cost</label>
            <input
              v-model="cost"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="number"
              numerical
              name="cost"
              required
              placeholder="9.99"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="!costValid && !costInit ? 'block' : 'invisible'"
            >
              Invalid amount, must be a number above 0
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="currency">Currency</label>
            <input
              v-model="currency"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="currency"
              max="10"
              min="3"
              required
              placeholder="SEK"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="!currencyValid && !currencyInit ? 'block' : 'invisible'"
            >
              Invalid currency must be at least 3 digits.
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="billing-interval">
              Billing Interval
            </label>
            <select
              v-model="interval"
              name="billing-interval"
              required
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
            >
              <option value="monthly">Monthly</option>
              <option value="monthly">Bimonthly</option>
              <option value="weekly">Weekly</option>
              <option value="weekly">Biweekly</option>
            </select>
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="!intervalValid && !intervalInit ? 'block' : 'invisible'"
            >
              Select an interval.
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="icon-url">Icon URL</label>
            <input
              v-model="serviceImgUrl"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="icon-url"
              required
              placeholder="https://someurl.com/myimg.png"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="
                !serviceImgUrlValid && !serviceImgUrlInit
                  ? 'block'
                  : 'invisible'
              "
            >
              Invalid URL
            </p>
          </div>
          <p v-if="error" class="text-red-400 font-md">
            Something went wrong got error: {{ error }}
          </p>
          <div class="grid grid-cols-2 gap-4 justify-between">
            <k-button @click="emit('close')" variant="secondary">
              Cancel
            </k-button>
            <k-button
              @click="handleSubmit"
              :disabled="!formValid || isFetching"
            >
              Submit
            </k-button>
          </div>
        </div>
      </dialog-panel>
    </div>
  </Dialog>
</template>
