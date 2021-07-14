import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/login.vue'
import { Auth } from './auth'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/main',
    name: 'Main',
    redirect: '/list',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../layout/mainPage.vue'),
    children: [
      {
        path: '/list',
        name: 'List',
        component: () => import('../views/list/list.vue')
      },
      {
        path: '/poster',
        name: 'Poster',
        component: () => import('../views/poster/list.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach(Auth)
export default router
