<template>
  <div class="user_center_wrap">
    <com-header :index="2"></com-header>
    <div class="info_card">
      <div class="inner my-container">
        <div class="user_avatar">
          <img :src="userInfo.avatar || '/static/img/photo.jpg'" alt="avatar">
        </div>
        <div class="user_info">
          <div class="name">
            {{userInfo.nickname || userInfo.username}}
          </div>
          <div class="interactive">
            关注<span class="attention">{{userInfo.attention_num}}</span>
            粉丝<span class="fans">{{userInfo.fans_num}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container_wrap my-container">
      <el-row :gutter="12">
        <div class="main">
          <el-col :span="3">
            <ul class="nav">
              <li><router-link :to="{path: `/uc/${nowUserId}/profile`, query: userInfo}">{{prefix=='我'?'个人':'Ta的'}}资料</router-link></li>
              <li><router-link :to="`/uc/${nowUserId}/collection`">{{prefix}}收藏的</router-link></li>
              <li><router-link :to="`/uc/${nowUserId}/myPublish`">{{prefix}}发布的</router-link></li>
              <li><router-link :to="`/uc/${nowUserId}/attention`">{{prefix}}关注的</router-link></li>
              <li><router-link :to="`/uc/${nowUserId}/fans`">{{prefix}}的粉丝</router-link></li>
              <li><router-link :to="`/uc/${nowUserId}/history`">浏览历史</router-link></li>
            </ul>
          </el-col>
          <el-col :span="21">
            <div class="content">
              <router-view></router-view>
            </div>
          </el-col>
        </div>
      </el-row>
    </div>
    <com-footer></com-footer>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import comHeader from '@/components/comHeader'
import comFooter from '@/components/comFooter'
import { getUserCenterInfo } from '@/api/userCenter'
import { getUserInfo } from '@/utils'

export default {
  data () {
    return {
      userInfo: {},
      nowUserId: undefined,
      prefix: '我'
    }
  },
  methods: {

  },
  async mounted () {
    // this.userInfo = JSON.parse(getUserInfo())
    // 获取路由中的id，保存为当前查看用户的id
    this.nowUserId = this.$route.params.id
    let res = await getUserCenterInfo({id: this.nowUserId})
    this.userInfo = res.data
    if (this.nowUserId != JSON.parse(getUserInfo()).id)
      this.prefix = 'Ta'
  },
  components: {
    comHeader,
    comFooter
  }
}
</script>

<style lang="scss" scoped>
  .user_center_wrap {
    min-height: 100vh;
    background: rgb(245,246,247);

    .info_card {
      height: 150px;
      background: linear-gradient(45deg,#020031,#6d3353);
      .inner {
        height: 100%;
        display: flex;
        align-items: center;
        .user_avatar {
          padding: 0 40px;
          img {
            border-radius: 50%;
            width: 80px;
            height: 80px;
            object-fit: cover;
          }
        }
        .user_info {
          color: #fff;
          .name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .interactive {
            .attention {
              margin-right: 10px;
              padding-left: 6px;
            }
            .fans {
              padding-left: 6px;
            }
          }
        }
      }
    }
    .container_wrap {
      padding: 12px 0;
      .main {
        .nav {
          // height: 300px;
          background: #fff;
          border-radius: 12px;
          padding: 16px 0;
          li {
            // height: 35px;
            
            margin-bottom: 16px;
            a {
              display: flex;
              margin: 0 16px;
              height: 100%;
              justify-content: center;
              align-items: center;
              padding: 8px 0;
              &:hover {
                background: rgb(245,246,247);
                border-radius: 17.5px;
                color: #409EFF;
              }
            }
            .router-link-active {
              background: rgb(245,246,247);
              border-radius: 17.5px;
            }
          }
        }
        .content {
          // height: 300px;
          background: #fff;
          border-radius: 12px;
        }
      }
    }
    
  }
</style>