const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menulist:state=>state.user.menulist,
  visitedviews: state => state.tagsview.visitedviews // 新增
}
export default getters
