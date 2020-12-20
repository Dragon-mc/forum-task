import request from '@/utils/request'

export function register (data) {
  return request({
    url: '/front/user/register',
    method: 'post',
    data
  })
}

export function login (data) {
  return request({
    url: '/front/user/login',
    method: 'post',
    data
  })
}

export function cancelAttention (data) {
  return request({
    url: '/front/userCenter/cancelAttention',
    method: 'post',
    data
  })
}

export function attention (data) {
  return request({
    url: '/front/userCenter/attention',
    method: 'post',
    data
  })
}
