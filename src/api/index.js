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

export function fetchBrowseRank (data) {
  return request({
    url: '/front/index/fetchBrowseRank',
    method: 'post',
    data
  })
}

export function fetchCommentRank (data) {
  return request({
    url: '/front/index/fetchCommentRank',
    method: 'post',
    data
  })
}

export function fetchAttentionRank (data) {
  return request({
    url: '/front/index/fetchAttentionRank',
    method: 'post',
    data
  })
}
