import request from '@/utils/request'

export function fetchSearchPost (data) {
  return request({
    url: '/front/search/fetchSearchPost',
    method: 'post',
    data
  })
}
