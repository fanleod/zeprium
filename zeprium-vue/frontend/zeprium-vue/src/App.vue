<template>
  <div id="app">
    <!-- 公共导航栏 (非后台页面才显示) -->
    <NavBar v-if="!isAdminRoute" />
    
    <!-- 加载提示 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="hasError" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="close" @click="clearError">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    
    <!-- 路由视图 -->
    <router-view/>
    
    <!-- 公共页脚 (非后台页面才显示) -->
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue'
import Footer from '@/components/common/Footer.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar,
    Footer
  },
  computed: {
    ...mapGetters([
      'isLoading',
      'hasError',
      'error'
    ]),
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    }
  },
  methods: {
    ...mapActions([
      'clearError'
    ])
  },
  created() {
    // 验证用户登录状态
    this.$store.dispatch('auth/verifyToken')
  }
}
</script>

<style>
#app {
  font-family: 'Optima', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 加载提示样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 将内容推到底部的样式 */
main {
  flex: 1;
}

/* 错误提示样式 */
.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}
</style>
