<template>
  <div class="comment_rank_wrap">
    <div class="comment_rank_list">
      <div class="for-item" v-for="(item, index) in commentRankList" :key="item.post_id">
        <div class="number">
          {{index + 1}}
        </div>
        <div class="comment_rank_item">
          <div class="user_info">
            <div class="user_avatar">
              <router-link :to="`/uc/${item.user_id}`" target="_blank">
                <img :src="item.avatar || './static/img/photo.jpg'" alt="">
              </router-link>
            </div>
            <div class="user_name">
              <router-link :to="`/uc/${item.user_id}`" target="_blank"><span>{{item.nickname || item.username}}</span></router-link>
            </div>
            <div class="collection_time">
              {{item.time | fromNow}}
            </div>
          </div>
          <el-row class="post_info">
            <el-col :span="20" class="info_left">
              <div class="post_title">
                <router-link :to="`/post/${item.post_id}`" target="_blank">{{item.title}}</router-link>
              </div>
              <div class="post_content">
                {{item.content | delTag}}
              </div>
            </el-col>
            <el-col :span="4" class="info_right">
              <el-row :gutter="12">
                <el-col :sm="12" :md="12" :lg="12" :xl="12" class="read_num">
                  <router-link :to="`/post/${item.post_id}`" target="_blank"><i class="el-icon-view"></i>{{item.read_times}}</router-link>
                </el-col>
                <el-col :sm="12" :md="12" :lg="12" :xl="12" class="comment_num">
                  <router-link :to="`/post/${item.post_id}`" target="_blank"><i class="el-icon-chat-dot-round"></i>{{item.commented_times}}</router-link>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
import { fetchCommentRank } from '@/api/index'
import { delHtmlTag } from '@/utils'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  data () {
    return {
      commentRankList: [],
      requestData: {
        limit: 20,
        skip: 0
      },
      hasMore: true
    }
  },
  filters: {
    fromNow (time) {
      return moment(time).fromNow()
    },
    delTag (val) {
      return delHtmlTag(val)
    }
  },
  mounted () {
    this.getCommentRankList()
    this.scrollFunction = this.scroll.bind(this)
    document.addEventListener('scroll', this.scrollFunction)
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.scrollFunction)
  },
  methods: {
    async getCommentRankList () {
      if (this.requestData.skip >= 80) return
      let res = await fetchCommentRank(this.requestData)
      if (res.data.length === 0) {
        this.hasMore = false
        return
      }
      this.commentRankList = [...this.commentRankList, ...res.data]
    },

    scroll () {
      // 只有当页面时主页时，才检测滚动刷新
      if (this.$route.path !== '/rank/comment_rank') return
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
          this.getCommentRankList()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .comment_rank_wrap {
    padding: 24px;
    .comment_rank_list {
      .for-item {
        display: flex;
        margin-top: 15px;
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
      }
      .comment_rank_item {
        width: calc(100% - 56px);
        padding: 18px;
        border: 1px solid #ededed;
        border-radius: 10px;
        &:hover {
          box-shadow: 0 2px 5px 0 rgba(0,0,0,.1);
        }
        .user_info {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          .user_avatar {
            img {
              width: 30px;
              height: 30px;
              object-fit: cover;
              border-radius: 50%;
            }
          }
          .user_name {
            width: 100%;
            font-weight: bold;
            padding-left: 20px;
          }
          .collection_time {
            width: 100%;
            text-align: right;
          }
        }
        .post_info {
          .info_left {
            .post_title {
              margin-bottom: 10px;
              a {
                font-size: 18px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-weight: bold;
                &:link {
                  color: #3d3d3d;
                }
                &:visited {
                  color: #b8b8b8;
                }
                &:hover {
                  color: #409EFF;
                }
              }
            }
            .post_content {
              color: #8a8a8a;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .info_right {
            height: 53px;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            align-items: flex-end;
            .read_num {
            }
            .comment_num {

            }
            i {
              font-size: 18px;
              margin-right: 3px;
              font-weight: bold;
              color: #6b6b6b;
            }
            a {
              display: flex;
              justify-content: flex-end;
              align-items: flex-end;
              &:hover {
                color: #409EFF;
              }
            }
          }
        }
      }
    }
  }
</style>
