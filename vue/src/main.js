// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui'
import custom from './assets/js/index.js'

import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
Vue.prototype.$moment = moment
Vue.prototype.$custom = custom
Vue.config.productionTip = false
// Vue使用ElementUI
Vue.use(ElementUI)
// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // 验证是否需要登陆
    if (sessionStorage.getItem('user_info')) { // 查询本地存储信息是否已经登陆
      next();
    } else {
      next({
        path: '/Login', // 未登录则跳转至login页面
        query: { redirect: to.fullPath } // 登陆成功后回到当前页面，这里传值给login页面，to.fullPath为当前点击的页面
      });
    }
  } else {
    next();
  }

});

/* eslint-disable no-new */
// 引入axios，并配置基础路径
// 又因是跨域请求node端，所以所有请求前页面都要添加node端的基础地址，以后打包上线时再删掉
// 又因是跨域请求，需要配置withCredentials为true，这样避免每次都被识别为新的请求
// 说明：在vue中，可以使用代理去实现跨域，但是每次新地址都需要配置，还是比较麻烦，这里我们采用直接配置跨域，一次配置就可以一劳永逸
import axios from 'axios'
axios.defaults.withCredentials = true // 跨域保存session
axios.defaults.baseURL = "/api" // 默认基础路径配置，打包时删掉
Vue.prototype.$axios = axios
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
