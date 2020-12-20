 <template>
  <div class="login-container">
    <vue-particles
        color="#2d3a4b"
        :particleOpacity="0.7"
        :particlesNumber="60"
        shapeType="circle"
        :particleSize="4"
        linesColor="#2d3a4b"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.4"
        :linesDistance="150"
        :moveSpeed="2"
        :hoverEffect="true"
        hoverMode="grab"
        :clickEffect="false"
        clickMode="push"
        class="particle"
      >
      </vue-particles>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>

      <el-form-item prop="username">
        <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          >
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
      </el-form-item>

      <el-form-item prop="password" class="input-wrap">
        
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.enter.native="handleLogin"
        >
          <i slot="prefix" class="iconfont icon-mima"></i>
          <i class="show-pwd" @click="showPwd" slot="suffix" :class="passwordType === 'password' ? 'iconfont icon-eye-close' : 'iconfont icon-eye-open'"></i>
        </el-input>
      </el-form-item>

      <el-form-item class="input-wrap">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              :key="passwordType"
              v-model="loginForm.vcode"
              placeholder="验证码"
              name="vcode"
              tabindex="2"
              autocomplete="on"
              @keyup.enter.native="handleLogin"
            >
              <i slot="prefix" class="iconfont icon-verify"></i>
            </el-input>
          </el-col>
          <el-col :span="8" class="code_wrap">
            <el-image :src="'data:image/jpeg;base64,'+verifyCodeSrc" @click="reloadVerifyCode">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-col>
        </el-row>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <div style="position:relative">
        <el-button type="primary">
          注册账户
        </el-button>
        <el-button class="thirdparty-button" type="primary">
          忘记密码？
        </el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
import Cookies from 'js-cookie'
import moment from 'moment'
import { getVerifyCode, freeCache } from '@/api/register'
import { login } from '@/api/user'
import { guid } from '@/utils/index'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 6 || value.length > 16) {
        callback(new Error('请输入正确的用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8 || value.length > 20) {
        callback(new Error('密码长度最少8位，不超过20位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        vcode: '',
        token: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      verifyCodeSrc: ''
    }
  },
  beforeCreate () {
    if (Cookies.get('forum-user')) {
      this.$message({
        message: '您已登录成功，无需重复登录！',
        type: 'success'
      })
      this.$router.replace('/index')
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  async mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }

    // 对之前在服务器的验证码数据进行释放
    let token = Cookies.get('forum-verify-token')
    if (token) {
      freeCache({token})
    }

    // 初始化时获取验证码
    this.loginForm.token = guid()
    Cookies.set('forum-verify-token', this.loginForm.token)
    let res = await getVerifyCode({token: this.loginForm.token})
    this.verifyCodeSrc = res.data
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          login(this.loginForm)
          .then(res => {
            Cookies.set('forum-user', res.data)
            this.$message({
              message: '登录成功！',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.replace('/index')
            }, 1000);
          })
          .catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 加载验证码
    async reloadVerifyCode () {
      let res = await getVerifyCode({token: this.loginForm.token})
      this.verifyCodeSrc = res.data
    },

  }
}
</script>

<style lang="scss" scoped>
$dark_gray:#889aa4;
$light_gray:#eee;
.particle {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
.login-container {
  min-height: 100vh;
  width: 100%;
  background: #F2F2F2;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 200px 55px 0;
    margin: 0 auto;
    overflow: hidden;
    i {
      font-size: 16px;
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #333;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
