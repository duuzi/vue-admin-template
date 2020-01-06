import Mock from 'mockjs'

const permissions = Mock.mock({
  tree:[{
    id: 1,
    label: 'Level one 1',
    children: [{
      id: 4,
      label: 'Level two 1-1',
      children: [{
        id: 9,
        label: 'Level three 1-1-1'
      }, {
        id: 10,
        label: 'Level three 1-1-2'
      }]
    }]
  }, {
    id: 2,
    label: 'Level one 2',
    children: [{
      id: 5,
      label: 'Level two 2-1'
    }, {
      id: 6,
      label: 'Level two 2-2'
    }]
  }, {
    id: 3,
    label: 'Level one 3',
    children: [{
      id: 7,
      label: 'Level two 3-1'
    }, {
      id: 8,
      label: 'Level two 3-2'
    }]
  }]
})

const menuList = Mock.mock({
  Permissions:[
    {
      ParentId:0,
      Id:1,
      PermissionUrl:'/dashboard',
      PermissionName:'Dashboard'
    },
    {
      ParentId:0,
      Id:2,
      PermissionUrl:'/setting',
      PermissionName:'Setting'
    },
    {
      ParentId:2,
      Id:3,
      PermissionUrl:'/setting/role',
      PermissionName:'Role'
    },
    {
      ParentId:2,
      Id:4,
      PermissionUrl:'/setting/user',
      PermissionName:'User'
    },
    {
      ParentId:0,
      Id:5,
      PermissionUrl:'',
      PermissionName:'Example'
    },
    {
      ParentId:5,
      Id:6,
      PermissionUrl:'/example/table',
      PermissionName:'Table'
    },
    {
      ParentId:5,
      Id:7,
      PermissionUrl:'',
      PermissionName:'Tree'
    }
  ]
})
const roledata = Mock.mock({
  'items|5': [{
    id: '@id',
    roleDesc: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    roleName: '@name',
    updateTime: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})
const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

export default [
  {
    url: '/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/table/roleList',
    type: 'get',
    response: config => {
      const items = roledata.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/table/menuList',
    type: 'get',
    response: config => {
      const items = permissions.tree
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
