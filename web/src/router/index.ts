import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/flow",
      children: [
        {
          path: "flow",
          name: "flowlist",
          component: () => import("../views/FlowView.vue"),
        },
      ],
    },
  ]
})

export default router
