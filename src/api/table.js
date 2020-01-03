import request from '@/utils/request'

export function getList(params) {
  return request.service({
    url: '/table/list',
    method: 'get',
    params
  })
}

export default {
  //getList: params => request.get('/table/list', params),
  getRoleList: params => request.post('/table/roleList'),

}
