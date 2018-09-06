import axios from 'axios';
import { Loading } from 'element-ui';

const MyHtpp = {};
// Vue的插件 必须有一个公共的install方法
MyHtpp.install = function(Vue) {
  // 设置baseURL
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  // 添加请求拦截器
  axios.interceptors.request.use(function(config){
    // 在请求发送之前 添加请求头token
    // 如果当前请求的地址是/login的时候不加token
    // console.log(config);
    // console.log(config.url);
    if (config.url !== 'login') {
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    };
    // const loadingInstance = Loading.service();
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
  // 添加响应拦截器
  axios.interceptors.response.use(function(response){
    // 隐藏加载提示
    // loadingInstance = Loading.close();
    return response;
  }, function (error) {
    return Promise.reject(error);
  });
  Vue.prototype.$http = axios;
};

export default MyHtpp;
