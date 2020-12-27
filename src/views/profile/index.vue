<template>
  <div class="profile_wrap">
    <div class="title">
      <span>{{prefix}}信息</span>
      <template v-if="self">
        <div class="modify" v-if="!modifyProfile" @click="handleModifyProfile">修改信息</div>
        <div class="save" v-else @click="handleSaveProfile">保存</div>
      </template>
    </div>
    <div class="profile_content" v-if="!modifyProfile">
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
        <div class="msg_val">{{userInfo.sign || '这个人很懒，什么都没留下'}}</div>
      </div>
      <div class="msg_item">
        <div class="msg_key">简介</div>
        <div class="msg_val">{{userInfo.introduction}}</div>
      </div>
      <div class="msg_item">
        <div class="msg_key">性别</div>
        <div class="msg_val">{{userInfo.sex}}</div>
      </div>
    </div>
    <div class="modify_form" v-else>
      <div class="msg_item">
        <div class="msg_key">昵称</div>
        <div class="msg_val"><el-input auto-complete="off" v-model="userInfo.nickname" placeholder="请输入昵称"></el-input></div>
      </div>
      <div class="msg_item">
        <div class="msg_key">签名</div>
        <div class="msg_val"><el-input auto-complete="off" v-model="userInfo.sign" maxlength="50" show-word-limit placeholder="请输入签名"></el-input></div>
      </div>
      <div class="msg_item">
        <div class="msg_key introduction">简介</div>
        <div class="msg_val"><el-input auto-complete="off" v-model="userInfo.introduction" type="textarea" maxlength="300" rows="5" :autosize="{ minRows: 5, maxRows: 10}" show-word-limit placeholder="请输入简介"></el-input></div>
      </div>
      <div class="msg_item">
        <div class="msg_key">性别</div>
        <div class="msg_val">
          <el-radio v-model="userInfo.sex" label="男">男</el-radio>
          <el-radio v-model="userInfo.sex" label="女">女</el-radio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserCenterInfo, modifyProfile } from '@/api/userCenter'
import { getUserInfo } from '@/utils'

export default {
  data () {
    return {
      userInfo: {},
      prefix: '个人',
      self: false,
      modifyProfile: false
    }
  },
  mounted () {
    this.getShowUserInfo()
    if (Number(getUserInfo().id) !== Number(this.$route.params.id)) {
      this.prefix = 'Ta的'
    } else {
      this.self = true
    }
  },
  methods: {
    // 获取展示用户资料列表
    async getShowUserInfo () {
      if (this.$route.params.userInfo) {
        this.userInfo = this.$route.params.userInfo
      } else {
        let res = await getUserCenterInfo({id: this.$route.params.id})
        this.userInfo = res.data
      }
    },

    // 修改用户信息
    handleModifyProfile () {
      this.modifyProfile = true
    },

    // 保存修改的用户信息
    async handleSaveProfile () {
      this.modifyProfile = false
      const data = Object.assign({}, this.userInfo)
      delete data['avatar']
      await modifyProfile(data)
      this.$message({
        message: '信息修改成功',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .profile_wrap {
    padding: 24px;
    .title {
      span {
        font-size: 16px;
      }
      color: #222226;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .modify {
        border: 1px solid #409EFF;
        color: #409EFF;
        height: 26px;
        width: 90px;
        text-align: center;
        line-height: 26px;
        border-radius: 13px;
        font-weight: normal;
        &:hover {
          background: rgba(16,142,233,.1);
          cursor: pointer;
        }
      }
      .save {
        background: #409EFF;
        width: 62px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        border-radius: 13px;
        color: #fff;
        font-weight: normal;
        &:hover {
          opacity: 0.9;
          cursor: pointer;
        }
      }
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
    .modify_form {
      max-width: 850px;
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
          float: left;
          word-break: break-all;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .msg_val {
          flex: 1;
          padding-left: 16px;
          word-break: break-all;
        }
        .introduction {
          align-items: flex-start;
        }
      }
    }
  }
</style>
