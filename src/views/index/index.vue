<template>
  <div class="page">
    <com-header :index="0"></com-header>
    <div class="container_wrap my-container clearfix">
      <el-row :gutter="12">
        <!-- 左侧固定分类导航栏 -->
        <el-col :md="2" :lg="2">
          <div class="ul_wrap">
            <ul class="nav_cate_bar clearfix">
              <li v-for="item in cateList" :key="item.id"><router-link :to="{path: `/cate`, query: {main_cate: item.id}}" target="_blank">{{item.name}}</router-link></li>
              <!-- <li><a href="javascript:;">Python</a></li>
              <li><a href="javascript:;">Java</a></li>
              <li><a href="javascript:;">Javascript</a></li>
              <li><a href="javascript:;">PHP</a></li>
              <li><a href="javascript:;">Go</a></li>
              <li><a href="javascript:;">C</a></li>
              <li><a href="javascript:;">C++</a></li>
              <li><a href="javascript:;">C#</a></li> -->
            </ul>
          </div>
        </el-col>
        <!-- 右侧滚动内容 -->
        <el-col :md="22" :lg="22" class="scroll_content">
          <el-row :gutter="12">
            <el-col class="main" :md="17" :lg="17">
              <!-- 轮播图 -->
              <div class="carousel">
                <el-carousel trigger="click" height="300px">
                  <el-carousel-item v-for="item in 4" :key="item">
                    <h3 class="small">{{ item }}</h3>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div class="recoomend_list">
                <ul>
                  <li v-for="item in recommendPostList" :key="item.id">
                    <div class="list_content">
                      <div class="title">
                        <h2><router-link target="_blank" :to="`/post/${item.id}`">{{item.title}}</router-link></h2>
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
                </ul>
              </div>
            </el-col>
            <el-col class="aside" :md="7" :lg="7">
              <div class="browse_rank rank_list">
                <div class="rank_title">
                  <span class="txt">浏览排行</span>
                  <el-tag size="small">查看更多</el-tag>
                </div>
                <el-row class="browse_list" :gutter="24">
                  <el-col v-for="item in browseRank" :key="item.id" class="browse_item" :xs="12" :sm="12" :md="24" :lg="24">
                    <router-link :to="`/post/${item.id}`" target="_blank">
                      <el-row :gutter="12">
                        <el-col :span="6"><img :src="item.avatar || '/static/img/photo.jpg'" alt=""></el-col>
                        <el-col :span="18">
                          <div class="title">
                            {{item.title}}
                          </div>
                        </el-col>
                      </el-row>
                    </router-link>
                  </el-col>
                </el-row>
              </div>
              <div class="comment_rank rank_list">
                <div class="rank_title">
                  <span class="txt">评论排行</span>
                  <el-tag size="small">查看更多</el-tag>
                </div>
                <el-row class="comment_list" :gutter="24">
                  <el-col v-for="item in commentRank" :key="item.post_id" class="comment_item" :xs="12" :sm="12" :md="24" :lg="24">
                    <router-link :to="`/post/${item.post_id}`" target="_blank">
                      <el-row class="user" :gutter="4">
                        <el-col :span="5"><img :src="item.details.avatar || '/static/img/photo.jpg'" alt="" class="responsive_img"></el-col>
                        <el-col :span="14" class="user_info">
                          <div class="name">{{item.details.nickname || item.details.username}}</div>
                          <div class="sign">{{item.details.sign || '这个人太懒了，什么都没留下'}}</div>
                        </el-col>
                        <el-col :span="5" class="msg_num">
                          <i class="el-icon-chat-dot-round"></i>
                          <div>{{item.commented_times}}</div>
                        </el-col>
                      </el-row>
                      <div class="title">
                        {{item.details.title}}
                      </div>
                    </router-link>
                  </el-col>
                </el-row>
              </div>
              <div class="attention_rank rank_list">
                <div class="rank_title">
                  <span class="txt">关注排行</span>
                  <el-tag size="small">查看更多</el-tag>
                </div>
                <el-row class="attention_list" :gutter="24">
                  <el-col v-for="item in attentionRank" :key="item.passive_id" class="attention_item" :xs="12" :sm="12" :md="24" :lg="24">
                    <router-link :to="`/uc/${item.passive_id}`" target="_blank">
                      <!-- <el-row :gutter="12"> -->
                        <div><img :src="item.user_info.avatar || '/static/img/photo.jpg'" alt=""></div>
                        <div class="info">
                          <div class="name">
                            {{item.user_info.nickname || item.user_info.username}}
                          </div>
                          <div class="attention_num">
                            被关注 {{item.passive_attention_num}}
                          </div>
                        </div>
                      <!-- </el-row> -->
                    </router-link>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <com-footer></com-footer>
  </div>
</template>

<script>
import comHeader from '@/components/comHeader'
import comFooter from '@/components/comFooter'
import { getUserInfo } from '@/utils'
import { fetchRecommendPostList, fetchRankList, fetchCateList } from '@/api'

export default {
  data () {
    return {
      recommendPostList: [],
      browseRank: [],
      commentRank: [],
      attentionRank: [],
      cateList: [],
      requestData: {
        limit: 20,
        skip: 0
      },
      hasShowMessage: false
    }
  },
  mounted () {
    let userInfo = getUserInfo() || '{}'
    this.userInfo = JSON.parse(userInfo)
    this.getRecommendPostList()
    this.getRankList()
    this.getCateList()
    // 添加页面滚动事件，检测页面触底，加载数据
    document.addEventListener('scroll', this.scroll.bind(this))
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

    // 获取推荐帖子信息
    async getRecommendPostList () {
      let res = await fetchRecommendPostList(this.requestData)
      if (res.data.length == 0) {
        this.hasMore = false
        this.$message({
          message: '没有更多数据',
          type: 'success'
        })
      }
      this.recommendPostList = [...this.recommendPostList, ...res.data]
    },

    // 获取排行列表
    async getRankList () {
      let res = await fetchRankList()
      this.browseRank = res.data.browse_rank
      this.commentRank = res.data.comment_rank
      this.attentionRank = res.data.attention_rank
    },

    // 获取分类列表
    async getCateList () {
      let res = await fetchCateList()
      this.cateList = res.data
    },

    scroll() {
      // 只有当页面时主页时，才检测滚动刷新
      if (this.$route.path != '/index') return
      //页面滚动高度
      let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      //窗口显示区高度
      let windowHeight = window.innerHeight
      // 页面总高度
      let pageHeight = document.body.scrollHeight || document.documentElement.scrollHeight
      if (scroll + windowHeight >= pageHeight) {
        // 页面触底，加载数据
        if (this.hasMore) {
          this.requestData.skip += this.requestData.limit
          this.getRecommendPostList()
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
    }
  },
  components: {
    comHeader,
    comFooter
  }

}
</script>

<style lang="scss" scoped>
  @media screen and (max-width: 992px){
    .ul_wrap {
      overflow-x: scroll;
      overflow-y: hidden;
      .nav_cate_bar {
        width: 85px * 13;
        li {
            float: left;
            width: 85px;
          }
      }
    }
  }
  .page {
    min-height: 100vh;
    background: rgb(245, 246, 247);

    .container_wrap {
      // width: 1180px;
      padding: 12px 0;
      .ul_wrap {
        background: #fff;
        border-radius: 12px;
        .nav_cate_bar {
          // width: 96px;
          // margin-right: 12px;
          
          li {
            a {
              display: block;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #555666;
              &:hover {
                background: #f5F6F7;
                color: #222226;
                font-weight: bold;
              }
            }
          }
        }
      }

      .scroll_content {
        // width: 1072px;
        // float: left;

        .main {
          // width: 760px;
          // margin-right: 12px;
          // float: left;

          .carousel {
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 12px;
          }

          .recoomend_list {
            padding-bottom: 12px;
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
          }
        }
        .aside {
          // width: 300px;
          // float: left;

          .rank_list {
            background: #fff;
            margin-bottom: 12px;
            padding: 16px;
            border-radius: 12px;
          }

          .rank_title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #20232c;
            font-weight: bolder;
            margin-bottom: 16px;
            .txt {
              font-size: 18px;
            }
            .el-tag:hover {
              opacity: 0.7;
              filter: alpha(opacity=70);
              cursor: pointer;
            }
          }

          .browse_rank {
            .browse_list {
              .browse_item {
                // border-bottom: 1px solid #f4f4f4;
                // height: 48px;
                margin-bottom: 16px;
                a {
                  display: flex;
                  justify-content: space-between;
                  img {
                    object-fit: cover;
                    // width: 64px;
                    // height: 48px;
                    object-fit: cover;
                    height: 48px;
                    border-radius: 3px;
                    width: 100%;
                  }
                  .title {
                    // width: 194px;
                    line-height: 24px;
                    color: #3d3d3d;
                    font-weight: bolder;
                    letter-spacing: 0;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                  }
                }
              }
            }
          }

          .comment_rank {
            .comment_list {
              .comment_item {
                // height: 95px;
                padding: 8px;
                margin-bottom: 8px;
                border-bottom: 1px solid #f4f4f4;
                a {
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  .user {
                    display: flex;
                    img {
                      width: 50px;
                      object-fit: cover;
                      border-radius: 50%;
                      width: 100%;
                    }
                    .user_info {
                      // margin-left: 6px;
                      display: flex;
                      flex-direction: column;
                      justify-content: space-around;
                      // width: 146px;
                      .name {
                        color: #4f4f4f;
                        font-weight: bold;
                      }
                      .sign {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 12px;
                        color: #707070;
                      }
                    }
                    .msg_num {
                      display: flex;
                      flex-direction: column;
                      justify-content: space-evenly;
                      align-items: center;
                      // width: 50px;
                      i {
                        font-size: 18px;
                      }
                    }
                  }
                  .title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 16px;
                    padding: 5px 0;
                  }
                }
              }
            }
          }

          .attention_rank {
            .attention_list {
              .attention_item {
                // height: 75px;
                padding: 12px 0;
                border-bottom: 1px solid #f4f4f4;
                a {
                  display: flex;
                  img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 50%;
                  }
                  .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    // margin-left: 8px;
                    height: inherit;
                    padding-left: 12px;
                    .name {
                      font-size: 14px;
                      color: #4d4d4d;
                      font-weight: bold;
                    }
                    .attention_num {
                      font-size: 12px;
                      color: #6b6b6b;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  @media screen and (max-width: 767px) {
    .responsive_img {
      height: 45px;
    }
  }
  @media screen and (min-width: 768px) {
    .responsive_img {
      height: 69.11px;
    }
  }
  @media screen and (min-width: 992px) {
    .responsive_img {
      height: 42.36px;
    }
  }
  @media screen and (min-width: 1200px) {
    .responsive_img {
      height: 54.05px;
    }
  }
</style>