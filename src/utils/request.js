import axios from 'axios'
import Qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    if(res.code === 401){
      return authrotyExpired()
    } else if (res.code !== 20000) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

const authrotyExpired = function () {
  Message({
    message: '登录身份过期，请重新登录。',
    type: 'warning',
    duration: 5 * 1000
  })
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')
  router.push('/login')
  return Promise.reject(new Error('身份过期'))
}

export function post(url, params) {
  debugger
  return service({
    method: 'post',
    url,
    data:params,
    //data: Qs.stringify(params),
    headers: {
      //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

// 返回一个Promise（发送get请求）
export function get(url, param) {
  return service({
    method: 'get',
    url,
    param
  })
}

export default { service, get, post }
