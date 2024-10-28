<script setup lang="ts">
import { computed, type Component } from "vue";
import { variant } from ".";

interface ButtonProps {
  icon?: Component;
  variant?: variant;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: variant.Primary,
});

const classes = computed(() => {
  if (props.variant === variant.Primary) return "bg-amber-400 text-black";
  return "bg-white text-black";
});
</script>

<template>
  <button
    :class="[
      'px-4 py-4 flex items-center justify-center gap-4 h-fit rounded text-xl font-medium duration-150 ease-in-out hover:opacity-75 disabled:opacity-30 disabled:cursor-not-allowed min-w-fit',
      classes,
    ]"
  >
    <component :is="icon" v-if="icon" />
    <slot></slot>
  </button>
</template>
