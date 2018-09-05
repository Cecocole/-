<template>
    <el-card class="card">
        <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="row">
        <el-col :span="24">
            <el-input style="width:300px" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain>添加用户</el-button>
        </el-col>
      </el-row>
          <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <!-- 序号列 -->
      <el-table-column
      type="index"
      width="50">
    </el-table-column>
        <!-- 绑定对象的属性 当前显示的列的数据 -->
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="时间">
      </el-table-column>
      <el-table-column
        label="用户状态">
				<template  slot-scope="scope">
					<!-- 让开关绑定当前用户的mg_state属性	 -->
				<el-switch
					v-model="scope.row.mg_state"
					active-color="#13ce66"
					inactive-color="#ff4949">
				</el-switch>
				</template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
            <!-- {{ scope.$index }} -->
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
      tableData: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      const token = sessionStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = token;
      this.$http
        .get('users?pagenum=1&pagesize=10')
        .then((response) => {
          const { meta: { msg, status } } = response.data;
          if (status === 200) {
            this.tableData = response.data.data.users;
          } else {
            this.$message.error(msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
.card {
    height: 100%;
}

.row {
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>
