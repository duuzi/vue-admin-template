import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login','/404'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  //如果已经登录
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // if (store.getters.roles.length === 0) {
      if (store.getters.name.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          gotoRouter(to,next)
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/login' })
            // next({ path: '/' })
          })
        })
      } else {
        gotoRouter(to,next)
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

function gotoRouter(to,next){
  let menuLevel1 = to.path
      menuLevel1 = menuLevel1.split('/')[1]
      var loginUser = sessionStorage.getItem('user')
      // 将sessionStorage中取出的JSON字串转化为JS对象
      loginUser = JSON.parse(loginUser)
      // 如果用户没有权限，跳转到404，404页面不需要判断权限，否则会循环
      if (!loginUser || !loginUser.Permissions ||
        !loginUser.Permissions.find(_ => _.PermissionUrl && _.PermissionUrl.indexOf(menuLevel1) >= 0)) {
        return next('404')
      }
}