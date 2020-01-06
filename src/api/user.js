import request from '@/utils/request'

// export function login(data) {
//   return request.service({
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request.service({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request.service({
//     url: '/user/logout',
//     method: 'post'
//   })
// }

export default {
  login: params => request.post('/user/login', params),
  logout: params => request.post('/user/logout'),
  getInfo: params => request.post('/user/info', params)
}
