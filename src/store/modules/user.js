import user_api from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    menulist: [],
  },

  mutations: {
    SET_LOGIN_USER: (state, user) => {
      state.user = user
    },
    SET_MENU: (state, permissions) => {
      state.menulist = permissions
    },
    SET_TOKEN: (state, token) => {
      if (token) {
        sessionStorage.setItem('token', token)
      } else {
        sessionStorage.removeItem('token')
      }
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        user_api.login({UserName:username, Password:userInfo.password}).then(response => {
          const data = response.data
          sessionStorage.setItem('user', JSON.stringify(data.user))
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          commit('SET_LOGIN_USER', data.user)
          commit('SET_ROLES', data.user.roles)
          commit('SET_MENU', data.user.Permissions)
          commit('SET_NAME', data.user.name)
          commit('SET_AVATAR', data.user.avatar)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },


    // get user info
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        debugger
        setTimeout(() => {
          var userInfo = sessionStorage.getItem('user');
          //if (userInfo && state.user) return;
          if (userInfo) {
            const u = JSON.parse(userInfo)
            commit('SET_LOGIN_USER', u)
            commit('SET_ROLES', u.roles)
            commit('SET_MENU', u.Permissions)
            commit('SET_NAME', u.name)
            commit('SET_AVATAR', u.avatar)
          };
          resolve({ bool: true, userInfo })
        }, 0);
      })
    },
    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(response => {
    //       const data = response.data
    //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', data.roles)
    //       } else {
    //         reject('getInfo: roles must be a non-null array !')
    //       }
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        user_api.logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          sessionStorage.removeItem('user')
          // commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        sessionStorage.removeItem('user')
        resolve()
      })
    }
  }
}

export default user
