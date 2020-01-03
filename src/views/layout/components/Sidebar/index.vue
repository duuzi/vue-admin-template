<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters,mapState } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'menulist',
      'sidebar'
    ]),
    ...mapState({
      menuNames(state) {
        const menus = state.user.menulist.map(_ => {
          return _.PermissionName
        });
        return menus
      },
    }),
    routes() {
      let ary = this.$router.options.routes
      return this.filterMenu(ary)
      //return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods:{
    filterMenu(routerlist) {
      const mns = this.menuNames
      //菜单筛选
      let result = routerlist.filter(_=>this.menuNames.includes(_.name))
      result.forEach(item=>{
        if(item.children&&item.children.length){
          item.children = this.filterMenu(item.children)
          //item.children = item.children.filter(_=>mns.includes(_.name))
        }
      })
      return result
    },
  },
}
</script>
