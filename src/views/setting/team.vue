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
      <el-divider></el-divider>
      <el-tree
        :data="treeData"
        ref="tree"
        node-key="name"
        :props="defaultProps"
        :check-strictly="false"
        :expand-on-click-node="false"
      ><span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => editNode(data)">
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => deleteNode(node, data)">
            删除
          </el-button>
        </span>
      </span></el-tree>
    </el-card>

    <el-dialog title="编辑" :visible.sync="dialogVisible" class="diaForm">
      <el-form ref="teamForm" :model="formData" :rules="rules" label-width="140px">
        <el-form-item label="上级部门" prop="key">
          <el-select v-model="value" placeholder="请选择组别">
          <el-option
            v-for="item in groupOps"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="description">
          <el-input
            style="width:350px"
            type="text"
            placeholder="请输入名称"
            v-model="formData.description"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="changeRoles('teamForm', editType)">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import setting_api from "@/api/sysSetting";
import { deepClone } from "@/utils";
export default {
  name: "Team",
  data() {
    return {
      list: null,
      listLoading: true,
      filter:{
        group:'',
      },
      groupOps:[],
      dialogVisible: false,
      dialogType: "new",
      formData: {},
      treeData: [],
      defaultProps: {
        label: "label",
        children: "children"
      },
      rules: {
        key: [
          {
            required: true,
            message: "请输入要添加的身份类别",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入名称",
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
    deleteNode(){
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
    },
    editNode(){
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.teamForm.clearValidate();
      });
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.teamForm.clearValidate();
      });
    },
    changeRoles(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
        } else return;
      });
    }
  },
  mounted() {
    this.listLoading = false;
  }
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
