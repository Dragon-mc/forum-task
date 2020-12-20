import request from '@/utils/request'

export function fetchPost (query) {
  return request({
    url: '/front/category/fetchPost',
    method: 'get',
    params: query
  })
}

export function fetchCategory () {
  return request({
    url: '/front/category/fetchCategory',
    method: 'get'
  })
}
