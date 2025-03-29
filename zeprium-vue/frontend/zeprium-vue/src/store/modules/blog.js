import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const state = {
  posts: [],
  post: null,
  categories: []
}

const getters = {
  allPosts: state => state.posts,
  post: state => state.post,
  featuredPosts: state => state.posts.filter(post => post.featured),
  categories: state => state.categories,
  postsByCategory: state => category => state.posts.filter(post => post.category === category)
}

const mutations = {
  SET_POSTS(state, posts) {
    state.posts = posts
  },
  SET_POST(state, post) {
    state.post = post
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  ADD_POST(state, post) {
    state.posts.push(post)
  },
  UPDATE_POST(state, updatedPost) {
    const index = state.posts.findIndex(post => post.id === updatedPost.id)
    if (index !== -1) {
      state.posts.splice(index, 1, updatedPost)
    }
    if (state.post && state.post.id === updatedPost.id) {
      state.post = updatedPost
    }
  },
  DELETE_POST(state, id) {
    state.posts = state.posts.filter(post => post.id !== id)
    if (state.post && state.post.id === id) {
      state.post = null
    }
  }
}

const actions = {
  // 获取所有博客文章
  async fetchPosts({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      
      const response = await axios.get(`${API_URL}/blog`)
      
      commit('SET_POSTS', response.data.data)
      
      // 提取分类
      const uniqueCategories = [...new Set(response.data.data.map(post => post.category))]
      commit('SET_CATEGORIES', uniqueCategories)
      
      return response.data.data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to fetch blog posts', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // 获取单个博客文章
  async fetchPost({ commit, dispatch }, id) {
    try {
      dispatch('setLoading', true, { root: true })
      
      const response = await axios.get(`${API_URL}/blog/${id}`)
      
      commit('SET_POST', response.data.data)
      
      return response.data.data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to fetch blog post', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // 创建新博客文章
  async createPost({ commit, dispatch }, postData) {
    try {
      dispatch('setLoading', true, { root: true })
      
      const response = await axios.post(`${API_URL}/blog`, postData)
      
      commit('ADD_POST', response.data.data)
      
      return response.data.data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to create blog post', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // 更新博客文章
  async updatePost({ commit, dispatch }, { id, postData }) {
    try {
      dispatch('setLoading', true, { root: true })
      
      const response = await axios.put(`${API_URL}/blog/${id}`, postData)
      
      commit('UPDATE_POST', response.data.data)
      
      return response.data.data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to update blog post', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // 删除博客文章
  async deletePost({ commit, dispatch }, id) {
    try {
      dispatch('setLoading', true, { root: true })
      
      await axios.delete(`${API_URL}/blog/${id}`)
      
      commit('DELETE_POST', id)
      
      return id
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to delete blog post', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // 将文章设置为特色
  async toggleFeaturedPost({ dispatch }, { id, featured }) {
    try {
      dispatch('setLoading', true, { root: true })
      
      const response = await axios.put(`${API_URL}/blog/${id}`, { featured })
      
      return response.data.data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to update post featured status', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
} 