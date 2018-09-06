<template>
  <el-card class="card">
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-button style="margin-top:10px;margin-bottom:10px">添加角色</el-button>
    <!-- 表格 -->
    <el-table
      border
      stripe
      :data="tableData"
      style="width: 100%">
      <!-- 展开行 -->
      <el-table-column type="expand">
          <template slot-scope="scope">
              <!-- 一级权限 -->
              <el-row v-for="level1 in scope.row.children"
              :key="level1.id">
                  <el-col :span="4">
                      <!-- 显示一级权限名字 -->
                      <el-tag 
                      closable
                      @close="handleClose(scope.row,level1.id)">
                        {{ level1.authName}}
                      </el-tag>
                  </el-col>
                  <el-col :span="20">
                      <el-row v-for="level2 in level1.children"
                      :key="level2.id">
                          <el-col :span="4">
                              <!-- 显示二级权限名称 -->
                              <el-tag 
                              closable
                              type="success"
                              @close="handleClose(scope.row,level2.id)">
                                  {{ level2.authName }}
                              </el-tag>
                          </el-col>
                          <el-col :span="20">
                              <el-tag
                              @close="handleClose(scope.row,level3.id)"
                              class="level3"
                              closable
                              type="warning"
                              v-for="level3 in level2.children"
                              :key="level3.id">
                                {{ level3.authName }}
                              </el-tag>
                          </el-col>
                      </el-row>
                  </el-col>
              </el-row>
              <!-- 未分配权限 -->
              <el-row v-if="scope.row.children.length === 0">
                  <el-col :span="24">未分配权限</el-col>
              </el-row>
          </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="60">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="300">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <el-button size='mini' type="primary" icon="el-icon-edit" plain></el-button>
  			<el-button  size='mini' type="danger" icon="el-icon-delete" plain></el-button>
			<el-button  size='mini' type="success" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
    data() {
        return {
            tableData:[]
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        // 加载表格数据
        async loadData() {
            const response = await this.$http.get('roles');
            const { meta: { msg, status} } = response.data;
            if (status === 200) {
                this.tableData = response.data.data;
            } else {
                this.$message.error(msg)
            }
        },
        // 删除当前角色对应的权限
        handleClose(role, rightId) {
            // role 当前行对应的角色对象
            alert(rightId)
            // rightId 当前权限的ID
        }
    }
};
</script>

<style>
.card {
    height: 100%;
    overflow: auto;
}

.level3 {
    margin-right: 3px;
    margin-bottom: 5px;
}
</style>
