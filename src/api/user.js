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
    url: '/front/user/cancelAttention',
    method: 'post',
    data
  })
}

export function attention (data) {
  return request({
    url: '/front/user/attention',
    method: 'post',
    data
  })
}

export function calcelCollection (data) {
  return request({
    url: '/front/user/calcelCollection',
    method: 'post',
    data
  })
}

export function collection (data) {
  return request({
    url: '/front/user/collection',
    method: 'post',
    data
  })
}
