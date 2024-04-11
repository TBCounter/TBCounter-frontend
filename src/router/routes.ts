import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/:id',
        name: 'account',
        component: () => import('pages/AccountPage.vue'),
      },
      {
        path: '/:id/report',
        name: 'report',
        component: () => import('pages/ReportPage.vue'),
      },
      {
        path: '/:id/chests',
        name: 'chests',
        component: () => import('pages/ChestsPage.vue'),
      },
    ],
  },

  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
