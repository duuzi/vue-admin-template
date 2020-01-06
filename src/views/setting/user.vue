<template>
  <div class="app-container">
    <el-card>
      <div class="filter-container">
        <el-select v-model="filter.group" placeholder="请选择组别">
          <el-option
            v-for="item in groupOps"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input placeholder="请输入" class="filter-item" style="width: 200px;"></el-input>
        <el-button @click="search" type="primary" icon="el-icon-search" style="margin-left:20px">搜索</el-button>
        <el-button @click="handleAdd" type="primary" icon="el-icon-plus" style="margin-left:20px">新增</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" prop="accountName" align="center" width="60">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column label="姓名" prop="accountName" align="center"></el-table-column>
        <el-table-column label="工号" prop="accountNo" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="mail" align="center"></el-table-column>
        <el-table-column label="组别" prop="group" align="center"></el-table-column>
        <el-table-column label="角色" prop="role" align="center"></el-table-column>
        <el-table-column label="对应机型" prop="model" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary"  @click="handleEdit(scope)"> 编辑 </el-link>
            <el-link type="danger" @click="handleDelete(scope)"> 删除 </el-link>
            <!-- <el-button type="text" size="small" @click="handleEdit(scope)">Edit</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope)">Delete</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="用户编辑" :visible.sync="dialogVisible" class="diaForm">
      <el-form ref="userForm" :model="formData" :rules="rules" label-width="140px">
        <el-form-item label="姓名" prop="accountname">
          <el-input
            style="width:350px"
            type="text"
            placeholder="请输入姓名"
            v-model="formData.accountname"
          ></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="accountno">
          <el-input
            style="width:350px"
            type="text"
            placeholder="请输入工号"
            v-model="formData.accountno"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input style="width:350px" type="text" placeholder="请输入邮箱" v-model="formData.mail"></el-input>
        </el-form-item>
        <el-form-item label="所属组" prop="group">
          <el-select v-model="formData.group" placeholder="请选择">
            <el-option
              v-for="item in groupOps"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择">
            <el-option
              v-for="item in roleOps"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeUsers('userForm', editType)">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import setting_api from "@/api/setting";
import { deepClone } from "@/utils";
export default {
  name: "User",
  data() {
    return {
      list: null,
      listLoading: true,
      filter:{
        group:null
      },
      dialogVisible: false,
      dialogType: "new",
      formData: {},
      treeData: [],
      //group可选
      groupOps: [{label:"111",value:"1"}],
      roleOps: [{label:"admin",value:"1"},{label:"user",value:"2"}],
      defaultProps: {
        label: "label",
        children: "children"
      },
      rules: {
        accountno: [
          {
            required: true,
            message: "请输入工号",
            trigger: "blur"
          }
        ],
        accountname: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        mail: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur"
          }
        ],
        group: [
          {
            required: true,
            message: "请选择所属组",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    ...mapGetters(["name"])
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      setting_api.getRoleList().then(response => {
        this.list = response.data.items;
        this.listLoading = false;
      });
      setting_api.getMenuList().then(res => {
        this.treeData = res.data.items;
      });
    },
    search(){
      this.fetchData()
    },
    handleAdd(){
      this.dialogType = "add";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate();
      });
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate();
      });
    },
    changeUsers(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
        } else return;
      });
    },
    handleDelete() {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }
  },
  mounted() {
    this.listLoading = false;
  }
};
</script>


