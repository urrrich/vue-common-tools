import { createRouter, createWebHashHistory } from "vue-router";


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./pages/index.vue')
    },
    {
      path: '/alert',
      component: () => import('./pages/alert.vue')
    },
    {
      path: '/form',
      component: () => import('./pages/form.vue')
    }
  ],
})

export default router