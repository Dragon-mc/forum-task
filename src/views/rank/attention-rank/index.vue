<template>
  <div class="attention_rank_wrap">
    <div class="attention_list">
      <div class="attention_item" v-for="(item, index) in attentionRankList" :key="item.passive_id">
        <div class="user_info">
          <div class="number">{{index + 1}}</div>
          <div class="avatar">
            <router-link :to="`/uc/${item.passive_id}`" target="_blank"><img :src="item.avatar || './static/img/photo.jpg'" alt=""></router-link>
          </div>
          <div class="info_wrap">
            <div class="name"><router-link :to="`/uc/${item.passive_id}`" target="_blank">{{item.nickname || item.username}}</router-link></div>
            <div class="fans">粉丝&nbsp;{{item.fans_num}}</div>
          </div>
        </div>
        <div class="attention_btn">
          <div class="self" v-if="item.passive_id==visit_id">自己</div>
          <div class="btn" v-else-if="!item.is_attention" @click="handleAttention(item)">关注</div>
          <div class="cancel_btn" v-else @click="handleAttention(item)">取消关注</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { fetchAttentionRank } from '@/api/index'
import { attention, cancelAttention } from '@/api/user'
import { getUserInfo } from '@/utils'

export default {
  data () {
    return {
      attentionRankList: [],
      visit_id: 0,
      requestData: {
        limit: 20,
        skip: 0
      },
      hasMore: true
    }
  },
  mounted () {
    this.visit_id = getUserInfo().id || 0
    this.getAttentionRankList()
    this.scrollFunction = this.scroll.bind(this)
    document.addEventListener('scroll', this.scrollFunction)
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.scrollFunction)
  },
  methods: {
    async getAttentionRankList () {
      if (this.requestData.skip >= 80) return
      const data = Object.assign({}, this.requestData)
      data.visit_id = this.visit_id
      let res = await fetchAttentionRank(data)
      if (res.data.length === 0) {
        this.hasMore = false
        return
      }
      this.attentionRankList = [...this.attentionRankList, ...res.data]
    },

    // 处理关注和取消关注
    async handleAttention (item) {
      // 检查是否登录
      if (Number(this.visit_id) === 0) {
        this.$message({
          message: '请登录后操作',
          type: 'error'
        })
        return
      }
      let message = ''
      if (item.is_attention) {
        // 取消关注
        await cancelAttention({
          active_id: this.visit_id,
          passive_id: item.passive_id
        })
        message = '取消关注'
      } else {
        // 关注
        await attention({
          active_id: this.visit_id,
          passive_id: item.passive_id,
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        message = '关注成功'
      }
      item.is_attention = !item.is_attention
      this.$message({
        message,
        type: 'success'
      })
    },

    scroll () {
      // 只有当页面时主页时，才检测滚动刷新
      if (this.$route.path !== '/rank/attention_rank') return
      // 页面滚动高度
      let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // 窗口显示区高度
      let windowHeight = window.innerHeight
      // 页面总高度
      let pageHeight = document.body.scrollHeight || document.documentElement.scrollHeight

      if (scroll + windowHeight >= pageHeight) {
        // 页面触底，加载数据
        if (this.hasMore) {
          this.requestData.skip += this.requestData.limit
          this.getAttentionRankList()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .attention_rank_wrap {
    padding: 24px;
    .attention_list {
      .attention_item {
        display: flex;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px solid #e9e9e9;
        &:last-child {
          border: none;
        }
        &:nth-child(-n+3) {
          .number {
            color: #fc5531;
          }
        }
        .user_info {
          display: flex;
          .number {
            padding-right: 40px;
            font-size: 28px;
            font-weight: bold;
            display: flex;
            align-items: center;
          }
          .avatar {
            img {
              width: 55px;
              height: 55px;
              object-fit: cover;
              border-radius: 50%;
              border: 1px solid #ededed;
            }
          }
          .info_wrap {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding-left: 20px;
            .name {
              color: #1C1D30;
              font-size: 16px;
            }
            .fans {
              color: #777888;
            }
          }
        }
        .attention_btn {
          display: flex;
          align-items: center;
          div {
            width: 75px;
            height: 24px;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
          .self {
            background: #409EFF;
            color: #fff;
          }
          .btn {
            border: 1px solid #409EFF;
            color: #409EFF;
            &:hover {
              background: #409EFF;
              color: #fff;
            }
          }
          .cancel_btn {
            border: 1px solid #555666;
            color: #555666;
            &:hover {
              opacity: 0.6;
            }
          }
        }
      }
    }
  }
</style>
