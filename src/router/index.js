import Vue from 'vue'
import VueRouter from 'vue-router'
import entranceRoute from './entrance'
Vue.use(VueRouter)

const routes = entranceRoute

const router = new VueRouter({
  routes,
  scrollBehavior: () => ({ y: 0 })
})

export default router
