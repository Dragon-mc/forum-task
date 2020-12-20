<template>
  <div class="search_wrap">
    <com-header :index="-1"></com-header>
    <div class="my-container inner">
      <div class="search_input_wrap">
        <el-input v-model="keywords" @keyup.native.enter="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>
      <div class="post_list">
        <ul>
          <li v-for="item in searchPostList" :key="item.id">
            <div class="post_item">
              <div class="title">
                <h2><router-link target="_blank" :to="`/post/${item.id}`">{{item.title | emphasizeKeywords(queryKeyWords)}}</router-link></h2>
              </div>
              <div class="summary_content">
                  {{item.content}}
                </div>
              <div class="list_user_bar">
                <router-link :to="`/uc/${item.user_id}`" target="_blank" class="user">
                  <img :src="item.avatar || '/static/img/photo.jpg'" alt="avatar">
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
          <div class="pagination">
            <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          </div>
        </ul>
      </div>
    </div>
    <com-footer></com-footer>
  </div>
</template>

<script>
import comHeader from '@/components/comHeader'
import comFooter from '@/components/comFooter'
import { fetchSearchPost } from '@/api/search'

export default {
  data () {
    return {
      keywords: '',
      queryKeyWords: '',
      searchPostList: [],
      // 当前页码
      currentPage: 1,
      // 页面显示记录数
      pageSize: 20,
      // 总记录数
      total: 0
    }
  },
  filters: {
    emphasizeKeywords (val, queryKeyWords) {
      let nowKeywords = queryKeyWords
      // return val.replace(nowKeywords, `<span style="color: #f00">${nowKeywords}</span>`)
      return val
    }
  },
  mounted () {
    this.keywords = this.$route.query.keywords || ''
    this.queryKeyWords = this.keywords
    this.getSearchPostList()
  },
  methods: {
    // 获取搜索条件帖子列表
    async getSearchPostList () {
      const data = {}
      data.keywords = this.keywords || ''
      data.page = this.currentPage
      data.limit = this.pageSize
      let res = await fetchSearchPost(data)

      this.searchPostList = res.data.items
      this.total = res.data.total
    },

    // 点击搜索
    handleSearch () {
      this.getSearchPostList()
      this.$router.push({
        path: '/search',
        query: { keywords: this.keywords }
      })
    },

    // 点击切换页面按钮
    handleCurrentChange (page) {
      this.currentPage = page
      this.getSearchPostList()
    }
  },
  components: {
    comHeader,
    comFooter
  }
}
</script>

<style lang="scss" scoped>
  .search_wrap {
    min-height: 100vh;
    background: #f5f6f7;
    .inner {
      padding-top: 12px;
      .search_input_wrap {
        background: #fff;
        padding: 15px 24px;
        border-radius: 12px;
      }
      .post_list {
        margin-top: 12px;
        ul {
          li {
            background: #fff;
            border-bottom: 1px solid #f4f4f4;
            // height: 120px;
            padding: 18px 24px 13px;
            .post_item {
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
                // white-space: nowrap;
                letter-spacing: 0;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                margin: 12px 0;
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
                    object-fit: cover;
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
        .pagination {
          background: #fff;
          border-radius: 0 0 12px 12px;
          .el-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 120px;
          }
        }
      }
    }
  }
</style>