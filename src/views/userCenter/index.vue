<template>
  <div class="user_center_wrap">
    <com-header :index="2"></com-header>
    <div class="info_card">
      <div class="inner my-container">
        <div class="user_avatar">
          <img :src="userInfo.avatar || '/static/img/photo.jpg'" alt="avatar">
          <p v-if="self" class="modify_img" @click="handleUploadAvatar">上传头像</p>
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

    <el-dialog
      title="上传头像"
      :visible.sync="dialogVisible"
      width="500px"
      @open="handleDialogOpen"
      @close="handleDialogOpen"
      >
      <el-upload
        class="upload-wrap"
        ref="upload"
        :drag="!showUpload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :auto-upload="false"
        :file-list="fileList"
        list-type="picture"
        :limit="1"
        :on-change="handleChange"
        :on-remove="() => showUpload = false"
        :http-request="handleRequestUpload"
        >
        <div v-show="!showUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div>
        <div v-show="!showUpload" class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button style="margin-left: 10px;" size="small" type="primary" @click="$refs.upload.submit()" v-show="showUpload">上传并保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import comHeader from '@/components/comHeader'
import comFooter from '@/components/comFooter'
import { getUserCenterInfo, uploadAvatar, modifyAvatar } from '@/api/userCenter'
import { getUserInfo } from '@/utils'

export default {
  data () {
    return {
      userInfo: {},
      nowUserId: undefined,
      prefix: '我',
      self: false,
      dialogVisible: false,
      // 上传的文件列表
      fileList: [],
      // 上传并保存 的 显示
      showUpload: false
    }
  },
  methods: {
    // 点击上传头像
    handleUploadAvatar () {
      this.dialogVisible = true
    },

    handleChange (file, fileList) {
      if (file.status == 'ready') {
        // 选择了文件
        let fileInfo = file.raw
        // 判断图片大小是否小于2M
        if (fileInfo.size / 1024 / 1024 > 2) {
          this.$alert('上传图片大小不能超过 2MB!', '提示', { type: 'error' })
          this.fileList = []
          this.$refs.upload.uploadFiles = []
          return
        } else if (fileInfo.type.indexOf('image') == -1) {
          // 判断选择的是否为图片
          this.$alert('请选择图片资源!', '提示', { type: 'error' })
          this.fileList = []
          this.$refs.upload.uploadFiles = []
          return
        }

        function checkImg (url) {
          return new Promise((resolve, reject) => {
            let img = new Image()
            img.src = url
            img.onload = () => {
              if (img.width < 150 || img.height < 150) {
                reject()
              } else {
                resolve()
              }
            }
          })
        }
        // 检查文件大小
        checkImg(file.url)
        .then(() => {
          this.showUpload = true
        })
        .catch(() => {
          this.$alert('图片宽度*高度至少为150*150像素!', '提示', { type: 'error' })
          this.fileList = []
          this.$refs.upload.uploadFiles = []
        })

      }
    },

    // 头像上传对话框打开
    handleDialogOpen () {
      // 清空图片上传中所有的数据
      this.fileList = []
      if (this.$refs.upload)
        this.$refs.upload.uploadFiles = []
      this.showUpload = false
    },

    // 将头像上传至服务器并修改用户头像
    async handleRequestUpload (param) {
      let fileUrl = this.$refs.upload.uploadFiles[0].url
      const file = param.file
      
      const forms = new FormData()
      forms.append('file', file)
      forms.append('user_id', this.userInfo.id)
      // 发送请求，上传用户头像
      let res
      try {
        res = await uploadAvatar(forms)
      } catch (e) {
        // 头像修改失败，将上传框关闭显示
        this.dialogVisible = false
        return
      }

      // 请求并返回成功数据后...
      let url = res.data.url
      console.log(url);
      let myUserInfo = JSON.parse(getUserInfo())
      myUserInfo.avatar = url
      // 修改cookies中用户的头像
      Cookies.set('forum-user', myUserInfo)
      // 修改当前页面用户的头像
      this.userInfo.avatar = url
      this.dialogVisible = false
      this.$message({
        message: '修改头像成功',
        type: 'success'
      })
      
    }
  },
  async mounted () {
    // this.userInfo = JSON.parse(getUserInfo())
    // 获取路由中的id，保存为当前查看用户的id
    this.nowUserId = this.$route.params.id
    let res = await getUserCenterInfo({id: this.nowUserId})
    this.userInfo = res.data
    if (this.nowUserId != JSON.parse(getUserInfo()).id)
      this.prefix = 'Ta'
    else
      this.self = true
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
          margin: 0 40px;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 50%;
          }
          .modify_img {
            color: #fff;
            font-size: 12px;
            text-align: center;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 80px;
            height: 24px;
            line-height: 24px;
            background: rgba(0,0,0,.8);
            opacity: 0;
            transition-duration: 0.2s;
          }
          &:hover {
            cursor: pointer;
            .modify_img {
              opacity: 1;
            }
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

    .upload-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

  }
</style>