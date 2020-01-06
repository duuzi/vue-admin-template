import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login','/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  debugger
  if (whiteList.indexOf(to.path) !== -1) {
    return next()
  }
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      debugger
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        gotoRouter(to,next)
        next()
      } else {
        try {
          debugger
          // get user info页面刷新后重新赋值
          await store.dispatch('user/getInfo')
          gotoRouter(to,next)
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          //next(`/login?redirect=${to.path}`)
          next('/login')
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      //next(`/login?redirect=${to.path}`)
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function gotoRouter(to,next){
  debugger
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
