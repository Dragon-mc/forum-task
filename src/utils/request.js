import axios from 'axios'
import { Message } from 'element-ui'

// axios.defaults.withCredentials = true
// 创建axios实例
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000, // request timeout
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  }
})

// 请求前的拦截器
http.interceptors.request.use(
  config => {
    // 请求前可对配置信息进行操作
    return config
  },
  error => {
    // 发生错误后，返回错误信息
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 收到请求后提前对数据拦截，执行检测操作
http.interceptors.response.use(
  response => {
    const res = response.data

    // 前后端约定，信息正确的状态码返回20000，不正确则弹出错误信息
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default http
