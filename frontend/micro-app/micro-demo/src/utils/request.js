import { message } from 'antd';
import axios from 'axios';

const request = axios.create({
  timeout: 5000,
  baseURL: 'http://localhost:3000',
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前可以添加一些自定义逻辑，比如添加认证头等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 可以在这里处理响应数据
    if (!response.data.success) {
      message.error(response.data.message || '请求失败');
      return Promise.reject(response.data.message || '请求失败');
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
