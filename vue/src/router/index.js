import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Main from '@/components/Main'
import Calendar from '@/components/Calendar'
import Leave from '@/components/Leave'
import LeaveTable from '@/components/LeaveTable'
import LeaveList from '@/components/LeaveList'
import SalaryList from '@/components/SalaryList'
import SalaryTable from '@/components/SalaryTable'
import allUser from '@/components/allUser'
import StaffType from '@/components/StaffType'
import StaffList from '@/components/StaffList'
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: "Login",
      children: [
        {
          path: 'Login',
          name: 'Login',
          component: Login
        },
        {
          path: 'Register',
          name: 'Register',
          component: Register
        }
      ]
    },
    {
      path: '/Main',
      name: "Main",
      component: Main,
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      redirect: "/Calendar",
      children: [
        {
          path: '/Calendar',
          name: "Calendar",
          component: Calendar
        },
        {
          path: '/Leave',
          name: "Leave",
          component: Leave,
          redirect: "/LeaveTable",
          children: [
            {
              path: '/LeaveTable',
              name: 'LeaveTable',
              component: LeaveTable
            }
          ]
        }, {
          path: '/LeaveList',
          name: "LeaveList",
          component: LeaveList,
        },
        {
          path: "/SalaryList",
          name: 'SalaryList',
          component: SalaryList
        }, {
          path: '/SalaryTable',
          name: 'SalaryTable',
          component: SalaryTable
        }, {
          path: "/allUser",
          name: 'allUser',
          component: allUser
        },
        {
          path:'/StaffType',
          name:'StaffType',
          component:StaffType
        },
        {
          path:'/StaffList',
          name:'StaffList',
          component:StaffList
        }
      ]
    }
  ]
})

