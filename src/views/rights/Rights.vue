<template>
    <el-card class="card">
        <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
        <!-- 表格 -->
        <el-table
        border
        stripe
        :data="tableData"
        style="width: 100%;margin-top:15px">
        <el-table-column
            type="index"
            width="60">
        </el-table-column>
        <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="path"
            label="路径"
            width="180">
        </el-table-column>
        <el-table-column
            prop="level"
            label="层级">
            <template slot-scope="scope">
                <span v-if="scope.row.level === '0'">一级</span>
                <span v-else-if="scope.row.level === '1'">二级</span>
                <span v-else-if="scope.row.level === '2'">三级</span>
            </template>
        </el-table-column>
    </el-table>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const response = await this.$http.get('rights/list');
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style scoped>
/* scoped html5中提供的内容
   作用的范围 
   当前写的样式作用的范围：当前的组件内
 */

</style>
