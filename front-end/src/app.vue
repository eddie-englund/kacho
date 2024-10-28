<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen mx-auto w-[1000px] box-border">
    <div>
      <header class="mt-10">
        <nav>
          <RouterLink class="text-2xl font-semibold" to="/">Kachō 🔥</RouterLink>
        </nav>
      </header>

      <RouterView />
    </div>
  </div>
</template>
