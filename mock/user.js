
const loginUsers = {
  admin: {
    token: 'admin-token',
    user:{
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin',
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
          ParentId:2,
          Id:8,
          PermissionUrl:'/setting/team',
          PermissionName:'Team'
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
    }
  },
  editor: {
    token: 'editor-token',
    user:{
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Editor',
      Permissions:[
        {
          ParentId:0,
          Id:1,
          PermissionUrl:'/dashboard',
          PermissionName:'Dashboard'
        },
      ]
    }
  }
}


const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
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
    ]
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      debugger
      const { username } = config.body
      const token = loginUsers[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]
      debugger
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
