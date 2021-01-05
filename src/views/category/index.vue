<template>
  <div class="cate_wrap">
      <com-header :index="1"></com-header>
      <div class="container_wrap my-container">
        <el-row :gutter="12">
          <el-col class="main" :md="16" :lg="16" :xl="16">
            <div class="cate_introduction">
              <div class="title">{{cateInfo.name || '所有分类内容'}}</div>
              <div class="desc">{{cateInfo.desc}}</div>
            </div>
            <div class="recoomend_list">
              <div class="no_data" v-if="postList.length==0">暂无数据</div>
              <ul v-else>
                <li v-for="item in postList" :key="item.id">
                  <div class="list_content">
                    <div class="title">
                      <h2><router-link :to="`/post/${item.id}`" target="_blank">{{item.title}}</router-link></h2>
                    </div>
                    <div class="summary_content">
                        {{item.content | delTag}}
                      </div>
                    <div class="list_user_bar">
                      <router-link :to="`/uc/${item.user_id}`" target="_blank" class="user">
                        <img :src="item.avatar || './static/img/photo.jpg'" alt="avatar">
                        <div class="name">
                          {{item.nickname || item.username}}
                        </div>
                      </router-link>
                      <div class="interactive">
                        <div class="read_num">
                          <router-link :to="`/post/${item.id}`" target="_blank"><i class="el-icon-view"></i>{{item.read_times}}</router-link>
                        </div>
                        <div class="comment_num">
                          <router-link :to="`/post/${item.id}`" target="_blank"><i class="el-icon-chat-dot-round"></i>{{item.comment_times}}</router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <div class="loading_more" @click="handleLoadMore">加载更多...</div>
              </ul>
            </div>
          </el-col>
          <el-col :md="8" :lg="8" :xl="8">
            <div class="cate_list_wrap">
              <div class="cate_title">
                <span class="txt">分类列表</span>
              </div>
              <el-collapse accordion>
                <el-collapse-item v-for="item in cateList" :key="item.id" :title="item.name" :name="item.id">
                  <div v-for="item1 in item.sub_cate" :key="item1.id" class="cate_item">
                    <router-link :to="{path: '/cate', query: {sub_cate: item1.id}}">{{item1.name}}</router-link>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-col>
        </el-row>
      </div>
      <com-footer></com-footer>
  </div>
</template>

<script>
import comHeader from '@/components/comHeader'
import comFooter from '@/components/comFooter'
import { fetchPost, fetchCategory } from '@/api/category'
import { delHtmlTag } from '@/utils'

export default {
  data () {
    return {
      postList: [],
      cateList: [],
      requestData: {
        limit: 20,
        skip: 0
      },
      hasMore: true,
      hasShowMessage: false,
      cateInfo: {}
    }
  },
  filters: {
    delTag (val) {
      return delHtmlTag(val)
    }
  },
  mounted () {
    this.getPostList()
    this.getCateList()
  },
  methods: {
    // 重置请求参数
    resetRequestData () {
      this.requestData = {
        limit: 20,
        skip: 0
      }
      this.hasMore = true
    },

    // 获取帖子列表
    async getPostList () {
      const param = Object.assign({}, this.requestData)
      const query = this.$route.query
      if (query.main_cate) {
        param.main_cate = query.main_cate
      } else if (query.sub_cate) {
        param.sub_cate = query.sub_cate
      }
      let res = await fetchPost(param)
      if (res.data.post.length === 0) {
        this.hasMore = false
        this.$message({
          message: '没有更多数据',
          type: 'success'
        })
      }
      this.postList = [...this.postList, ...res.data.post]
      if (!this.cateInfo.length) this.cateInfo = res.data.cate
    },

    // 获取分类列表
    async getCateList () {
      let res = await fetchCategory()
      this.cateList = res.data
    },

    // 加载更多
    handleLoadMore () {
      if (this.hasMore) {
        this.requestData.skip += this.requestData.limit
        this.getPostList()
      } else {
        if (!this.hasShowMessage) {
          this.hasShowMessage = true
          this.$message({
            message: '没有更多数据',
            type: 'success',
            onClose: () => {
              this.hasShowMessage = false
            }
          })
        }
      }
    }
  },
  watch: {
    // 监听路由改变，刷新页面
    $route: {
      deep: true,
      handler () {
        this.resetRequestData()
        this.postList = []
        this.getPostList()
      }
    }
  },
  components: {
    comHeader,
    comFooter
  }
}
</script>

<style lang="scss" scpoed>
  .cate_wrap {
    min-height: 100vh;
    background: rgb(245,246,247);
    .container_wrap {
      padding: 12px 0;
      .main {
        .cate_introduction {
          background: #fff;
          padding: 24px;
          border-radius: 12px;
          .title {
            color: #20232C;
            font-size: 18px;
            font-weight: bold;
          }
          .desc {
            padding-top: 12px;
            color: #555666;
          }
        }
        .recoomend_list {
          padding: 12px 0;
          ul {
            li {
              background: #fff;
              border-bottom: 1px solid #f4f4f4;
              height: 120px;
              padding: 18px 24px 13px;
              .list_content {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .title {
                  h2 {
                    font-weight: bold;
                    line-height: 24px;
                    height: 24px;
                    a {
                      font-size: 18px;
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                      display: block;
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
                }
                .summary_content {
                  color: #8a8a8a;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .list_user_bar {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  .user {
                    display: flex;
                    align-items: center;
                    img {
                      width: 24px;
                      height: 24px;
                      border-radius: 50%;
                      margin-right: 6px;
                    }
                    .name {
                      color: #3d3d3d;
                      font-size: 14px;
                      line-height: 24px;
                    }
                  }
                  .interactive {
                    display: flex;
                    .read_num {
                      margin-right: 12px;
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
                      justify-content: center;
                      align-items: center;
                      &:hover {
                        color: #409EFF;
                      }
                    }
                  }
                }
              }
            }
            li:first-child {
              border-radius: 12px 12px 0 0;
            }
            li:last-child {
              border-radius: 0 0 12px 12px;
            }
          }
          .no_data {
            background: #fff;
            height: 150px;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            color: #666;
          }
          .loading_more {
            background: #fff;
            padding: 12px 0;
            border-radius: 0 0 12px 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: #666;
            &:hover {
              font-weight: bold;
            }
          }
        }
      }

      .cate_list_wrap {
        background: #fff;
        border-radius: 12px;
        padding: 16px;
        .cate_title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #20232c;
          font-weight: bolder;
          margin-bottom: 16px;
          .txt {
            font-size: 18px;
          }
        }
        .is-active {
          color: #409EFF;
        }
        .cate_item {
          padding: 5px 0 5px 20px;
          a {
            display: inline-block;
            width: 100%;
            height: 100%;
            color: #20232C;
          }
        }
        .el-collapse-item__header {
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }
</style>
