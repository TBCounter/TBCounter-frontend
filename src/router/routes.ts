import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/:id',
        name: 'account',
        redirect: () => {
          return { name: 'chests' };
        },
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
    name: 'login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'notFound',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
