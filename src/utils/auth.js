import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return sessionStorage.getItem('token')
  //return Cookies.get(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem('token',token)
  //return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem('token')
  //return Cookies.remove(TokenKey)
}
