import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home-view.vue';
import { config } from "@/config";

const router = createRouter({
  history: createWebHistory(config.webBaseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
});

export default router;
