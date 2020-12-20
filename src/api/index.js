import request from '@/utils/request'

export function fetchRecommendPostList (query) {
  return request({
    url: '/front/index/fetchRecommendPostList',
    method: 'get',
    params: query
  })
}

export function fetchRankList () {
  return request({
    url: '/front/index/fetchRankList',
    method: 'get'
  })
}

export function fetchCateList () {
  return request({
    url: '/front/index/fetchCateList',
    method: 'get'
  })
}
