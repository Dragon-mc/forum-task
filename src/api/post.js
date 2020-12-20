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
