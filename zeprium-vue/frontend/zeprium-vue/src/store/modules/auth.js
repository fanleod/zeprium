import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user') || 'null')
}

const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user
}

const mutations = {
  AUTH_SUCCESS(state, { token, user }) {
    state.token = token
    state.user = user
  },
  AUTH_LOGOUT(state) {
    state.token = ''
    state.user = null
  }
}

const actions = {
  // 登录
  async login({ commit, dispatch }, credentials) {
    try {
      dispatch('setLoading', true, { root: true })
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials)
      
      const { token } = response.data
      
      // 保存令牌
      localStorage.setItem('token', token)
      
      // 设置 axios 默认请求头
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // 获取用户信息
      const userResponse = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const user = userResponse.data.user
      
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(user))
      
      commit('AUTH_SUCCESS', { token, user })
      
      return response.data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Authentication failed', { root: true })
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // 验证令牌
  async verifyToken({ commit, dispatch }) {
    const token = localStorage.getItem('token')
    
    if (!token) return false
    
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const user = response.data.user
      
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(user))
      
      // 更新 axios 默认请求头
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      commit('AUTH_SUCCESS', { token, user })
      
      return true
    } catch (error) {
      dispatch('logout')
      return false
    }
  },
  
  // 登出
  logout({ commit }) {
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // 清除 axios 默认请求头
    delete axios.defaults.headers.common['Authorization']
    
    // 更新 state
    commit('AUTH_LOGOUT')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 