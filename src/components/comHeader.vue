<template>
  <div class="header_wrap">
    <div class="header_fixed">
      <div class="header_inner my-container">
        <div class="logo">
          <h1>
            <router-link to="/index"><img src="../assets/logo.png" alt="forum" title="forum"></router-link>
          </h1>
          <h2>
            <router-link to="/index">Forum</router-link>
          </h2>
        </div>
        <ul class="navigator hidden-sm-and-down">
          <li @mouseenter="handleInNav(0)" @mouseleave="handleOutNav"><router-link to="/index" title="首页">首页</router-link></li>
          <li @mouseenter="handleInNav(1)" @mouseleave="handleOutNav"><router-link to="/cate" title="分类">分类</router-link></li>
          <li @mouseenter="handleInNav(2)" @mouseleave="handleOutNav"><a href="javascript:;" title="个人中心" @click="handleToUserCenter">个人中心</a></li>
          <div class="indicator" :style="{transform: `translateX(${indicatorIndex*70}px)`, width: indicatorWidth*hasIndicator+'px'}"></div>
        </ul>
        <div class="search_wrap">
          <el-input placeholder="请输入搜索内容" v-model="searchInput" class="search_input" size="small" @keyup.native.enter="handldSearch"></el-input>
          <el-button icon="el-icon-search" type="primary" @click="handldSearch" size="mini" class="search_btn"></el-button>
        </div>
        <a href="javascript:;" @click="handleEdit"><el-button type="primary" size="mini" icon="el-icon-edit" round class="hidden-xs-only">发帖</el-button></a>
        <div class="right_wrap">
          <el-dropdown v-if="login">
            <router-link :to="`/uc/${userInfo.id}`"><img class="avatar" :src="userInfo.avatar || '/static/img/photo.jpg'"></router-link>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><router-link :to="`/uc/${userInfo.id}`"><i class="el-icon-user-solid"></i>个人中心</router-link></el-dropdown-item>
              <el-dropdown-item><i class="el-icon-s-tools"></i>用户设置</el-dropdown-item>
              <el-dropdown-item divided @click.native="handleLogout"><i class="iconfont icon-logout"></i>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div v-else>
            <router-link to="/login">登录</router-link>&nbsp;/&nbsp;<router-link to="/register">注册</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { isLogin } from '@/utils'
import { getUserInfo } from '@/utils'

export default {
  props: {
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 输入框内容
      searchInput: '',
      indicatorIndex: 0,
      indicatorWidth: 70,
      hasIndicator: 1,
      login: false,
      userInfo: {}
    }
  },
  mounted () {
    this.userInfo = getUserInfo()
    this.login = isLogin()

    if (this.index == -1) {
      this.indicatorIndex = 0
      this.hasIndicator = 0
      return
    }
    this.indicatorIndex = this.index
  },
  methods: {
    // 点击搜索按钮，搜索内容
    handldSearch () {
      if (this.searchInput.trim() == '') return
      let route = this.$router.resolve({
        path: '/search',
        query: {keywords: this.searchInput}
      })
      window.open(route.href, '_blank')
    },
    
    handleInNav (index) {
      this.indicatorIndex = index
      if (this.index == -1) this.hasIndicator = 1
    },

    handleOutNav () {
      this.indicatorIndex = this.index == -1 ? 0 : this.index
      if (this.index == -1) this.hasIndicator = 0
    },

    // 跳转个人中心
    handleToUserCenter () {
      if (!this.login) {
        this.$message({
          message: '请登录后操作！',
          type: 'error'
        })
        return
      }
      let route = this.$router.push({
        path: `/uc/${this.userInfo.id}`
      })
      // window.open(route.href, this.index==2?'_self':'_blank')
    },

    // 点击发帖
    handleEdit () {
      if (!this.login) {
        this.$message({
          message: '请登录后操作！',
          type: 'error'
        })
        return
      }
      this.$router.push("/editor")
    },

    // 退出登录
    handleLogout () {
      Cookies.remove('forum-user')
      this.$message({
        message: '退出成功！',
        type: 'success'
      })
      this.login = isLogin()
      if (this.$route.path != '/index') {
        this.$router.replace('/index')
      }
      
    }

  }
}
</script>

<style lang="scss">
  .header_wrap {
    height: 45px;

    .header_fixed {
      position: fixed;
      width: 100%;
      background: #fff;
      z-index: 999;

      .header_inner {
        margin: 0 auto;
        // width: 1180px;
        height: 45px;
        display: flex;
        justify-content: space-between;
        height: inherit;
        align-items: center;

        .logo {
          height: 30px;
          h1 {
            height: 100%;
            img {
              height: 100%;
            }
          }
          h2 {
            display: none;
          }
        }

        .navigator {
          height: 45px;
          display: flex;
          position: relative;
          a {
            width: 70px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 45px;
            &:hover {
              background: #f5f5f5;
            }
          }
          .indicator {
            background: #409EFF;
            height: 2px;
            position: absolute;
            bottom: 0;
            transition-duration: 0.3s;
          }
        }

        .search_wrap {
          display: flex;
          .search_input {
            input {
              border-radius: 16px 0 0 16px;
            }
          }
          .search_btn {
            border-radius: 0 16px 16px 0;
          }
        }
        .right_wrap {
          width: 70px;
          display: flex;
          justify-content: flex-end;
          .avatar {
            height: 36px;
            width: 36px;
            object-fit: cover;
            border-radius: 50%;
          }
          .el-dropdown {
            margin-top: 3px;
          }
          a {
            &:hover {
              color: #409EFF;
            }
          }
        }
      }
    }
    
  }
</style>