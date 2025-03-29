<template>
  <header class="site-header">
    <div class="logo-container">
      <router-link to="/">
        <img src="@/assets/images/zeprium-logo.png" alt="Zeprium Logo" class="site-logo" />
      </router-link>
    </div>
    <nav class="main-nav">
      <ul>
        <li>
          <router-link to="/" exact>Home</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
        <li>
          <router-link to="/blog">Blog</router-link>
        </li>
        <li>
          <router-link to="/contact">Contact</router-link>
        </li>
        <!-- 管理员菜单项 -->
        <li v-if="isAuthenticated">
          <router-link to="/admin" class="admin-link">Admin</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated'
    })
  }
}
</script>

<style scoped>
.site-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logo-container {
  margin-bottom: 1.5rem;
}

.site-logo {
  max-width: 150px;
  height: auto;
}

.main-nav ul {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.main-nav li {
  margin: 0 1.5rem;
}

.main-nav a {
  text-decoration: none;
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.main-nav a:hover,
.main-nav a.router-link-active {
  color: #000;
}

.main-nav a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.main-nav a:hover::after,
.main-nav a.router-link-active::after {
  transform: scaleX(1);
}

.admin-link {
  color: #4a90e2 !important;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .main-nav ul {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-nav li {
    margin: 0.5rem 1rem;
  }
}
</style> 