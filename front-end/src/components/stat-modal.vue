<template>
  <div class="p-6 grid gap-4 bg-slate-900 rounded" key="subscription-total">
    <p class="text-slate-400">
      <slot name="title"></slot>
    </p>
    <h3 class="text-3xl flex gap-4 text-amber-400">
      <slot name="value">0.00 ???</slot>
    </h3>
  </div>
</template>
