<template>
  <div class="post_wrap">
    <com-header :index="-1"></com-header>
    <div class="my-container">
      <el-row :gutter="12" class="main">
        <el-col :xs="24" :sm="24" :md="6" :lg="5">
          <div class="author_info">
            <el-row>
              <el-col :xs="4" :sm="3" :md="8" :lg="8" class="author_avatar">
                <router-link :to="`/uc/${postInfo.user_info.id}`" target="_blank"><img :src="postInfo.user_info.avatar || './static/img/photo.jpg'" alt=""></router-link>
              </el-col>
              <el-col :xs="5" :sm="4" :md="16" :lg="16" class="author_name">
                <router-link :to="`/uc/${postInfo.user_info.id}`" target="_blank">{{postInfo.user_info.nickname || postInfo.user_info.username}}</router-link>
              </el-col>
              <el-col :xs="15" :sm="17" :md="24" :lg="24" class="author_sign">
                {{postInfo.user_info.sign || '这个人很懒，什么都没留下'}}
              </el-col>
            </el-row>
            <div class="line-box"></div>
            <div class="interactive">
              <div class="attention"><el-col :xs="12" :sm="12" :md="24" :lg="24" class="num">{{postInfo.user_info.attention_num}}</el-col><el-col :xs="12" :sm="12" :md="24" :lg="24" class="txt">关注</el-col></div>
              <div class="fans"><el-col :xs="12" :sm="12" :md="24" :lg="24" class="num">{{postInfo.user_info.fans_num}}</el-col><el-col :xs="12" :sm="12" :md="24" :lg="24" class="txt">粉丝</el-col></div>
              <div class="comment"><el-col :xs="12" :sm="12" :md="24" :lg="24" class="num">{{postInfo.user_info.comment_num}}</el-col><el-col :xs="12" :sm="12" :md="24" :lg="24" class="txt">评论</el-col></div>
              <div class="collection"><el-col :xs="12" :sm="12" :md="24" :lg="24" class="num">{{postInfo.user_info.collection_num}}</el-col><el-col :xs="12" :sm="12" :md="24" :lg="24" class="txt">收藏</el-col></div>
            </div>
            <div class="attention_author">
              <div v-if="postInfo.user_info.id==selfInfo.id"></div>
              <div class="btn" v-else-if="!postInfo.user_info.is_attention" @click="handleAttention">关注作者</div>
              <div class="has_at" v-else @click="handleCancelAttention">取消关注</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :lg="19">
          <div class="content_wrap">
            <div class="post_info">
              <div class="time">{{postInfo.time}}</div>
              <div class="read_times"><i class="el-icon-view"></i>{{postInfo.read_times}}</div>
              <div class="comment_times"><i class="el-icon-chat-dot-round"></i>{{postInfo.comment_times}}</div>
              <div class="cate_tag">{{postInfo.cate_name}}</div>
              <div class="collection_icon" @click="handleCollection">
                <i class="iconfont" :class="postInfo.is_collection?'icon-collection-b':'icon-collection'"></i>{{postInfo.collection_times}}
              </div>
            </div>
            <div class="title-box">
              <h1>{{postInfo.title}}</h1>
            </div>
            <div class="content_views">
              {{postInfo.content}}
            </div>
          </div>
          <div class="comment_wrap">
            <div class="title">评论区</div>
            <div class="my_comment_wrap">
              <div class="my_avatar">
                <img :src="selfInfo.avatar || './static/img/photo.jpg'" alt="">
              </div>
              <div class="input">
                <el-input
                  ref="commentInput"
                  v-model="commentContent"
                  :placeholder="commentPlaceholder"
                  @keyup.native.enter="handleComment"
                  @blur="handleCommentInputBlur"
                  >
                </el-input>
              </div>
              <div class="submit_btn">
                <el-button @click="handleComment">评论</el-button>
              </div>
            </div>
            <div class="no-content" v-if="!commentInfo.length">暂无评论...</div>
            <div class="comment_list">
              <div class="comment_item" v-for="item in commentInfo" :key="item.id">
                <div class="comment_content_wrap">
                  <div class="user_avatar">
                    <router-link :to="`/uc/${item.user_id}`" target="_blank"><img :src="item.avatar || './static/img/photo.jpg'" alt=""></router-link>
                  </div>
                  <div class="user_name">
                    <router-link :to="`/uc/${item.user_id}`" target="_blank">{{item.nickname || item.username}}：</router-link>
                  </div>
                  <div class="comment_content">
                     {{item.content}}
                     <span class="time">{{item.time | fromNow}}</span>
                     <span class="reply" @click="handleReply(item)">回复</span>
                  </div>
                </div>
                <div class="reply_list">
                  <div class="gap"></div>
                  <div class="reply_item_wrap">
                    <div class="reply_item" v-for="item1 in item.reply_info" :key="item1.id">
                      <div class="user_avatar">
                        <router-link :to="`/uc/${item1.user_id}`" target="_blank"><img :src="item1.avatar || './static/img/photo.jpg'" alt=""></router-link>
                      </div>
                      <div class="user_name">
                        <router-link :to="`/uc/${item1.user_id}`" target="_blank">{{item1.nickname || item1.username}}&nbsp;回复<span class="reply_name">@{{item1.passive_nickname}}</span>：</router-link>
                        </div>
                      <div class="comment_content">
                        {{item1.content}}
                        <span class="time">{{item1.time | fromNow}}</span>
                        <span class="reply" @click="handleReply(item1, item)">回复</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pagination" v-if="commentTotal > commentRequestData.limit">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="commentRequestData.currentPage"
                  :page-size="commentRequestData.limit"
                  layout="prev, pager, next"
                  :total="commentTotal">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <com-footer></com-footer>
  </div>
</template>

<script>
import moment from 'moment'
import { fetchPostInfo, fetchCommentInfo, comment, reply } from '@/api/post'
import { cancelAttention, attention, collection, calcelCollection, history } from '@/api/user'
import { getUserInfo } from '@/utils'
import comHeader from '@/components/comHeader'
import comFooter from '@/components/comFooter'
moment.locale('zh-ch')

export default {
  data () {
    return {
      commentContent: '',
      commentPlaceholder: '请输入评论内容',
      // 是否为回复状态，false表示当前是评论帖子的状态
      reply: false,
      // 帖子信息
      postInfo: {user_info: {}},
      // 评论信息
      commentInfo: [],
      // 评论的总条数
      commentTotal: 0,
      // 当前评论的页数
      currentPage: 1,
      commentRequestData: {
        limit: 3,
        currentPage: 1
      },
      selfInfo: {}
    }
  },
  filters: {
    fromNow (time) {
      return moment(time).fromNow()
    }
  },
  mounted () {
    this.selfInfo = getUserInfo()
    this.getPostInfo()
    this.getCommentInfo()
    this.setHistory()
  },
  methods: {
    // 获取帖子信息
    async getPostInfo () {
      let res = await fetchPostInfo({ id: this.$route.params.id, visit_id: this.selfInfo.id || 0 })
      this.postInfo = res.data
    },

    // 获取评论信息
    async getCommentInfo () {
      const data = Object.assign({}, this.commentRequestData)
      data.post_id = this.$route.params.id
      let res = await fetchCommentInfo(data)
      this.commentInfo = res.data.items
      this.commentTotal = res.data.total
    },

    // 设置浏览历史
    async setHistory () {
      if (!this.selfInfo.id) return
      await history({
        user_id: this.selfInfo.id,
        post_id: this.$route.params.id,
        time: moment().format('YYYY-MM-DD HH:mm:ss')
      })
    },

    // 评论页码改变
    handleCurrentChange (page) {
      this.commentRequestData.currentPage = page
      this.getCommentInfo()
    },

    // 点击评论
    async handleComment () {
      if (!this.checkLogin()) return
      if (this.commentContent.trim() === '') {
        this.$message({
          message: '请输入评论内容！',
          type: 'error'
        })
        return
      }
      if (!reply) {
        // 当前为评论状态
        await comment({
          user_id: this.selfInfo.id,
          post_id: this.postInfo.id,
          content: this.commentContent,
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        this.$message({
          message: '评论成功',
          type: 'success'
        })
      } else {
        // 当前为回复状态
        const data = Object.assign({}, this.replyCreateData)
        data.content = this.commentContent
        await reply(data)
        this.$message({
          message: '回复成功',
          type: 'success'
        })
      }
      // 重新获取评论列表，刷新评论列表
      this.getCommentInfo()
    },

    // 评论输入框失焦
    handleCommentInputBlur () {
      this.commentPlaceholder = '请输入评论内容'
      // 失焦则将状态恢复成默认状态 即评论状态
      this.reply = false
    },

    // 取消关注
    async handleCancelAttention () {
      await cancelAttention({active_id: this.selfInfo.id, passive_id: this.postInfo.user_id})
      this.$message({
        message: '取消关注',
        type: 'success'
      })
      this.postInfo.user_info.is_attention = false
    },
    // 关注
    async handleAttention () {
      if (!this.checkLogin()) return
      await attention({active_id: this.selfInfo.id, passive_id: this.postInfo.user_id, time: moment().format('YYYY-MM-DD HH:mm:ss')})
      this.$message({
        message: '关注成功！',
        type: 'success'
      })
      this.postInfo.user_info.is_attention = true
    },

    // 回复
    handleReply (item, commentItem) {
      if (!this.checkLogin()) return
      this.commentPlaceholder = '回复@' + item.nickname || item.username
      // 使评论输入框聚焦
      this.$refs.commentInput.focus()
      // 改变当前的状态为 回复状态
      this.reply = true
      const data = {}
      data.passive_user_id = item.user_id
      // 如果存在评论的对象，则使用评论对象中的id，表示当前是点击回复内容后面 回复按钮进入的函数
      data.comment_id = commentItem ? commentItem.id : item.id
      data.user_id = this.selfInfo.id
      data.time = moment().format('YYYY-MM-DD HH:mm:ss')
      this.replyCreateData = data
      // 初始化完回复的基本数据
    },

    // 收藏
    async handleCollection () {
      if (!this.checkLogin()) return
      let message = ''
      if (this.postInfo.is_collection) {
        // 取消收藏
        await calcelCollection({
          post_id: this.postInfo.id,
          user_id: this.selfInfo.id
        })
        message = '取消收藏'
        this.postInfo.collection_times--
      } else {
        // 收藏
        await collection({
          post_id: this.postInfo.id,
          user_id: this.selfInfo.id,
          time: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        message = '收藏成功'
        this.postInfo.collection_times++
      }
      this.postInfo.is_collection = !this.postInfo.is_collection
      this.$message({
        message,
        type: 'success'
      })
    },

    // 检查是否登录
    checkLogin () {
      if (!this.selfInfo.id) {
        this.$message({
          message: '请登录后操作！',
          type: 'error'
        })
        return false
      }
      return true
    }
  },
  components: {
    comHeader,
    comFooter
  }
}
</script>

<style lang="scss" scoped>
  .post_wrap {
    min-height: 100vh;
    background: rgb(245,246,247);
    .main {
      padding-top: 12px;
      .author_info {
        background: #fff;
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 12px;
        .author_avatar {
          height: 50px;
          img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 50%;
          }
        }
        .author_name {
          height: 50px;
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          color: #555666;
        }
        .author_sign {
          height: 50px;
          line-height: 50px;
          color: #4A4D52;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .line-box {
          height: 1px;
          background-color: #f5f6f7;
          margin-top: 10px;
        }
        .interactive {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 70px;
          color: #999aaa;
          .num {
            margin-bottom: 5px;
            color: #555666;
            display: flex;
            justify-content: center;
          }
          .txt {
            display: flex;
            justify-content: center;
            white-space: nowrap;
          }
        }
        .attention_author {
          display: flex;
          justify-content: center;
          align-items: center;
          .btn {
            color: #fff;
            background: linear-gradient(45deg,#C9AFFF,#409EFF);
            width: 100px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            margin: 8px 0;
            &:hover {
              cursor: pointer;
              opacity: 0.9;
            }
          }
          .has_at {
            width: 90px;
            height: 32px;
            border-radius: 16px;
            border: 1px solid #999999;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover {
              color: #409EFF;
              cursor: pointer;
              border: 1px solid #409EFF;
              background: rgba(64,158,255, 0.1);
            }
          }
        }
      }
      .content_wrap {
        background: #fff;
        border-radius: 12px;
        padding: 25px;
        .post_info {
          display: flex;
          align-items: center;
          background: rgba(102,177,255,0.1);
          padding: 15px;
          border-radius: 5px;
          color: #999aaa;
          .read_times {
            margin-left: 20px;
            display: flex;
            align-items: center;
          }
          .comment_times {
            margin-left: 20px;
            display: flex;
            align-items: center;
          }
          .cate_tag {
            margin-left: 25px;
            background: #fff;
            color: #409EFF;
            padding: 5px 8px;
            border-radius: 5px;
            border: 1px solid #eaeaef;
            font-size: 12px;
          }
          .collection_icon {
            margin-left: 30px;
            cursor: pointer;
            .icon-collection-b {
              color: rgb(255,204,118);
            }
            &:hover {
              color: #409EFF;
              .icon-collection {
                color: #409EFF;
              }
            }
          }
          i {
            font-size: 18px;
            margin-right: 6px;
            font-weight: bold;
            color: #999aaa;
          }
        }
        .title-box {
          padding: 12px 0;
          h1 {
            font-size: 28px;
            word-wrap: break-word;
            color: #222226;
            font-weight: 600;
            margin: 0;
            word-break: break-all;
          }
        }
      }
      .comment_wrap {
        margin-top: 12px;
        background: #fff;
        padding: 25px;
        border-radius: 12px;
        .title {
          font-size: 18px;
          color: #20232c;
          font-weight: bolder;
          padding-bottom: 10px;
        }
        .my_comment_wrap {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid #e8e8ee;
          .my_avatar {
            img {
              width: 40px;
              height: 40px;
              object-fit: cover;
              border-radius: 50%;
            }
          }
          .input {
            width: 100%;
            margin-left: 15px;
          }
          .submit_btn {
            margin-left: 15px;
          }
        }
        .no-content {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #999aaa;
          margin-top: 20px;
          font-size: 16px;
        }
        .comment_list {
          // padding: 15px 0 0 0;
          .comment_item {
            border-bottom: 1px solid #e8e8ee;
            padding: 10px 0;
            @mixin attr {
              display: flex;
              .user_avatar {
                img {
                  width: 25px;
                  height: 25px;
                  object-fit: cover;
                  border-radius: 50%;
                }
              }
              .user_name {
                color: #555666;
                line-height: 24px;
                padding-left: 10px;
              }
              .comment_content {
                padding-left: 5px;
                color: #222226;
                line-height: 24px;
                .time {
                  font-size: 12px;
                  color: #6B6B6B;
                  padding-left: 12px;
                }
                .reply {
                  color: #409EFF;
                  padding-left: 10px;
                  cursor: pointer;
                  &:hover {
                    color: #fc5531;
                  }
                }
              }
            }
            .comment_content_wrap {
              padding: 7px 0;
              @include attr;
            }
            &:last-child {
              border: none;
            }
            .reply_list {
              display: flex;
              .gap {
                width: 35px;
              }
              .reply_item_wrap {
                .reply_item {
                  padding: 7px 0;
                  @include attr;
                  .reply_name {
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
              padding: 20px 0 0 0;
            }
          }

        }
      }
    }
  }
</style>
