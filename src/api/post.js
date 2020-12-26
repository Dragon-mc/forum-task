import request from '@/utils/request'

export function fetchPostInfo (data) {
  return request({
    url: '/front/post/fetchPostInfo',
    method: 'post',
    data
  })
}

export function fetchCommentInfo (data) {
  return request({
    url: '/front/post/fetchCommentInfo',
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

export function reply (data) {
  return request({
    url: '/front/post/reply',
    method: 'post',
    data
  })
}

// 发布帖子时 上传推片
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

export function postEdit (data) {
  return request({
    url: '/front/post/postEdit',
    method: 'post',
    data
  })
}
