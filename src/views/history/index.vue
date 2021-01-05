<template>
  <div class="collection_wrap">
    <div class="title">
      历史记录
    </div>
    <div class="history_list" v-if="historyList.length">
      <div class="history_item" v-for="item in historyList" :key="item.id">
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
            {{item.history_time | fromNow}}
          </div>
        </div>
        <el-row class="post_info">
          <el-col :span="20" class="info_left">
            <div class="post_title">
              <router-link :to="`/post/${item.id}`" target="_blank">{{item.title}}</router-link>
            </div>
            <div class="post_content">
              {{item.content | delTag}}
            </div>
          </el-col>
          <el-col :span="4" class="info_right">
            <el-row :gutter="12">
              <el-col :sm="12" :md="12" :lg="12" :xl="12" class="read_num">
                <router-link :to="`/post/${item.id}`" target="_blank"><i class="el-icon-view"></i>{{item.read_times}}</router-link>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="12" class="comment_num">
                <router-link :to="`/post/${item.id}`" target="_blank"><i class="el-icon-chat-dot-round"></i>{{item.comment_times}}</router-link>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
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
    <div class="no-data" v-else>
      <img :src="'./static/img/no-data.png'" alt="">
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { fetchHistory } from '@/api/userCenter'
import { delHtmlTag } from '@/utils'
moment.locale('zh-cn')

export default {
  data () {
    return {
      historyList: [],
      total: 0,
      paginationData: {
        limit: 5,
        page: 1
      }
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
    this.getHistoryList()
  },
  methods: {
    // 获取历史列表
    async getHistoryList () {
      const data = Object.assign({}, this.paginationData)
      data.id = this.$route.params.id
      let res = await fetchHistory(data)
      this.historyList = res.data.items
      this.total = res.data.total
    },

    handleCurrentChange (page) {
      this.paginationData.page = page
      this.getHistoryList()
    }

  }
}
</script>

<style lang="scss" scoped>
  .collection_wrap {
    padding: 24px;
    .title {
      font-size: 16px;
      color: #222226;
      font-weight: bold;
    }
    .history_list {
      .history_item {
        margin-top: 15px;
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

      .pagination {
        .el-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 15px;
        }
      }

    }
    .no-data {
      display: flex;
      justify-content: center;
      img {
        width: 30%;
      }
    }
  }
</style>
