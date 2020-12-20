<template>
  <div class="my_publish_wrap">
    <div class="title">
      {{prefix}}发布的
    </div>
    <div class="collection_list">
      <div class="collection_item" v-for="item in postList" :key="item.id">
        <el-row class="time_and_interactive">
          <el-col :span="20" class="time">
            发布于：{{item.time | fromNow}}
          </el-col>
          <el-col :span="4" class="info_right">
            <el-row :gutter="12">
              <el-col :sm="12" :md="12" :lg="12" class="read_num">
                <a href="javascript:;"><i class="el-icon-view"></i>{{item.read_times}}</a>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" class="comment_num">
                <a href="javascript:;"><i class="el-icon-chat-dot-round"></i>{{item.comment_times}}</a>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="post_info">
          <el-col :span="24" class="info_left">
            <div class="post_title">
              <router-link :to="`/post/${item.id}`" target="_blank">{{item.title}}</router-link>
            </div>
            <div class="post_content">
              {{item.content}}
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('zh-cn')
import { fetchPublish } from '@/api/userCenter'
import { getUserInfo } from '@/utils'

export default {
  data () {
    return {
      postList: [],
      prefix: '我'
    }
  },
  filters: {
    fromNow (time) {
      return moment(time).fromNow()
    }
  },
  mounted () {
    this.getPublishList()
    if (JSON.parse(getUserInfo()).id != this.$route.params.id)
      this.prefix = 'Ta'
  },
  methods: {
    // 获取发布列表
    async getPublishList () {
      let res = await fetchPublish({id: this.$route.params.id})
      this.postList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
  .my_publish_wrap {
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
        .time_and_interactive {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          .time {
            width: 100%;
          }
          .info_right {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
            align-items: flex-end;
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
          
        }
      }
    }
  }
</style>