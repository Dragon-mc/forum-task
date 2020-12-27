import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import category from '@/views/category'
import userCenter from '@/views/userCenter'
import profile from '@/views/profile'
import collection from '@/views/collection'
import myPublish from '@/views/myPublish'
import draft from '@/views/draft'
import attention from '@/views/attention'
import fans from '@/views/fans'
import editor from '@/views/editor'
import post from '@/views/post'
import history from '@/views/history'
import feedback from '@/views/feedback'
import search from '@/views/search'
import login from '@/views/login'
import register from '@/views/register'
import rank from '@/views/rank'
import browseRank from '@/views/rank/browse-rank'
import commentRank from '@/views/rank/comment-rank'
import attentionRank from '@/views/rank/attention-rank'

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
      name: 'index',
      component: index
    },
    {
      path: '/cate',
      name: 'cate',
      component: category
    },
    {
      path: '/editor',
      name: 'editor',
      component: editor
    },
    {
      path: '/post/:id',
      name: 'post',
      component: post
    },
    {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/uc/:id',
      // name: 'userCenter',
      component: userCenter,
      children: [
        {
          path: '',
          redirect: 'profile'
        },
        {
          path: 'profile',
          name: 'profile',
          component: profile
        },
        {
          path: 'collection',
          name: 'collection',
          component: collection
        },
        {
          path: 'myPublish',
          name: 'myPublish',
          component: myPublish
        },
        {
          path: 'draft',
          name: 'draft',
          component: draft
        },
        {
          path: 'attention',
          name: 'attention',
          component: attention
        },
        {
          path: 'fans',
          name: 'fans',
          component: fans
        },
        {
          path: 'history',
          name: 'history',
          component: history
        },
        {
          path: 'feedback',
          name: 'feedback',
          component: feedback
        }
      ]
    },
    {
      path: '/rank',
      // name: 'rank',
      component: rank,
      children: [
        {
          path: '',
          redirect: 'browse_rank'
        },
        {
          path: 'browse_rank',
          name: 'browse_rank',
          component: browseRank
        },
        {
          path: 'comment_rank',
          name: 'comment_rank',
          component: commentRank
        },
        {
          path: 'attention_rank',
          name: 'attention_rank',
          component: attentionRank
        }
      ]
    }
  ]
})
