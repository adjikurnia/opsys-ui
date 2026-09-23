import { createRouter, createWebHistory } from 'vue-router'

/**
 * Hirarki drill-down: Nasional → Sistem → UP2B → Subsistem (SLD).
 * Navigasi kembali ke atas memakai breadcrumb di header (tanpa sidebar).
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'national', component: () => import('@/views/NationalView.vue') },
    { path: '/sistem/:systemId', name: 'system', component: () => import('@/views/SystemView.vue') },
    { path: '/sistem/:systemId/ibt', name: 'ibt-list', component: () => import('@/views/IbtListView.vue') },
    { path: '/sistem/:systemId/upb/:upbId', name: 'upb', component: () => import('@/views/UpbView.vue') },
    {
      path: '/sistem/:systemId/upb/:upbId/subsistem/:subsystemId',
      name: 'subsystem',
      component: () => import('@/views/SubsystemView.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
