// import { login, logout, getInfo } from '@/api/user'
import user_api from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  menulist: [],
  profile: {},
}

const mutations = {
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
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      user_api.login({ username: username.trim(), password: password }).then(response => {
        debugger
        const { data } = response
        //存储用户信息
        setToken(data.token)
        // sessionStorage.setItem('user', JSON.stringify(data.user))
        // commit('SET_LOGIN_USER', data.user)
        // commit('SET_MENU', data.user.Permissions)
        // commit('SET_TOKEN', data.token)
        // commit('SET_NAME', data.user.name)
        // commit('SET_AVATAR', data.user.avatar)
       
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },


  // 获取用户信息(登录和获取用户分开)
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      debugger
      var sessionuser = sessionStorage.getItem('user');
      const userInfo = JSON.parse(sessionuser)
      if (userInfo) {
        if(userInfo.Permissions && userInfo.Permissions.length){
          commit('SET_MENU', userInfo.Permissions)
        }else{
          reject('getInfo: munes must be a non-null array !')
        }
        commit('SET_LOGIN_USER', userInfo)
        commit('SET_NAME', userInfo.name)
        commit('SET_AVATAR', 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2554408347,3908110233&fm=26&gp=0.jpg')
        resolve(userInfo)
      }else{
        const token = getToken()
        user_api.getInfo({token:token}).then(response => {
          const u = response.data
          // const u = JSON.parse(data)
          if(u){
            if(u.Permissions && u.Permissions.length){
              sessionStorage.setItem('user', JSON.stringify(u))
              commit('SET_MENU', u.Permissions)
            }else{
              reject('getInfo: munes must be a non-null array !')
            }
            commit('SET_LOGIN_USER', u)
            commit('SET_NAME', u.name)
            commit('SET_AVATAR', 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2554408347,3908110233&fm=26&gp=0.jpg')
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      }
    })
  },
  // get user info 从sessionstorage获取
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     debugger
  //     setTimeout(() => {
  //       var userInfo = sessionStorage.getItem('user');
  //       //if (userInfo && state.user) return;
  //       if (userInfo) {
  //         const u = JSON.parse(userInfo)
  //         commit('SET_LOGIN_USER', u)
  //         commit('SET_MENU', u.Permissions)
  //         commit('SET_NAME', u.name)
  //         commit('SET_AVATAR', u.avatar)
  //       };
  //       resolve({ bool: true, userInfo })
  //     }, 0);
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      user_api.logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        sessionStorage.removeItem('user')
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      sessionStorage.removeItem('user')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

