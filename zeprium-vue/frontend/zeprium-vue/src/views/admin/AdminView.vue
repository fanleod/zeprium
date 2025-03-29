<template>
  <div class="admin">
    <div class="admin-layout">
      <!-- 侧边栏 -->
      <aside class="admin-sidebar">
        <div class="admin-logo">
          <router-link to="/" class="logo-link">
            <h1>Zeprium</h1>
          </router-link>
        </div>
        
        <nav class="admin-nav">
          <ul class="nav-list">
            <li>
              <router-link to="/admin" class="nav-link" exact>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                <span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/posts" class="nav-link">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2z"/>
                </svg>
                <span>Blog Posts</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/media" class="nav-link">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6H0v5h.01L0 20c0 1.1.9 2 2 2h18v-2H2V6zm20-2h-8l-2-2H6c-1.1 0-1.99.9-1.99 2L4 16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7 15l4.5-6 3.5 4.51 2.5-3.01L21 15H7z"/>
                </svg>
                <span>Media</span>
              </router-link>
            </li>
          </ul>
        </nav>
        
        <div class="admin-logout">
          <button @click="logout" class="logout-btn">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <!-- 主内容区 -->
      <main class="admin-main">
        <header class="admin-header">
          <h2 class="page-title">Dashboard</h2>
          <div class="user-info">
            <span class="welcome-text">Welcome, Admin</span>
          </div>
        </header>
        
        <div class="admin-content">
          <div class="dashboard-grid">
            <!-- 博客统计卡片 -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Blog Statistics</h3>
              </div>
              <div class="card-body">
                <div class="stat-grid">
                  <div class="stat-item">
                    <span class="stat-number">{{ posts.length }}</span>
                    <span class="stat-label">Total Posts</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ categories.length }}</span>
                    <span class="stat-label">Categories</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ featuredPosts.length }}</span>
                    <span class="stat-label">Featured</span>
                  </div>
                </div>
                <router-link to="/admin/posts" class="dashboard-link">Manage Posts</router-link>
              </div>
            </div>
            
            <!-- 媒体统计卡片 -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Media Statistics</h3>
              </div>
              <div class="card-body">
                <div class="stat-grid">
                  <div class="stat-item">
                    <span class="stat-number">{{ mediaFiles.length }}</span>
                    <span class="stat-label">Total Files</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ imageFiles.length }}</span>
                    <span class="stat-label">Images</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ videoFiles.length }}</span>
                    <span class="stat-label">Videos</span>
                  </div>
                </div>
                <router-link to="/admin/media" class="dashboard-link">Manage Media</router-link>
              </div>
            </div>
            
            <!-- 最近活动卡片 -->
            <div class="dashboard-card full-width">
              <div class="card-header">
                <h3>Recent Activity</h3>
              </div>
              <div class="card-body">
                <div v-if="recentPosts.length === 0" class="empty-state">
                  <p>No recent activity to display.</p>
                </div>
                <ul v-else class="activity-list">
                  <li v-for="post in recentPosts" :key="post.id" class="activity-item">
                    <div class="activity-icon">
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
                      </svg>
                    </div>
                    <div class="activity-content">
                      <div class="activity-title">
                        <span>Post Created: </span>
                        <strong>{{ post.title }}</strong>
                      </div>
                      <div class="activity-meta">
                        <span>{{ formatDate(post.createdAt) }}</span>
                      </div>
                    </div>
                    <div class="activity-actions">
                      <router-link :to="`/admin/posts/edit/${post.id}`" class="action-link">
                        Edit
                      </router-link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AdminView',
  computed: {
    ...mapGetters({
      posts: 'blog/posts',
      categories: 'blog/categories',
      featuredPosts: 'blog/featuredPosts',
      mediaFiles: 'media/mediaFiles'
    }),
    recentPosts() {
      // 获取最近5篇帖子
      return [...this.posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    },
    imageFiles() {
      return this.mediaFiles.filter(file => file.type.startsWith('image/'));
    },
    videoFiles() {
      return this.mediaFiles.filter(file => file.type.startsWith('video/'));
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  created() {
    // 加载数据
    this.$store.dispatch('blog/fetchPosts');
    this.$store.dispatch('media/fetchMedia');
  }
}
</script>

<style scoped>
.admin {
  height: 100vh;
  background-color: #f5f7fa;
}

.admin-layout {
  display: flex;
  height: 100%;
}

/* 侧边栏样式 */
.admin-sidebar {
  width: 250px;
  background-color: #333;
  color: white;
  display: flex;
  flex-direction: column;
}

.admin-logo {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-link {
  color: white;
  text-decoration: none;
}

.admin-logo h1 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

.admin-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-link svg {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  fill: currentColor;
}

.admin-logout {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  border-radius: 0.25rem;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.logout-btn svg {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  fill: currentColor;
}

/* 主内容区样式 */
.admin-main {
  flex: 1;
  overflow: auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
}

.welcome-text {
  font-weight: 500;
}

.admin-content {
  padding: 2rem;
}

/* 仪表板卡片样式 */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.full-width {
  grid-column: 1 / -1;
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.card-body {
  padding: 1.5rem;
}

/* 统计数据样式 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.dashboard-link {
  display: block;
  text-align: center;
  padding: 0.75rem;
  background-color: #f5f7fa;
  color: #333;
  text-decoration: none;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.dashboard-link:hover {
  background-color: #eee;
}

/* 活动列表样式 */
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 50%;
  margin-right: 1rem;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
  fill: #333;
}

.activity-content {
  flex: 1;
}

.activity-title {
  margin-bottom: 0.25rem;
}

.activity-meta {
  font-size: 0.85rem;
  color: #666;
}

.activity-actions {
  margin-left: 1rem;
}

.action-link {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background-color: #f5f7fa;
  color: #333;
  text-decoration: none;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.action-link:hover {
  background-color: #eee;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: #666;
}

/* 响应式样式 */
@media (max-width: 992px) {
  .admin-sidebar {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    height: auto;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
  }
  
  .stat-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style> 