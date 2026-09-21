import { createRouter, createWebHistory } from 'vue-router'

import { docEntries, entryPath } from '@/docs/registry'

const pages = import.meta.glob('../views/*Doc.vue')
const fallback = () => import('@/views/NotFoundDoc.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', redirect: entryPath(docEntries.find((entry) => entry.key === 'all') ?? docEntries[0]!) },
    ...docEntries.map((entry) => ({
      path: entryPath(entry),
      name: entry.key,
      component: pages[`../views/${entry.file}`] ?? fallback,
    })),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.afterEach((to) => {
  const entry = docEntries.find((item) => item.key === to.name)

  document.title = entry ? `${entry.title} · Nyana UI` : 'Nyana UI 组件库'
})

export default router
