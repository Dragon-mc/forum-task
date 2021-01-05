<template>
  <div class="rank_wrap">
    <com-header :index="-1"></com-header>
    <div class="my-container inner">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="rank_select">
            <ul>
              <li @mouseenter="indicatorIndex=0" @mouseleave="indicatorIndex=nowIndex">
                <router-link :to="{name: 'browse_rank', params: {index: 0}}">浏览排行</router-link>
              </li>
              <li @mouseenter="indicatorIndex=1" @mouseleave="indicatorIndex=nowIndex">
                <router-link :to="{name: 'comment_rank', params: {index: 1}}">评论排行</router-link>
                </li>
              <li @mouseenter="indicatorIndex=2" @mouseleave="indicatorIndex=nowIndex">
                <router-link :to="{name: 'attention_rank', params: {index: 2}}">关注排行</router-link>
              </li>
              <div class="rank_indicator" :style="{transform: `translateY(${indicatorIndex*55}px)`}"></div>
            </ul>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <div class="rank_list_wrap">
            <router-view></router-view>
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

export default {
  data () {
    return {
      // 当前页面索引
      nowIndex: 0,
      // 排行类别指示器索引
      indicatorIndex: 0
    }
  },
  mounted () {
    this.nowIndex = this.$route.params.index
    if (this.nowIndex === undefined) {
      switch (this.$route.path) {
        case '/rank/browse_rank':
          this.nowIndex = 0
          break
        case '/rank/comment_rank':
          this.nowIndex = 1
          break
        case '/rank/attention_rank':
          this.nowIndex = 2
          break
      }
    }
    this.indicatorIndex = this.nowIndex
  },
  methods: {

  },
  components: {
    comHeader,
    comFooter
  },
  watch: {
    '$route.params': {
      deep: true,
      handler (v) {
        this.nowIndex = v.index
        this.indicatorIndex = v.index
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .rank_wrap {
    min-height: 100vh;
    background: #F5F6F7;
    .inner {
      margin-top: 12px;
      .rank_select {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        ul {
          position: relative;
          li {
            font-weight: bold;
            height: 35px;
            margin-top: 20px;
            &:first-child {
              margin-top: 0;
            }
            &:hover {
              background: #efefef;
              border-radius: 5px;
            }
            .router-link-active {
              color: #409EFF;
            }
            a {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              font-size: 16px;
              color: #1C1D30;
            }
          }
          .rank_indicator {
            position: absolute;
            left: 0;
            top: 7px;
            width: 3px;
            height: 21px;
            background: #409EFF;
            transition-duration: 0.2s;
          }
        }
      }
      .rank_list_wrap {
        background: #fff;
        border-radius: 12px;
      }
    }
  }
</style>
