<template>
  <div class="collection_wrap">
    <div class="title">
      {{prefix}}的收藏
    </div>
    <div class="collection_list">
      <div class="collection_item" v-for="item in collectionList" :key="item.id">
        <el-row>
          <el-col :xs="21" :sm="21" :md="22" :lg="23" class="info_wrap">
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
                {{item.time | fromNow}}
              </div>
            </div>
            <el-row class="post_info" :gutter="12">
              <el-col :xs="19" :sm="19" :md="20" :lg="20" class="info_left">
                <div class="post_title">
                  <router-link :to="`/post/${item.id}`" target="_blank">{{item.title}}</router-link>
                </div>
                <div class="post_content">
                  {{item.content}}
                </div>
              </el-col>
              <el-col :xs="5" :sm="5" :md="4" :lg="4" class="info_right">
                <el-row :gutter="12">
                  <el-col :sm="12" :md="12" :lg="12" class="read_num">
                    <router-link :to="`/post/${item.id}`" target="_blank"><i class="el-icon-view"></i>{{item.read_times}}</router-link>
                  </el-col>
                  <el-col :sm="12" :md="12" :lg="12" class="comment_num">
                    <router-link :to="`/post/${item.id}`" target="_blank"><i class="el-icon-chat-dot-round"></i>{{item.comment_times}}</router-link>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="3" :sm="3" :md="2" :lg="1" class="collection_operate">
            <i class="iconfont" :class="item.is_collection?'icon-collection-b':'icon-collection'" @click="handleCollectionOperate(item)"></i>
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
  </div>
</template>

<script>
import moment from 'moment'
import { fetchCollection } from '@/api/userCenter'
import { collection, calcelCollection } from '@/api/user'
import { getUserInfo } from '@/utils'
moment.locale('zh-cn')

export default {
  data () {
    return {
      collectionList: [],
      prefix: '我',
      // 观看者id，即浏览用户的id
      visit_id: undefined,
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
    }
  },
  mounted () {
    this.visit_id = getUserInfo().id || 0
    this.getCollectionList()
    if (Number(this.visit_id) !== Number(this.$route.params.id)) this.prefix = 'Ta'
  },
  methods: {
    // 获取收藏列表
    async getCollectionList () {
      const data = Object.assign({}, this.paginationData)
      data.id = this.$route.params.id
      data.visit_id = this.visit_id
      let res = await fetchCollection(data)
      this.collectionList = res.data.items
      this.total = res.data.total
    },

    // 处理收藏点击
    async handleCollectionOperate (item) {
      if (Number(this.visit_id) === 0) {
        this.$message({
          message: '请登录后操作！',
          type: 'error'
        })
        return
      }
      let message = ''
      if (item.is_collection) {
        // 取消收藏
        await calcelCollection({
          post_id: item.id,
          user_id: this.visit_id
        })
        message = '取消收藏'
      } else {
        // 收藏
        await collection({
          post_id: item.id,
          user_id: this.visit_id,
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        message = '收藏成功'
      }
      item.is_collection = !item.is_collection
      this.$message({
        message,
        type: 'success'
      })
    },

    handleCurrentChange (page) {
      this.paginationData.page = page
      this.getCollectionList()
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
        // display: flex;
        .info_wrap {
          // width: 100%;
        }
        .collection_operate {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          height: 112px;
          .icon-collection-b {
            color: rgb(255,204,118);
          }
          .iconfont {
            cursor: pointer;
            font-size: 18px;
          }
        }
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
              width: 50px !important;
              height: 50px !important;
              object-fit: cover !important;
              border-radius: 8px !important;
            }
          }
          .user_name {
            // flex: 8;
            font-weight: bold;
            padding-left: 20px;
            width: 100%;
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
                width: 100%;
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

      .pagination {
        .el-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }
      }

    }
  }
</style>
