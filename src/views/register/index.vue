 <template>
  <div class="register-container">
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
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">欢迎注册</h3>
      </div>

      <el-form-item prop="username">
        <el-popover
          ref="popover"
          placement="top"
          width="400"
          trigger="focus"
          effect="dark"
          content="设置后不可更改，英文数字组合，最少6位最长16位"
        >
        </el-popover>
        <el-input
            ref="username"
            v-model="registerForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
            @input="handleUsernameChange"
            v-popover:popover
          >
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
      </el-form-item>

      <el-form-item prop="password" class="input-wrap">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          autocomplete="on"
        >
          <i slot="prefix" class="iconfont icon-mima"></i>
          <i class="show-pwd" @click="showPwd" slot="suffix" :class="passwordType === 'password' ? 'iconfont icon-eye-close' : 'iconfont icon-eye-open'"></i>
        </el-input>
      </el-form-item>

      <el-form-item prop="rePassword" class="input-wrap">
        <el-input
          :key="passwordType"
          ref="rePassword"
          v-model="registerForm.rePassword"
          :type="passwordType"
          placeholder="重复输入密码"
          name="rePassword"
          tabindex="2"
          autocomplete="on"
        >
          <i slot="prefix" class="iconfont icon-mima"></i>
          <el-tooltip slot="suffix" class="item" effect="dark" placement="top-end">
            <div slot="content">长度为8~20个字符<br>可以是字母、数字、符号<br>不允许有空格、中文</div>
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </el-input>
      </el-form-item>

      <el-form-item class="input-wrap">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-input
              :key="passwordType"
              v-model="registerForm.vcode"
              placeholder="验证码"
              name="vcode"
              tabindex="2"
              autocomplete="on"
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

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegsiter">注册</el-button>

      <div class="bottom_wrap">
        <div>已有账号？</div>
        <router-link to="/login">
          <el-button type="primary">
            登录
          </el-button>
        </router-link>
      </div>
    </el-form>

  </div>
</template>

<script>
// import Cookies from 'js-cookie'
import moment from 'moment'
import { getVerifyCode, checkUserExist } from '@/api/register' // , freeCache
import { register } from '@/api/user'
import { guid } from '@/utils/index'

export default {
  data () {
    const validateUsername = async (rule, value, callback) => {
      // 发送请求，检验用户名是否存在
      let res = {}
      if (value.trim() !== '') res = await checkUserExist({username: this.registerForm.username})
      if (res.data) callback(new Error('用户名已存在！'))
      // 检测用户名是否为数字和字母
      let reg = /[A-z0-9]+/
      if (!reg.test(value)) callback(new Error('用户名只能为英文数字组合！'))
      // 检测用户名长度
      if (value.length < 6 || value.length > 16) {
        callback(new Error('请输入正确的用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      let reg = /^[0-9A-z`~!@#$%^&*()_+-=\/\\\[\]\{\};':",.<>?]{8,20}$/
      if (value.length < 8 || value.length > 20) {
        callback(new Error('密码长度最少8位，不超过20位'))
      } else if (!reg.test(value)) {
        callback(new Error('密码只能使用英文、数字和特殊字符'))
      } else {
        callback()
      }
    }
    const validateRePassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        rePassword: '',
        vcode: '',
        token: ''
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        rePassword: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      },
      passwordType: 'password',
      loading: false,
      verifyCodeSrc: '',
      usernameTimer: undefined
    }
  },
  async mounted () {
    if (this.registerForm.username === '') {
      this.$refs.username.focus()
    } else if (this.registerForm.password === '') {
      this.$refs.password.focus()
    }

    // 对之前在服务器的验证码数据进行释放
    // let token = Cookies.get('forum-verify-token')
    // if (token) {
    //   freeCache({token})
    // }

    // 初始化时获取验证码
    this.registerForm.token = guid()
    // Cookies.set('forum-verify-token', this.registerForm.token)
    let res = await getVerifyCode({token: this.registerForm.token})
    this.verifyCodeSrc = res.data
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    // 点击注册按钮
    handleRegsiter () {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          const temp = Object.assign({}, this.registerForm)
          temp.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
          register(temp).then(() => {
            this.$message({
              message: '注册成功！',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.replace('/login')
            }, 1000)
          }).catch(() => {
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
      let res = await getVerifyCode({token: this.registerForm.token})
      this.verifyCodeSrc = res.data
    },

    // 输入用户名时检验是否存在
    handleUsernameChange () {
      // 实现防抖
      clearTimeout(this.usernameTimer)
      this.usernameTimer = setTimeout(() => {
        this.$refs.registerForm.validateField('username', valid => {})
      }, 1000)
    }

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
.register-container {
  min-height: 100vh;
  width: 100%;
  background: #F2F2F2;
  overflow: hidden;

  .register-form {
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
      margin: 0px auto 80px auto;
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

  .bottom_wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .code_wrap {
    // background: #000;
    img {
      border-radius: 10px;
    }
  }
}
</style>
