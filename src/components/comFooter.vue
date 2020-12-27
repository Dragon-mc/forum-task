<template>
  <div class="footer_wrap">
    <div class="footer_fixed">
      <div class="my-container inner">
        <div class="info">Copyright&nbsp;&copy;&nbsp;2020&nbsp;重庆师范大学计算机与信息科学学院2019级职教&nbsp;王飞扬</div>
        <div class="relation">
          <i class="iconfont icon-phone"></i>：13271900321&nbsp;&nbsp;<i class="iconfont icon-QQ"></i>：1019664997
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
          >
            <div class="dep_wrap">
              <div class="dep_item"><img src="../assets/logo.png" alt=""><span>Vue.js</span></div>
              <div class="dep_item"><img src="../assets/axios.png" alt=""><span>Axios.js</span></div>
              <div class="dep_item"><img src="../assets/moment.png" alt=""><span>Moment.js</span></div>
              <div class="dep_item"><img src="../assets/element.png" alt=""><span>Element-ui</span></div>
              <div class="dep_item"><img src="../assets/sass.png" alt=""><span>Sass</span></div>
            </div>
            <!-- <el-button slot="reference">技术依赖</el-button> -->
            <div class="dependency" slot="reference">技术依赖</div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" sceped>
$height: 80px;
  .footer_wrap {
    height: $height;
    .footer_fixed {
      position: fixed;
      background: #fff;
      width: 100%;
      height: $height;
      left: 0;
      bottom: 0;
      border-top: 1px solid #f5f6f7;
      .inner {
        height: $height;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        .info {
          font-size: 18px;
          font-weight: bold;
          color: #666;
          text-align: center;
        }
        .relation {
          font-size: 16px;
          font-weight: bold;
          color: #666;
          display: flex;
          align-items: center;
          .dependency {
            cursor: pointer;
            background-color: #ecf5ff;
            color: #409eff;
            border: 1px solid #d9ecff;
            display: inline-block;
            border-radius: 5px;
            font-size: 12px;
            width: 65px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            margin-left: 15px;
          }
        }
      }
    }
  }
  .dep_wrap {
    .dep_item {
      display: flex;
      align-items: center;
      padding: 5px 0;
      img {
        display: inline-block;
        height: 25px;
        margin-right: 10px;
      }
    }
  }
</style>
