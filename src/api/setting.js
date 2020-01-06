import request from '@/utils/request'

export default {
  login: params => request.post('/auth/Auth/login', params),
  logout: () => request.post('/user/logout'),
  getInfo: params => request.post('/user/info', params),
  getRoleList: params => request.get('/table/roleList', params),
  getMenuList: params => request.get('/table/menuList', params),
}
