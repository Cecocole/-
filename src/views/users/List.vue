<template>
    <el-card class="card">
        <!-- 面包屑 -->
      <my-breadcrumb level1="用户管理" level2="用户列表"></my-breadcrumb>
      <el-row class="row">
        <el-col :span="24">
            <el-input v-model="searchValue" style="width:300px" placeholder="请输入内容" clearable>
            <el-button @click.prevent="handleSearch" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button @click="addUserDialogFormVisible = true" type="success" plain>添加用户</el-button>
        </el-col>
      </el-row>
     <el-table
			v-loading="loading"
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
        label="时间">
				<template slot-scope="scope">
					{{ scope.row.create_time | fmtDate('YYYY-MM-DD')}}
				</template>
      </el-table-column>
      <el-table-column
				width="80px"
        label="用户状态">
				<template  slot-scope="scope">
					<!-- 让开关绑定当前用户的mg_state属性	 -->
				<el-switch
					@change="handleChange(scope.row)"
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
						<!-- scope.row 当前这一行绑定的数据对象 -->
						<el-button @click="handleOpenEditDialog(scope.row)" size='mini' type="primary" icon="el-icon-edit" plain></el-button>
  					<el-button @click.prevent="handleDelete(scope.row.id)" size='mini' type="danger" icon="el-icon-delete" plain></el-button>
						<el-button @click="handleOpenSetRoledialog(scope.row)" size='mini' type="success" icon="el-icon-check" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
		<el-pagination
			style="margin-top:15px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 3, 4, 5]"
      :page-size="pagesize"
      layout="total,sizes, prev, pager, next,jumper"
      :total="total">
    </el-pagination>
		<!-- 添加用户的对话框 -->
		<!-- .sync是点x号 -->
	<el-dialog
		title="添加用户"
		 :visible.sync="addUserDialogFormVisible"
		 @close="handleClose">
			<el-form label-width="80px" :model="formData" :rules="rules" ref="form">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="formData.username" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="formData.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="formData.mobile" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
  		<div slot="footer" class="dialog-footer">
    	<el-button @click="addUserDialogFormVisible = false">取 消</el-button>
    	<el-button type="primary" @click="handleAdd">确 定</el-button>
  		</div>
		</el-dialog>
		<!-- 修改用户的对话框 -->
		<el-dialog
		title="修改用户"
		 :visible.sync="editUserDialogFormVisible"
      @close="handleClose">
        <el-form label-width="80px" :model="formData">
          <el-form-item label="用户名">
            <el-input v-model="formData.username" auto-complete="off" readonly disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="formData.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
        </div>
  	  </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
		title="分配角色"
		 :visible.sync="setRoleDialogFormVisible">
        <el-form label-width="100px" :model="formData">
          <el-form-item label="用户名">
            {{ formData.username }}
          </el-form-item>
          <el-form-item label="请选择角色">
            <!-- 下拉框 -->
            <!-- currentRoleId值默认为-1 -->
            <el-select v-model="currentRoleId" placeholder="请选择">
              <el-option
                label="请选择"
                :value="-1" disabled>
              </el-option>
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRole">确 定</el-button>
        </div>
  	  </el-dialog>
    </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      pagenum: 1,
      pagesize: 2,
      total: 0,
      // 绑定搜索文本框
      searchValue: '',
      // 添加用户的对话框
      addUserDialogFormVisible: false,
      editUserDialogFormVisible: false,
      setRoleDialogFormVisible: false,
      // 绑定的表单对象
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表达验证规则
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 绑定下拉框
      currentRoleId: -1,
      // 绑定下拉框的数据
      options: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      // const token = sessionStorage.getItem('token');
      // this.$http.defaults.headers.common['Authorization'] = token;
      this.$http
        .get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`)
        .then((response) => {
          const { meta: { msg, status } } = response.data;
          this.loading = false;
          if (status === 200) {
            this.tableData = response.data.data.users;
            this.total = response.data.data.total;
          } else {
            this.$message.error(msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSizeChange(val) {
      // 页容量发生变化 val页容量
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 当页码发送改变执行
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 搜索功能
    handleSearch() {
      this.loadData();
    },
    // 删除用户
    handleDelete(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const response = await this.$http.delete(`users/${id}`);
        // 获取返回的数据 判断是否成功
        const { meta: { status, msg } } = response.data;
        if (status === 200) {
          // 成功
          this.$message.success(msg);
          // 如果是最后一页 并且只有一条数据 此时删除数据会有问题
          if (this.pagenum > 1 && this.tableData.length === 1) {
            this.pagenum--;
          }
          // 刷新表格
          this.loadData();
        } else {
          // 失败
          this.$message.error(msg);
        }
      }).catch(() => {
        // 点击取消按钮
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 更新状态
    async handleChange(user) {
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 添加用户
    handleAdd() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('验证失败');
          return;
        };
        const response = await this.$http.post('users', this.formData);
        // 获取数据 判断是否添加成功
        const { meta: { status, msg } } = response.data;
        if (status === 201) {
          // 成功
          // 提示
          this.$message.success(msg);
          // 刷新表格
          this.loadData();
          // 关闭对话框
          this.addUserDialogFormVisible = false;
          // 清空文本框
          // this.formData = {}; 会造成内存泄漏 一直创建formData对象
          // 遍历对象的所有属性 把对象的所有属性设置为空
          // for ( let key in this.formData){
          // 	this.formData[key] = '';
          // };
        } else {
          // 失败
          this.$message.error(msg);
        }
      });
    },
    // 关闭对话框 清空文本框
    handleClose() {
      // 清空输入框
      for (let key in this.formData) {
        this.formData[key] = '';
      };
    },
    // 点击编辑按钮，打开修改用户的对话框
    handleOpenEditDialog(user) {
      // 打开修改用户的对话框
      this.editUserDialogFormVisible = true;
      // 设置 formData的值
      this.formData.username = user.username;
      this.formData.email = user.email;
      this.formData.mobile = user.mobile;
      // 点击编辑按钮的时候 记录下用户id 点击确定按钮的时候使用
      this.formData.id = user.id;
    },
    // 点击确定按钮，修改用户信息
    async handleEdit() {
      // users/:id mobile email
      const response = await this.$http.put(`/users/${this.formData.id}`, {
        email: this.formData.email,
        mobile: this.formData.mobile
      });
      const { meta: { status, msg} } = response.data;
      if (status === 200) {
        // 成功
        // 关闭对话框
        this.editUserDialogFormVisible = false;
        // 刷新table
        this.loadData();
        // 提示
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 点击分配角色
    async handleOpenSetRoledialog(user) {
      this.setRoleDialogFormVisible = true;
      this.formData.username = user.username;
      // 发送请求获取所有的角色
      const response = await this.$http.get('roles');
      this.options = response.data.data;
      // 设置当前用户默认的角色
      // 根据用户ID查询用户信息 找到当前用户对应的用户信息
      const res = await this.$http.get(`users/${user.id}`);
      this.currentRoleId = res.data.data.rid;
      // 记录用户id
      this.formData.id = user.id;
    },
    // 设置用户角色
    async handleSetRole() {
      // put users/:id/role 请求体需要rid
      const response = await this.$http.put(`users/${this.formData.id}/role`, {
        rid: this.currentRoleId
      });
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // 成功
        this.$message.success(msg);
        this.setRoleDialogFormVisible = false;
      } else {
        // 失败
        this.$message.error(msg);
      }
    }
  }
};

</script>

<style>
.row {
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>
