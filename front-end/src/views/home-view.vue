<script setup lang="ts">
import { refDebounced, useFetch } from "@vueuse/core";
import subscriptionCard from "@/components/subscription-card.vue";
import { SubscriptionSchema } from "@/util/subscription-util";
import { z } from "zod";
import { computed, shallowRef } from "vue";
import errorModal from "@/components/error-modal.vue";
import fuzzysort from "fuzzysort";
import kButton from "@/components/k-button.vue";
import { PlusCircle } from "lucide-vue-next";
import addSubscriptionModal from "@/components/add-subscription-modal.vue";
import statModal from "@/components/stat-modal.vue";
import { homeSchema, completeHomeSchema } from "@/util/subscription-util";

const query = shallowRef<string>("");
const searchQuery = refDebounced<string>(query, 150);
const subscriptions = shallowRef<homeSchema[]>([]);
const showNewSubscription = shallowRef<boolean>(false);

const searchResults = computed(() => {
  const results = fuzzysort.go(searchQuery.value, subscriptions.value, {
    keys: ["service", "title", "cost", "currency"],
    threshold: 0.5,
  });

  if (!results.length) return subscriptions.value;
  return results.map((e) => e.obj);
});

const { isFetching, error, execute } = useFetch<completeHomeSchema>(
  `${import.meta.env.VITE_BASE_URL}/subscriptions`,
  {
    async afterFetch(ctx) {
      const res = await completeHomeSchema.safeParseAsync(JSON.parse(ctx.data));

      if (res.success) subscriptions.value = res.data.data;
      return ctx;
    },
  }
);

const { data, execute: fetchTotal } = useFetch(
  `${import.meta.env.VITE_BASE_URL}/subscriptions/total-cost`
).json<{
  success: boolean;
  data: {
    monthlyTotal: number;
    currency: string;
    yearlyTotal: number;
    yearlySplitTotal: number;
    monthlySplitTotal: number;
  };
}>();

const handleCompleted = async () => {
  await execute();
  await fetchTotal();
  showNewSubscription.value = false;
};
</script>

<template>
  <main class="mt-10 relative">
    <add-subscription-modal
      :open="showNewSubscription"
      @close="showNewSubscription = false"
      @submit="handleCompleted"
    />
    <div>
      <div>
        <label for="searchBar" class="text-slate-400">Filter</label>
        <div class="flex gap-4 items-center">
          <input
            type="text"
            v-model="query"
            class="bg-slate-900 rounded p-4 text-white text-2xl placeholder:text-base w-full"
            placeholder="Filter...."
          />
          <k-button :icon="PlusCircle" @click="showNewSubscription = true">
            Add subscription
          </k-button>
        </div>
      </div>
      <error-modal v-if="error" class="mt-10">
        Something went wrong, please try again later.
      </error-modal>
      <transition-group
        name="subscriptions-list"
        tag="div"
        class="grid grid-cols-3 gap-6 justify-center pt-10"
      >
        <stat-modal key="subscription-monthly-total">
          <template #title>Total monthly subscriptions cost</template>
          <template #value>
            {{ data?.data.monthlyTotal.toFixed(2) }}
            {{ data?.data.currency }}</template
          >
        </stat-modal>
        <stat-modal key="subscription-monthly-split-total">
          <template #title>Total cost monthly splot</template>
          <template #value>
            {{ data?.data.monthlySplitTotal.toFixed(2) }}
            {{ data?.data.currency }}
          </template>
        </stat-modal>
        <stat-modal key="subscription-yearly-total">
          <template #title>Total yearly subscriptions cost</template>
          <template #value>
            {{ data?.data.yearlyTotal.toFixed(2) }}
            {{ data?.data.currency }}</template
          >
        </stat-modal>
        <stat-modal key="subscription-yearly-split-total">
          <template #title>Total cost yearly split</template>
          <template #value>
            {{ data?.data.yearlySplitTotal.toFixed(2) }}
            {{ data?.data.currency }}
          </template>
        </stat-modal>

        <subscription-card
          v-for="subscription in searchResults"
          :subscription
          :key="subscription.id"
        />
      </transition-group>
    </div>
  </main>
</template>

<style>
.subscriptions-list-move,
.subscriptions-list-enter-active,
.subscriptions-list-leave-active {
  @apply transition-all duration-300 ease-in-out;
}
.subscriptions-list-enter-from,
.subscriptions-list-leave-to {
  @apply opacity-0 transform translate-x-[30px] transition-all duration-300 ease-in-out;
}

.list-leave-active {
  @apply absolute;
}
</style>
