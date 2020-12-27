<template>
  <div class="attention_wrap">
    <div class="title">
      {{prefix}}的粉丝
    </div>
    <div class="attention_list">
      <el-row class="attention_item" v-for="(item, index) in attentionList" :key="item.id">
        <el-col :xs="5" :sm="3" :md="2" :lg="2" class="avatar">
          <router-link :to="`/uc/${item.id}`" target="_blank">
            <img :src="item.avatar || './static/img/photo.jpg'" alt="">
          </router-link>
        </el-col>
        <el-col :xs="13" :sm="17" :md="20" :lg="20" class="name_sign">
          <router-link :to="`/uc/${item.id}`" target="_blank" class="name">
            {{item.nickname || item.username}}
          </router-link>
          <router-link :to="`/uc/${item.id}`" target="_blank" class="sign">
            {{item.sign || '这个人很懒，什么都没写上'}}
          </router-link>
        </el-col>
        <el-col :xs="6" :sm="4" :md="2" :lg="2" class="attention">
          <div v-if="visit_id==item.id" class="btn at_btn">自己</div>
          <div v-else-if="item.is_attention" class="btn" :class="{'no_atte': false}" @click="handleCancelAttention(index)">取消关注</div>
          <div v-else class="btn at_btn" :class="{'no_atte': false}" @click="handleAttention(index)">关注TA</div>
        </el-col>
      </el-row>
      <div class="pagination" v-if="total > paginationData.limit">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="paginationData.page"
          :page-size="paginationData.limit"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { fetchFans } from '@/api/userCenter'
import { cancelAttention, attention } from '@/api/user'
import { getUserInfo } from '@/utils'

export default {
  data () {
    return {
      attentionList: [],
      visit_id: undefined,
      prefix: '我',
      total: 0,
      paginationData: {
        limit: 10,
        page: 1
      }
    }
  },
  mounted () {
    this.visit_id = getUserInfo().id || 0
    this.getFansList()
    if (Number(this.visit_id) !== Number(this.$route.params.id)) this.prefix = 'Ta'
  },
  methods: {
    // 获取粉丝列表
    async getFansList () {
      const data = Object.assign({}, this.paginationData)
      data.id = this.$route.params.id
      data.visit_id = this.visit_id
      let res = await fetchFans(data)
      this.attentionList = res.data.items
      this.total = res.data.total
    },

    // 取消关注
    async handleCancelAttention (index) {
      if (!this.checkLogin()) return
      await cancelAttention({active_id: this.visit_id, passive_id: this.attentionList[index].id})
      this.$message({
        message: '取消关注',
        type: 'success'
      })
      this.attentionList[index].is_attention = false
    },

    // 关注
    async handleAttention (index) {
      if (!this.checkLogin()) return
      await attention({active_id: this.visit_id, passive_id: this.attentionList[index].id, time: moment().format('YYYY-MM-DD HH:mm:ss')})
      this.$message({
        message: '关注成功！',
        type: 'success'
      })
      this.attentionList[index].is_attention = true
    },

    // 检查登录
    checkLogin () {
      if (Number(this.visit_id) === 0) {
        this.$message({
          message: '请登录后操作！',
          type: 'error'
        })
        return false
      }
      return true
    },

    handleCurrentChange (page) {
      this.paginationData.page = page
      this.getFansList()
    }

  }
}
</script>

<style lang="scss" scoped>
  .attention_wrap {
    padding: 24px;
    .title {
      font-size: 16px;
      color: #222226;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .attention_list {
      .attention_item {
        // margin-top: 15px;
        height: 82px;
        border-top: 1px solid #e0e0e0;
        .avatar {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            height: 50px;
            width: 50px;
            border-radius: 50%;
          }
        }
        .name_sign {
          height: 100%;
          padding: 10px 20px 10px 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          a {
            color: #4D4D4D;
            &:hover {
              color: #409EFF;
            }
          }
          .name {
            font-size: 16px;
            font-weight: bold;
          }
          .sign {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .attention {
          height: 100%;
          color: #999999;
          display: flex;
          justify-content: center;
          align-items: center;
          .btn {
            width: 90px;
            height: 32px;
            border-radius: 16px;
            border: 1px solid #999999;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover {
              color: #409EFF;
              cursor: pointer;
              border: 1px solid #409EFF;
              background: rgba(64,158,255, 0.1);
            }
          }
          .at_btn {
            background: #409EFF;
            color: #fff;
            border: 1px solid #409EFF;
            &:hover {
              opacity: 0.8;
              background: #409EFF;
              color: #fff;
            }
          }
          .no_atte {
            border: 1px solid #409EFF;
            color: #409EFF;
          }
        }
      }

      .pagination {
        .el-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 15px;
        }
      }

    }
  }
</style>
