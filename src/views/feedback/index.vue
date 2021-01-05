<template>
  <div class="feedback_wrap">
    <div class="title">
      意见反馈
    </div>
    <div class="input_wrap">
      <el-input
        ref=""
        v-model="content"
        placeholder="请输入要反馈的内容"
        type="textarea"
        rows="10"
        maxlength="300"
        show-word-limit
      ></el-input>
    </div>
    <div class="submit_feedback">
      <el-button type="primary" size="small" @click="handleFeedback">提交反馈</el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { feedback } from '@/api/user'

export default {
  data () {
    return {
      content: ''
    }
  },
  methods: {
    async handleFeedback () {
      if (this.content.trim() === '') {
        this.$message({
          message: '请输入反馈内容',
          type: 'error'
        })
        return
      }
      await feedback({
        user_id: this.$route.params.id,
        content: this.content,
        time: moment().format('YYYY-MM-DD HH:mm:ss')
      })

      this.$message({
        message: '反馈成功',
        type: 'success'
      })
      this.content = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .feedback_wrap {
    padding: 24px;
    .title {
      font-size: 16px;
      color: #222226;
      font-weight: bold;
    }
    .input_wrap {
      margin-top: 15px;
    }
    .submit_feedback {
      display: flex;
      justify-content: flex-end;
      padding-top: 20px;
    }
  }
</style>
