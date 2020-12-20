import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import category from '@/views/category'
import userCenter from '@/views/userCenter'
import profile from '@/views/profile'
import collection from '@/views/collection'
import myPublish from '@/views/myPublish'
import attention from '@/views/attention'
import fans from '@/views/fans'
import editor from '@/views/editor'
import post from '@/views/post'
import history from '@/views/history'
import search from '@/views/search'
import login from '@/views/login'
import register from '@/views/register'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: '首页',
      component: index
    },
    {
      path: '/cate',
      name: '分类',
      component: category
    },
    {
      path: '/editor',
      name: '发帖',
      component: editor
    },
    {
      path: '/post/:id',
      name: '帖子详情',
      component: post
    },
    {
      path: '/search',
      name: '搜索',
      component: search
    },
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/register',
      name: '注册',
      component: register
    },
    {
      path: '/uc/:id',
      name: '个人中心',
      component: userCenter,
      children: [
        {
          path: '',
          redirect: 'profile'
        },
        {
          path: 'profile',
          name: '个人资料',
          component: profile
        },
        {
          path: 'collection',
          name: '收藏',
          component: collection
        },
        {
          path: 'myPublish',
          name: '收藏',
          component: myPublish
        },
        {
          path: 'attention',
          name: '关注',
          component: attention
        },
        {
          path: 'fans',
          name: '粉丝',
          component: fans
        },
        {
          path: 'history',
          name: '历史记录',
          component: history
        }
      ]
    }
  ]
})
