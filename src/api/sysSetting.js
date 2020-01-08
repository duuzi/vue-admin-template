import request from '@/utils/request'

export default {
  login: params => request.post('/user/login', params),
  logout: params => request.post('/user/logout'),
  getInfo: params => request.get('/user/info', params)
}
