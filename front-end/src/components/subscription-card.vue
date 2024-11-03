<script lang="ts" setup>
import type { homeSchema } from "@/util/subscription-util";

defineProps<{ subscription: homeSchema }>();
</script>

<template>
  <div
    class="grid p-6 gap-4 bg-slate-900 rounded hover:opacity-90 duration-150 transition ease-in-out cursor-pointer hover:outline hover:outline-2 hover:outline-amber-400"
    :class="subscription.active ? undefined : 'opacity-30'"
  >
    <img
      class="w-12 rounded-full"
      :class="{ 'w-12 h-12': !subscription.serviceImg }"
      :src="
        subscription.serviceImg ??
        'https://unsplash.com/photos/0Sou_P3wuak/download?ixid=M3wxMjA3fDB8MXx0b3BpY3x8Q0R3dXdYSkFiRXd8fHx8fDJ8fDE3Mjg3NjM4NDJ8&force=true&w=320'
      "
      :alt="`${subscription.title} logo`"
    />
    <div class="flex items-end justify-between gap-4 min-w-60 max-w-[24rem]">
      <h3 class="text-xl">{{ subscription.title }}</h3>
      <p>{{ subscription.cost }} {{ subscription.currency }}</p>
    </div>
  </div>
</template>
