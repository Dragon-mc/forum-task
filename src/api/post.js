import request from '@/utils/request'

export function fetchPostInfo (data) {
  return request({
    url: '/front/post/fetchPostInfo',
    method: 'post',
    data
  })
}

export function comment (data) {
  return request({
    url: '/front/post/comment',
    method: 'post',
    data
  })
}

export function uploadImg (data) {
  return request({
    url: '/front/post/uploadImg',
    method: 'post',
    headers: {'Content-Type':'multipart/form-data'},
    data
  })
}

export function postPublish (data) {
  return request({
    url: '/front/post/postPublish',
    method: 'post',
    data
  })
}
