<template>
  <div class="app-container">
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
      <el-table-column align="center" label="序号" >
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" align="center"></el-table-column>
      <el-table-column label="更新时间"  prop="updateTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Role',
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods:{

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
