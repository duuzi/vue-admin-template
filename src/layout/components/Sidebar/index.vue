<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- <el-menu v-if="isBackMenu" :default-active="$route.path" :router="true" :unique-opened="true" :text-color="variables.menuText" :background-color="variables.menuBg">
        <div v-for="menu in allMenus" :key="menu.id">
          <el-menu-item
            :index="menu.path"
            ref="menu"
            :key="menu.id"
            v-if="menu.subMenus.length == 0"
          >
            <i :class="menu.icon"></i>
            <span slot="title">{{menu.name}}</span>
          </el-menu-item>
          <el-submenu v-else :index="String(menu.name)">
            <template slot="title">
              <i :class="menu.icon"></i>
              <span>{{menu.name}}</span>
            </template>
            <el-menu-item
              v-for="mn in menu.subMenus"
              :key="mn.id"
              :index="mn.url"
              class="text-center"
            >
              <span style="font-size:14px">{{mn.name}}</span>
            </el-menu-item>
          </el-submenu>
        </div>
      </el-menu> -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      isBackMenu:false
    };
  },
  
  computed: {
    ...mapGetters(["menulist","sidebar"]),
    ...mapState({
      menuNames(state) {
        debugger
        const menus = state.user.menulist.map(_ => {
          return _.PermissionName
        });
        return menus
      },
      // allMenus(state) {
      //   debugger;
      //   const menus = state.user.menulist.map(_ => {
      //     return {
      //       id: _.Id,
      //       name: _.PermissionName,
      //       path: _.PermissionUrl,
      //       icon: _.PermissionIcon,
      //       parent: _.ParentId
      //     };
      //   });
      //   const pm = menus.filter(x => (x.parent || 0) === 0);
      //   pm.forEach(m => {
      //     m.children = menus.filter(x => x.parent === m.id);
      //   });
      //   return pm;
      // }
    }),
    routes() {
      debugger;
      //return this.allMenus;
      let ary = this.$router.options.routes
      return this.filterMenu(ary)
      return this.$router.options.routes;
    },
    
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
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
};
</script>
