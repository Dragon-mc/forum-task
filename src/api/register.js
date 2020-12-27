import request from '@/utils/request'

// 获取验证码图片
export function getVerifyCode (data) {
  return request({
    url: '/front/user/getVerifyCode',
    method: 'post',
    data
  })
}

export function freeCache (data) {
  return request({
    url: '/front/user/freeCache',
    method: 'post',
    data
  })
}

export function checkUserExist (data) {
  return request({
    url: '/front/user/checkUserExist',
    method: 'get',
    params: data
  })
}
