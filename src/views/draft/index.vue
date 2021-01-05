<template>
  <div class="draft_wrap">
    <div class="title">
      待发布
    </div>
    <div class="draft_list" v-if="draftList.length">
      <div class="draft_item" v-for="(item, index) in draftList" :key="item.id">
        <div class="head">
          <div class="left">
            <el-tag type="info">草稿</el-tag>
            <div class="time">{{item.time}}</div>
          </div>
          <div class="edit">
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
          </div>
        </div>
        <div class="title_content">
          {{(item.title ? item.title : (item.content ? item.content : '暂未填写内容')) | delTag}}
        </div>
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
import { deletePost } from '@/api/post'
import { fetchDraftPost } from '@/api/userCenter'
import { getUserInfo, delHtmlTag } from '@/utils'

export default {
  data () {
    return {
      draftList: [],
      total: 0,
      paginationData: {
        limit: 10,
        page: 1
      }
    }
  },
  mounted () {
    if (Number(getUserInfo().id) !== Number(this.$route.params.id)) {
      // 进入的不是自己的 待发布页面，跳出提示，并返回
      this.$message({
        message: '禁止访问',
        type: 'error'
      })
      this.$router.go(-1)
    } else {
      this.getDraftPostInfo()
    }
  },
  filters: {
    delTag (val) {
      return delHtmlTag(val)
    }
  },
  methods: {
    // 获取待发布帖子列表
    async getDraftPostInfo () {
      const data = Object.assign({}, this.paginationData)
      data.id = this.$route.params.id
      let res = await fetchDraftPost(data)
      this.draftList = res.data.items
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
      this.draftList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .draft_wrap {
    padding: 24px;
    .title {
      font-size: 16px;
      color: #222226;
      font-weight: bold;
    }
    .draft_list {
      .draft_item {
        padding: 15px;
        border: 1px solid #ededed;
        border-radius: 5px;
        margin-top: 15px;
        .head {
          display: flex;
          justify-content: space-between;
          .left {
            display: flex;
            align-items: center;
            color: #999AAA;
            .time {
              padding-left: 15px;
            }
          }
          .edit {
            display: flex;
            align-items: center;
            i {
              font-size: 20px;
              cursor: pointer;
              &:hover {
                color: #409EFF;
              }
            }
            .el-icon-delete {
              margin-left: 20px;
              &:hover {
                color: #fc5531;
              }
            }
          }
        }
        .title_content {
          margin-top: 12px;
          color: #999AAA;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
