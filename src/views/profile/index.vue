<template>
  <div class="profile_wrap">
    <div class="title">
      {{prefix}}信息
    </div>
    <div class="profile_content">
      <div class="msg_item">
        <div class="msg_key">用户名</div>
        <div class="msg_val">{{userInfo.username}}</div>
      </div>
      <div class="msg_item">
        <div class="msg_key">昵称</div>
        <div class="msg_val">{{userInfo.nickname}}</div>
      </div>
      <div class="msg_item">
        <div class="msg_key">签名</div>
        <div class="msg_val">{{userInfo.sign}}</div>
      </div>
      <div class="msg_item">
        <div class="msg_key">简介</div>
        <div class="msg_val">这是非常非常非常短的简介,这是非常非常非常短的简介,这是非常非常非常短的简介</div>
      </div>
      <div class="msg_item">
        <div class="msg_key">性别</div>
        <div class="msg_val">{{userInfo.sex}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserCenterInfo } from '@/api/userCenter'
import { getUserInfo } from '@/utils'

export default {
  data () {
    return {
      userInfo: {},
      prefix: '个人'
    }
  },
  mounted () {
    this.getShowUserInfo()
    if (JSON.parse(getUserInfo()).id != this.$route.params.id)
      this.prefix = 'Ta的'
  },
  methods: {
    // 获取展示用户资料列表
    async getShowUserInfo () {
      if (Object.keys(this.$route.query).length) {
        this.userInfo = this.$route.query
      } else {
        let res = await getUserCenterInfo({id: this.$route.params.id})
        this.userInfo = res.data
      }
    }
  }
  
}
</script>

<style lang="scss" scoped>
  .profile_wrap {
    padding: 24px;
    .title {
      font-size: 16px;
      color: #222226;
      font-weight: bold;
    }
    .profile_content {
      // padding-top: 16px;
      .msg_item {
        width: 100%;
        display: flex;
        margin: 20px 0;
        color: #555666;
        font-size: 14px;
        line-height: 24px;
        font-weight: 400;
        .msg_key {
          width: 64px;
          text-align: right;
          float: left;
          word-break: break-all;
        }
        .msg_val {
          flex: 1;
          padding-left: 16px;
          word-break: break-all;
        }
      }
    }
  }
</style>