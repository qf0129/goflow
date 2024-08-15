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
          name: "flow_list",
          component: () => import("../views/FlowList.vue"),
        },
        {
          path: "flow/:id",
          name: "flow_detail",
          component: () => import("../views/FlowDetail.vue"),
        },
        {
          path: "flow_version/:id/edit",
          name: "flow_version_edit",
          component: () => import("../views/FlowVersionEdit.vue"),
        },
        {
          path: "order",
          name: "order_view",
          component: () => import("../views/OrderList.vue"),
        },
      ],
    },
  ]
})

export default router
