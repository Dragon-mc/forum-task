<template>
  <div class="browse_rank_wrap">
    <div class="rank_list">
      <div class="rank_item" v-for="(item, index) in browseRankList" :key="item.post_id">
        <div class="number">
          {{index + 1}}
        </div>
        <div class="info">
          <div class="title">
            <router-link :to="`/post/${item.post_id}`" target="_blank">{{item.title}}</router-link>
          </div>
          <div class="detail">
            <div class="read_times">
              <i class="el-icon-view"></i>{{item.read_times}}
            </div>
            <div class="user_info">
              <router-link :to="`/uc/${item.user_id}`" target="_blank">
                <div class="avatar">
                  <img :src="item.avatar || './static/img/photo.jpg'" alt="">
                </div>
                <div class="name">{{item.nickname || item.username}}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchBrowseRank } from '@/api/index'

export default {
  data () {
    return {
      browseRankList: [],
      requestData: {
        limit: 20,
        skip: 0
      },
      hasMore: true
    }
  },
  mounted () {
    this.getBrowseRankList()
    this.scrollFunction = this.scroll.bind(this)
    document.addEventListener('scroll', this.scrollFunction)
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.scrollFunction)
  },
  methods: {
    // 获取浏览排行列表
    async getBrowseRankList () {
      if (this.requestData.skip >= 80) return
      let res = await fetchBrowseRank(this.requestData)
      if (res.data.length === 0) {
        this.hasMore = false
        return
      }
      this.browseRankList = [...this.browseRankList, ...res.data]
    },

    scroll () {
      // 只有当页面时主页时，才检测滚动刷新
      if (this.$route.path !== '/rank/browse_rank') return
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
          this.getBrowseRankList()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .browse_rank_wrap {
    padding: 24px;
    .rank_list {
      .rank_item {
        display: flex;
        border-bottom: 1px solid #e9e9e9;
        padding: 24px 0;
        &:last-child {
          border: none;
        }
        &:nth-child(-n+3) {
          .number {
            color: #fc5531;
          }
        }
        .number {
          padding-right: 40px;
          font-size: 28px;
          font-weight: bold;
        }
        .info {
          display: flex;
          flex-direction: column;
          width: calc(100% - 52px);
          .title {
            a {
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 16px;
              font-weight: bold;
              color: #222226;
              line-height: 32px;
              &:hover {
                color: #409EFF;
              }
            }
          }
          .detail {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            .read_times {
              display: flex;
              justify-content: center;
              align-items: center;
              i {
                margin-right: 8px;
                font-size: 20px;
              }
            }
            .user_info {
              a {
                display: flex;
                align-items: center;
                &:hover {
                  color: #409EFF;
                }
              }
              .avatar {
                img {
                  width: 30px;
                  height: 30px;
                  object-fit: cover;
                  border-radius: 50%;
                  border: 1px solid #ededed;
                }
              }
              .name {
                padding-left: 10px;
              }
            }
          }
        }
      }
    }
  }
</style>
