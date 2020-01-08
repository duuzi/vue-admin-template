import axios from 'axios'
import Qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    debugger
    const res = response.data
    if(res.code === 401){
      return authrotyExpired()
    }
    // if the custom code is not 20000, it is judged as an error.
    else if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    debugger
    console.log('err' + error) // for debug
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
    params:param
  })
}

export default { service, get, post }
