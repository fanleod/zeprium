import axios from 'axios'
import store from '../store'

const http = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 从本地存储获取令牌
    const token = localStorage.getItem('token')
    
    // 如果存在令牌，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 处理常见错误
    if (error.response) {
      switch (error.response.status) {
        case 401: // 未授权
          // 清除令牌并重定向到登录页面
          store.dispatch('auth/logout')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
          
        case 403: // 禁止访问
          console.error('Access forbidden')
          break
          
        case 404: // 未找到
          console.error('Resource not found')
          break
          
        case 500: // 服务器错误
          console.error('Server error')
          break
      }
    } else if (error.request) {
      // 请求已发送但未收到响应
      console.error('Network error')
      store.dispatch('setError', 'Network error. Please check your connection.', { root: true })
    } else {
      // 请求配置有问题
      console.error('Request error', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default http 