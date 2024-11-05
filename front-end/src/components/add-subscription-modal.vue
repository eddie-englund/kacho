<script lang="ts" setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";
import kButton from "./k-button.vue";
import { CreateSubscriptionSchemas } from "@/util/subscription-util";
import { useFetch } from "@vueuse/core";
import consola from "consola";
import { useSubscriptionStore } from "@/stores/subscriptions-store";
import { BillingInterval } from "lib";
import { config } from "@/config";

const subscriptionStore = useSubscriptionStore();
const emit = defineEmits(["close", "submit"]);

const { post, put, isFetching, error } = useFetch(
  `${config.apiBaseUrl}/subscription`,
  {
    immediate: false,
  }
);

// TODO: Handle edit case!
async function handleSubmit() {
  if (!subscriptionStore.formValid || isFetching.value) {
    consola.log(
      `Form invalid: ${subscriptionStore.formValid} && isFetching: ${isFetching.value}`
    );
  }

  const finalForm = await CreateSubscriptionSchemas.completeSchema.parseAsync({
    service: subscriptionStore.service,
    serviceUrl: subscriptionStore.serviceUrl,
    serviceImg: subscriptionStore.serviceImgUrl,
    title: subscriptionStore.title,
    cost: subscriptionStore.cost,
    currency: subscriptionStore.currency,
    billingInterval: subscriptionStore.interval,
  });

  if (subscriptionStore.isNewSubscription) {
    await put({ active: true, ...finalForm, id: subscriptionStore.subscriptionId })
      .json()
      .execute();
  } else {
    await post({ active: true, ...finalForm })
      .json()
      .execute();
  }

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
              v-model="subscriptionStore.title"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="title"
              required
              placeholder="Spotify family"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="
                !subscriptionStore.titleValid && !subscriptionStore.titleInit
                  ? 'block'
                  : 'invisible'
              "
            >
              Title is invalid
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="service">Service</label>
            <input
              v-model="subscriptionStore.service"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="service"
              required
              placeholder="Spotify"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="
                !subscriptionStore.serviceValid &&
                !subscriptionStore.serviceInit
                  ? 'block'
                  : 'invisible'
              "
            >
              Service is invalid
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="service-url">Service URL</label>
            <input
              v-model="subscriptionStore.serviceUrl"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="service-url"
              required
              placeholder="https://spotify.com"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="
                !subscriptionStore.serviceUrlValid &&
                !subscriptionStore.serviceUrlInit
                  ? 'block'
                  : 'invisible'
              "
            >
              Service is not a valid URL
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="cost">Cost</label>
            <input
              v-model="subscriptionStore.cost"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="number"
              numerical
              name="cost"
              required
              placeholder="9.99"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="
                !subscriptionStore.costValid && !subscriptionStore.costInit
                  ? 'block'
                  : 'invisible'
              "
            >
              Invalid amount, must be a number above 0
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="currency">Currency</label>
            <input
              v-model="subscriptionStore.currency"
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
              :class="
                !subscriptionStore.currencyValid &&
                !subscriptionStore.currencyInit
                  ? 'block'
                  : 'invisible'
              "
            >
              Invalid currency must be at least 3 digits.
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="billing-interval">
              Billing Interval
            </label>
            <select
              v-model="subscriptionStore.interval"
              name="billing-interval"
              required
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
            >
              <option
                v-for="option in Object.values(BillingInterval)"
                :key="option"
                class="capitalize"
              >
                {{ option }}
              </option>
            </select>
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="
                !subscriptionStore.intervalValid &&
                !subscriptionStore.intervalInit
                  ? 'block'
                  : 'invisible'
              "
            >
              Select an interval.
            </p>
          </div>
          <div class="grid grid-cols-1">
            <label class="text-sm" for="icon-url">Icon URL</label>
            <input
              v-model="subscriptionStore.serviceImgUrl"
              class="px-4 py-2 bg-slate-800 rounded placeholder:font-thin placeholder:text-slate-400"
              type="text"
              name="icon-url"
              required
              placeholder="https://someurl.com/myimg.png"
            />
            <p
              class="text-red-400 text-sm transition duration-150 ease-in-out"
              :class="
                !subscriptionStore.serviceImgUrlValid &&
                !subscriptionStore.serviceImgUrlInit
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
              :disabled="!subscriptionStore.formValid || isFetching"
            >
              Submit
            </k-button>
          </div>
        </div>
      </dialog-panel>
    </div>
  </Dialog>
</template>
