import { createRouter, createWebHashHistory } from 'vue-router'
const modules = import.meta.glob('./module/*.js',{ eager: true })
console.log(modules);

const routeArray = []
for (const key in modules) {
  const item = modules[key]
  routeArray.push(...item.default)
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: '首页'
      }
    },
    ...routeArray
  ]
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || '测试'
  next()
})

export default router
