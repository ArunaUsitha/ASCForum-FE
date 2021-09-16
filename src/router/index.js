import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import PostCreate from '../views/PostCreate'
import PostView from '../views/PostView'
import PostsPending from '../views/PostsPending'
import MyPosts from '../views/MyPosts'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      authOnly: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/posts/create',
    name: 'posts/create',
    component: PostCreate,
    meta: {
      authOnly: true
    }
  },
  {
    path: '/posts/pending',
    name: 'posts/pending',
    component: PostsPending,
    meta: {
      authOnly: true
    }
  },
  {
    path: '/posts/view/:id',
    name: 'posts/view',
    component: PostView,
    meta: {
      authOnly: true
    }
  },
  {
    path: '/posts/all',
    name: 'posts/all',
    component: MyPosts,
    meta: {
      authOnly: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

function isLoggedIn () {
  return localStorage.getItem('auth')
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authOnly)) {
    if (!isLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
