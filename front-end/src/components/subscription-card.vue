<script lang="ts" setup>
import type { SubscriptionSchema } from "@/util/subscription-util";

defineProps<{
  subscription: Pick<
    SubscriptionSchema,
    "title" | "service" | "serviceImg" | "cost" | "currency"
  >;
}>();
</script>

<template>
  <div class="grid p-6 gap-4 bg-slate-900 rounded">
    <img
      class="w-12 rounded-full"
      :src="
        subscription.serviceImg ??
        'https://unsplash.com/photos/0Sou_P3wuak/download?ixid=M3wxMjA3fDB8MXx0b3BpY3x8Q0R3dXdYSkFiRXd8fHx8fDJ8fDE3Mjg3NjM4NDJ8&force=true&w=640'
      "
      :alt="`${subscription.service} logo`"
    />
    <div class="flex items-end justify-between gap-4 min-w-60 max-w-[24rem]">
      <h3 class="text-xl">{{ subscription.title }}</h3>
      <p>{{ subscription.cost }} {{ subscription.currency }}</p>
    </div>
  </div>
</template>
