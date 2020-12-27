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

export function fetchDraftPost (data) {
  return request({
    url: '/front/userCenter/fetchDraftPost',
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

export function modifyProfile (data) {
  return request({
    url: '/front/userCenter/modifyProfile',
    method: 'post',
    data
  })
}

export function uploadAvatar (data) {
  return request({
    url: '/front/userCenter/uploadAvatar',
    method: 'post',
    headers: {'Content-Type':'multipart/form-data'},
    data
  })
}
