<template>
<div class="login-wrap">
    <el-form
        class="login-form"
        label-width="80px"
        :model="formData">
        <h2>用户登录</h2>
        <el-form-item label="用户名">
            <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input @keyup.enter.native="handleLogin" v-model="formData.password" type="password"></el-input>
        </el-form-item>
            <el-button @click.prevent="handleLogin" class="login-btn" type="primary">登录</el-button>
        <el-form-item>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
// 1.绑定文本框
// 2.给按钮注册事件 发送异步请求
// 3. 登录成功 跳转/提示/记录token

export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    };
  },
  // es7新语法 async await
  methods: {
    // 登录
    async handleLogin() {
      const response = await this.$http.post('login', this.formData);
      // this.$http
      //   .post('/login', this.formData)
      //   .then((response) => {
      // 判断登录是否成功
      // 获取response.data中的msg和status
      const { meta: { msg, status } } = response.data;
      if (status === 200) {
        // 成功
        this.$message.success(msg);
        // 记录token
        sessionStorage.setItem('token', response.data.data.token);
        // 跳转
        this.$router.push('/');
      } else {
        // 失败
        this.$message.error(msg);
      }
    }
    // handleLogin() {
    //   this.$http
    //     .post('/login', this.formData)
    //     .then((response) => {
    //       // 判断登录是否成功
    //       // 获取response.data中的msg和status
    //       const { meta: { msg, status } } = response.data;
    //       if (status === 200) {
    //         // 成功
    //         this.$message.success(msg);
    //         // 记录token
    //         sessionStorage.setItem('token', response.data.data.token);
    //         // 跳转
    //         this.$router.push('/');
    //       } else {
    //         // 失败
    //         this.$message.error(msg);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  }
};
</script>

<style>
.login-wrap{
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-form {
    width: 500px;
    padding: 30px;
    border-radius: 5px;
    background-color: #fff;
}
.login-btn {
    width: 100%;
}
</style>
