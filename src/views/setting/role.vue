<template>
  <div class="app-container">
    <el-card>
    <div class="filter-container">
      <el-input placeholder="请输入" class="filter-item" style="width: 200px;"></el-input>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
      <el-table-column label="角色说明" prop="roleDesc" align="center"></el-table-column>
      <el-table-column label="更新时间"  prop="updateTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>

    <el-dialog title="权限编辑" :visible.sync="dialogVisible" class="diaForm">
      <el-form
        ref="rolesForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="角色" prop="key">
          <el-input
            style="width:350px"
            type="text"
            placeholder="请输入要添加的角色"
            v-model="formData.key"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input
            style="width:350px"
            type="text"
            placeholder="请输入相关说明"
            v-model="formData.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            :data="treeData"
            ref="tree"
            node-key="name"
            :props="defaultProps"
            show-checkbox
            :check-strictly="false"
          ></el-tree> 
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeRoles('rolesForm', editType)">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
  
</template>

<script>
import { mapGetters } from 'vuex';
import role_api from '@/api/table'
import { deepClone } from '@/utils'
export default {
  name: 'Role',
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      formData: {},
      treeData: [],
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      rules: {
        key: [
          {
            required: true,
            message: '请输入要添加的身份类别',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入相关说明',
            trigger: 'blur'
          }
        ]
      },
    }
  },
  created(){
    this.fetchData()
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods:{
    
    fetchData() {
      this.listLoading = true
      role_api.getRoleList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
      role_api.getMenuList().then(res=>{
        this.treeData = res.data.items
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.rolesForm.clearValidate()
      })
    },
    changeRoles(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          
        } else return
      })
    },
  },
  mounted(){
    this.listLoading = false
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
