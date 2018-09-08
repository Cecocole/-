import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/users/List';
import Rights from '@/views/rights/Rights';
import Roles from '@/views/rights/Roles';
import { Message } from 'element-ui';

Vue.use(Router);

const router = new Router({
  routes: [
    {name: 'login', path: '/login', component: Login},
    {name: 'Home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },{
          name:'roles',
          path: '/roles',
          component: Roles
        }
      ]
    }
  ]
});

// 设置路由的前置守卫 (路由跳转之前)
router.beforeEach((to, from, next) => {
  // 判断有没有token
  if (to.name === 'login') {
    next();
  }else {
    //判断有没有token
    const token = sessionStorage.getItem('token');
    if (token) {
      next();
    }else {
      // 没有token跳转到登录
      // this不是vue的实例
      // this.$router.push('/login')
      router.push('/login');
      // 提示
      // this不是vue的实例
      // this.$message.warning()
      Message.warning('请先登录');
    }
  }
})

export default router;
