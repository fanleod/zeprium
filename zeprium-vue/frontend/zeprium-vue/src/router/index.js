import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/blog/BlogList.vue')
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: () => import('../views/blog/BlogDetail.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'posts',
        name: 'admin-posts',
        component: () => import('../views/admin/AdminPosts.vue')
      },
      {
        path: 'posts/new',
        name: 'admin-post-new',
        component: () => import('../views/admin/AdminPostEdit.vue')
      },
      {
        path: 'posts/edit/:id',
        name: 'admin-post-edit',
        component: () => import('../views/admin/AdminPostEdit.vue')
      },
      {
        path: 'media',
        name: 'admin-media',
        component: () => import('../views/admin/AdminMedia.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/admin/LoginView.vue')
  },
  {
    path: '*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 导航守卫
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 检查是否已登录
    if (!store.getters['auth/isAuthenticated']) {
      // 未登录，重定向到登录页面
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      // 已登录，允许访问
      next()
    }
  } else {
    // 不需要认证的路由，直接放行
    next()
  }
})

export default router 