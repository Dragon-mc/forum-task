<template>
  <div class="collection_wrap">
    <div class="title">
      历史记录
    </div>
    <div class="collection_list">
      <div class="collection_item" v-for="item in historyList" :key="item.id">
        <div class="user_info">
          <div class="user_avatar">
            <router-link :to="`/uc/${item.user_id}`" target="_blank">
              <img :src="item.avatar || '/static/img/photo.jpg'" alt="">
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
              {{item.content}}
            </div>
          </el-col>
          <el-col :span="4" class="info_right">
            <el-row :gutter="12">
              <el-col :sm="12" :md="12" :lg="12" class="read_num">
                <router-link :to="`/post/${item.id}`" target="_blank"><i class="el-icon-view"></i>{{item.read_times}}</router-link>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" class="comment_num">
                <router-link :to="`/post/${item.id}`" target="_blank"><i class="el-icon-view"></i>{{item.comment_times}}</router-link>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import { fetchHistory } from '@/api/userCenter'

export default {
  data () {
    return {
      historyList: []
    }
  },
  filters: {
    fromNow (time) {
      return moment(time).fromNow()
    }
  },
  mounted () {
    this.getHistoryList()
  },
  methods: {
    // 获取历史列表
    async getHistoryList () {
      let res = await fetchHistory({id: this.$route.params.id})
      this.historyList = res.data
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
    .collection_list {
      .collection_item {
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
            // flex: 1;
            img {
              width: 30px;
              height: 30px;
              object-fit: cover;
              border-radius: 50%;
            }
          }
          .user_name {
            // flex: 8;
            font-weight: bold;
            padding-left: 20px;
          }
          .collection_time {
            // flex: 2;
            width: 100%;
            text-align: right;
          }
        }
        .post_info {
          // display: flex;
          .info_left {
            // flex: 9;
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
              // margin-right: 12px;
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