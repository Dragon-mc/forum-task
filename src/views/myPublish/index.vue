<template>
  <div class="my_publish_wrap">
    <div class="title">
      {{prefix}}发布的
    </div>
    <div class="collection_list" v-if="postList.length">
      <div class="collection_item" v-for="(item, index) in postList" :key="item.id">
        <el-row class="time_and_interactive">
          <el-col :span="20" class="time">
            发布于：{{item.time | fromNow}}
          </el-col>
          <el-col :span="4" class="info_right">
            <el-row :gutter="12">
              <el-col :sm="12" :md="12" :lg="12" :xl="12" class="read_num">
                <a href="javascript:;"><i class="el-icon-view"></i>{{item.read_times}}</a>
              </el-col>
              <el-col :sm="12" :md="12" :lg="12" :xl="12" class="comment_num">
                <a href="javascript:;"><i class="el-icon-chat-dot-round"></i>{{item.comment_times}}</a>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="post_info">
          <el-col :span="22" class="info_left">
            <div class="post_title">
              <router-link :to="`/post/${item.id}`" target="_blank">{{item.title}}</router-link>
            </div>
            <div class="post_content">
              {{item.content | delTag}}
            </div>
          </el-col>
          <el-col :span="2" class="edit" v-if="self">
            <i class="el-icon-edit-outline" @click="handleEdit(item)"></i>
            <el-popconfirm
              icon="el-icon-info"
              icon-color="red"
              title="你确定删除这篇帖子吗？"
              @confirm="handleDelete(item, index)"
            >
              <div slot="reference">
                <i class="el-icon-delete"></i>
              </div>
            </el-popconfirm>
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
import { fetchPublish } from '@/api/userCenter'
import { deletePost } from '@/api/post'
import { getUserInfo, delHtmlTag } from '@/utils'
moment.locale('zh-cn')

export default {
  data () {
    return {
      postList: [],
      prefix: '我',
      self: false,
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
    this.getPublishList()
    if (Number(getUserInfo().id) !== Number(this.$route.params.id)) this.prefix = 'Ta'
    else this.self = true
  },
  methods: {
    // 获取发布列表
    async getPublishList () {
      const data = Object.assign({}, this.paginationData)
      data.id = this.$route.params.id
      let res = await fetchPublish(data)
      this.postList = res.data.items
      this.total = res.data.total
    },

    // 编辑帖子
    handleEdit (item) {
      this.$router.push({
        name: 'editor',
        params: {
          item: item
        }
      })
    },

    // 删除帖子
    async handleDelete (item, index) {
      await deletePost({ post_id: item.id })
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.postList.splice(index, 1)
    },

    handleCurrentChange (page) {
      this.paginationData.page = page
      this.getPublishList()
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
              margin-bottom: 8px;
              a {
                display: inline-block;
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

          .edit {
            height: 54px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            i {
              font-size: 20px;
              cursor: pointer;
              &:hover {
                color: #409EFF;
              }
            }
            .el-icon-delete {
              &:hover {
                color: #fc5531;
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
