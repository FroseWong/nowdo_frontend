import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import WorkSpace from '@/views/Workspace.vue';
import Board from '@/views/Board.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import AccountManage from '@/views/AccountManage.vue';
import Test from '@/views/Test.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: Board

    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: function () {
    //   return import(/* webpackChunkName: "about" */ "../views/AboutView.vue");
    // },
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: WorkSpace,
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:boardId',
    name: 'board',
    component: Board,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: ResetPassword
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/account-manage',
    name: 'accountManage',
    component: AccountManage,
    meta: { requiresAuth: true }
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('nowdoToken');

  // 如果是首頁且已登入，轉去 workspace
  if ((to.path === '/' || to.path === '/login') && token) {
    return next('/workspace');
  }

  // 如果是需要登入的頁面且沒 token，導去 login
  if (to.meta.requiresAuth && !token) {
    next('/login');
  }

  // 其他情況正常前往
  next();
});

export default router;
