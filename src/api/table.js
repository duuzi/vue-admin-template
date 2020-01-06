import request from '@/utils/request'

export function getList(params) {
  return request.service({
    url: '/table/list',
    method: 'get',
    params
  })
}
export default {
  getRoleList: params => request.get('/table/roleList', params),
  getMenuList: params => request.get('/table/menuList', params),
}
