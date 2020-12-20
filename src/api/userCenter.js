import request from '@/utils/request'

export function getUserCenterInfo (data) {
  return request({
    url: '/front/userCenter/getUserInfo',
    method: 'post',
    data
  })
}

export function fetchCollection (data) {
  return request({
    url: '/front/userCenter/fetchCollection',
    method: 'post',
    data
  })
}

export function fetchPublish (data) {
  return request({
    url: '/front/userCenter/fetchPublish',
    method: 'post',
    data
  })
}

export function fetchAttention (data) {
  return request({
    url: '/front/userCenter/fetchAttention',
    method: 'post',
    data
  })
}

export function fetchFans (data) {
  return request({
    url: '/front/userCenter/fetchFans',
    method: 'post',
    data
  })
}

export function fetchHistory (data) {
  return request({
    url: '/front/userCenter/fetchHistory',
    method: 'post',
    data
  })
}
