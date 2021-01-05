<template>
  <div class="editor_wrap">
    <div class="top_wrap">
      <div class="return_btn" @click="handleReturnClick">
        <div class="left-arrow"></div>返回
      </div>
      <div class="input_title">
        <el-input v-model="title" placeholder="请输入文章标题" maxlength="100" show-word-limit></el-input>
      </div>
      <div class="cascader">
        <el-cascader
          v-model="subId"
          :options="categoryOptions"
          :props="propsOption"
          placeholder="选择分类"
          filterable
          clearable
        >
        </el-cascader>
      </div>
      <div class="func_btn">
        <template v-if="!edit||postStatus==0">
          <el-button class="save_btn" @click="handleSaveDraft">保存草稿</el-button>
          <el-button class="publish_btn" @click="handlePublish">发布帖子</el-button>
        </template>
        <template v-else>
          <el-button class="publish_btn" @click="handleSaveEdit">保存编辑</el-button>
        </template>
      </div>
      <div class="user_avatar">
        <img :src="userInfo.avatar || './static/img/photo.jpg'" alt="">
      </div>
    </div>
    <editor
      id="tinymce"
      v-model="content"
      :init="editorInit"
      :key="tinymceFlag"
    ></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import moment from 'moment'
import { uploadImg, postPublish, postEdit } from '@/api/post'
import { fetchCategory } from '@/api/category'
import { getUserInfo } from '@/utils'

import 'tinymce/themes/silver'
import 'tinymce/icons/default/icons'
// tinymce插件引入
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/template'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/help'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/autosave'
// import 'tinymce/plugins/bdmap'
// import 'tinymce/plugins/indent2em'
import 'tinymce/plugins/autoresize'
// import 'tinymce/plugins/lineheight'
// import 'tinymce/plugins/formatpainter'
// import 'tinymce/plugins/axupimgs'

export default {
  data () {
    return {
      title: '',
      content: '',
      subId: undefined,
      edit: false,
      postStatus: undefined,
      userInfo: {},
      propsOption: {
        expandTrigger: 'hover',
        value: 'id',
        label: 'name',
        children: 'sub_cate'
      },
      // 分类选择数组
      categoryOptions: [],
      editorInit: {
        language_url: process.env.VUE_APP_PUBLIC_PATH + 'static/tinymce/zh_CN.js', // 指定中文包
        language: 'zh_CN', // 中文
        skin_url: process.env.VUE_APP_PUBLIC_PATH + 'static/tinymce/skins/ui/oxide', // 编辑器皮肤
        emoticons_database_url: process.env.VUE_APP_PUBLIC_PATH + 'static/tinymce/emojis.js',
        browser_spellcheck: true, // 拼写检查
        branding: false, // 去水印
        elementpath: true, // 禁用编辑器底部的状态栏
        statusbar: true, // 隐藏编辑器底部的状态栏
        paste_data_images: true, // 允许粘贴图像
        menubar: true, // 隐藏最上方menu
        plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave', // bdmap indent2em autoresize lineheight formatpainter axupimgs
        toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | table image media charmap emoticons codesample hr pagebreak insertdatetime print preview | fullscreen ', // | bdmap indent2em lineheight formatpainter axupimgs
        // 编辑器高度
        height: 400,
        // min_height: 500,
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif',
        importcss_append: true,
        autosave_ask_before_unload: false,
        // 初始化结束
        init_instance_callback: () => {
          this.mce = document.querySelector('.tox-tinymce')
          let height = window.innerHeight
          this.mce.style.setProperty('height', height - 55 + 'px', 'important')
        },
        // 自定义图片上传回调
        images_upload_handler: (blobInfo, succFun, failFun) => {
          const file = blobInfo.blob()
          // 检查图片是否小于5MB
          if (file.size / 1024 / 1024 > 5) {
            this.$alert('上传图片大小不能超过 2MB!', '提示', { type: 'error' })
            return
          }
          // 上传图片
          const formData = new FormData()
          formData.append('file', file)
          this.uploadImage(formData).then(res => {
            succFun(res.data.url)
          }).catch(error => {
            failFun(error)
          })
        }
      },
      tinymceFlag: 1
    }
  },
  mounted () {
    tinymce.init({})
    window.onresize = () => {
      let height = window.innerHeight
      this.mce.style.setProperty('height', height - 55 + 'px', 'important')
    }
    this.userInfo = getUserInfo()
    this.getCategoryOptions()
    // 如果是编辑则将编辑数据赋值到当前页面中
    if (this.$route.params.item) {
      let item = this.$route.params.item
      this.edit = true
      this.title = item.title
      this.content = item.content
      this.post_id = item.id
      this.postStatus = item.status
      // 如果分类列表暂时还未获取到
      if (!this.categoryOptions.length) {
        this.categoryReady = category => {
          category.forEach((v, i) => v.sub_cate.forEach(v1 => {
            // 查找到分类id后返回
            if (Number(item.sub_id) === Number(v1.id)) {
              this.subId = [category[i].id, v1.id]
              return false
            }
          }))
        }
      }
    }
  },
  methods: {
    // 点击返回按钮
    handleReturnClick () {
      // 返回到上一个页面
      this.$router.go(-1)
    },

    // 获取分类选项
    async getCategoryOptions () {
      let res = await fetchCategory()
      this.categoryOptions = res.data
      if (this.categoryReady) this.categoryReady(res.data)
    },

    // 上传图片
    uploadImage (formData) {
      return uploadImg(formData)
    },

    // 保存草稿
    async handleSaveDraft () {
      let { content, title, subId } = this

      if (Number(this.postStatus) === 0) {
        // 当前是从 待发布页面进入 对帖子进行编辑，修改帖子内容即可
        await postEdit({
          title,
          content,
          sub_id: subId ? subId[1] : 0,
          id: this.post_id,
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
      } else {
        // 直接从发布帖子进入的页面，则直接添加新记录
        await postPublish({
          title,
          content,
          user_id: this.userInfo.id,
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
          sub_id: subId ? subId[1] : 0,
          status: 0
        })
      }
      this.$message({
        message: '保存草稿成功',
        type: 'success'
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    },

    // 发布
    async handlePublish () {
      let { content, title, subId } = this
      // 检查数据
      if (!this.checkValid()) return

      if (Number(this.postStatus) === 0) {
        // 当前是从 待发布页面进入 对帖子进行编辑，修改帖子内容即可
        await postEdit({
          title,
          content,
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
          sub_id: subId[1],
          status: 1,
          id: this.post_id
        })
      } else {
        // 直接从发布帖子进入的页面，则直接添加新记录
        await postPublish({
          title,
          content,
          user_id: this.userInfo.id,
          time: moment().format('YYYY-MM-DD HH:mm:ss'),
          sub_id: subId[1],
          status: 1
        })
      }
      this.$message({
        message: '发布成功',
        type: 'success'
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    },

    // 保存编辑
    async handleSaveEdit () {
      let { content, title, subId } = this
      // 检查数据
      if (!this.checkValid()) return
      await postEdit({
        title,
        content,
        sub_id: subId[1],
        id: this.post_id
      })
      this.$message({
        message: '编辑成功',
        type: 'success'
      })
      setTimeout(() => {
        this.$router.go(-1)
      }, 500)
    },

    // 检查数据
    checkValid () {
      let { content, title, subId } = this
      // 判断标题和内容是否为空
      if (title.trim() === '') {
        this.$message({message: '标题不能为空！', type: 'error'})
        return false
      } else if (content.trim() === '') {
        this.$message({message: '帖子内容不能为空！', type: 'error'})
        return false
      } else if (!subId) {
        this.$message({message: '请选择帖子分类！', type: 'error'})
        return false
      }
      return true
    }
  },
  components: {
    Editor
  }
}
</script>

<style lang="scss" scoped>
  .editor_wrap {
    .top_wrap {
      height: 55px;
      display: flex;
      background: #f3f3f3;
      .return_btn {
        width: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #666;
        &:hover {
          cursor: pointer;
        }
        .left-arrow {
          width: 10px;
          height: 10px;
          border: 2px solid #666;
          transform: rotate(45deg);
          border-right: none;
          border-top: none;
          margin-right: 5px;
        }
      }
      .input_title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .cascader {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 30px;
      }
      .func_btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 30px;
        .save_btn {

        }
        .publish_btn {
          background: linear-gradient(45deg,#C9AFFF,#409EFF);
          color: #fff;
          &:hover {
            opacity: 0.9;
          }
        }
      }
      .user_avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 40px;
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
      }
    }
  }
</style>
