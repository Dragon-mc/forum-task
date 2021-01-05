import Cookies from 'js-cookie'

export function guid () {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

// 检验用户是否登录
export function isLogin () {
  if (Cookies.get('forum-user')) {
    return true
  }
  return false
}

// 获取用户信息
export function getUserInfo () {
  return JSON.parse(Cookies.get('forum-user') ? Cookies.get('forum-user') : '{}')
}

export function delHtmlTag (str) {
  return str.replace(/<[^>]+>/g, '') // 去掉所有的html标记
}
