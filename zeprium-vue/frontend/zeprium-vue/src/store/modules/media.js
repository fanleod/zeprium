import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const state = {
  mediaFiles: []
}

const getters = {
  getAllMedia: state => state.mediaFiles,
  getMediaByType: state => type => state.mediaFiles.filter(file => file.type === type)
}

const mutations = {
  SET_MEDIA(state, media) {
    state.mediaFiles = media
  },
  ADD_MEDIA(state, media) {
    state.mediaFiles.push(media)
  },
  DELETE_MEDIA(state, { type, name }) {
    state.mediaFiles = state.mediaFiles.filter(
      file => !(file.type === type && file.name === name)
    )
  }
}

const actions = {
  // 获取所有媒体文件
  async fetchMedia({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      
      const response = await axios.get(`${API_URL}/media`)
      
      commit('SET_MEDIA', response.data.data)
      
      return response.data.data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to fetch media files', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // 上传媒体文件
  async uploadMedia({ commit, dispatch }, file) {
    try {
      dispatch('setLoading', true, { root: true })
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      commit('ADD_MEDIA', response.data.data)
      
      return response.data.data
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to upload media file', { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },
  
  // 删除媒体文件
  async deleteMedia({ commit, dispatch }, { type, filename }) {
    try {
      dispatch('setLoading', true, { root: true })
      
      await axios.delete(`${API_URL}/media/${type}/${filename}`)
      
      commit('DELETE_MEDIA', { type, name: filename })
      
      return { type, filename }
    } catch (error) {
      dispatch('setError', error.response?.data?.message || 'Failed to delete media file', { root: true })
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