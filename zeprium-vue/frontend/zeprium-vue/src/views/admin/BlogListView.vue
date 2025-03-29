<template>
  <div class="blog-list-admin">
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
              <router-link to="/admin" class="nav-link">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                <span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link to="/admin/posts" class="nav-link" exact>
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
          <h2 class="page-title">Blog Posts</h2>
          <div class="header-actions">
            <router-link to="/admin/posts/new" class="btn btn-primary">
              Add New Post
            </router-link>
          </div>
        </header>
        
        <div class="admin-content">
          <div class="content-header">
            <div class="search-filter">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search posts..." 
                class="search-input"
                @input="filterPosts"
              >
              
              <select v-model="categoryFilter" class="filter-select" @change="filterPosts">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>
          
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading posts...</p>
          </div>
          
          <div v-else>
            <div v-if="filteredPosts.length === 0" class="empty-state">
              <p v-if="searchQuery || categoryFilter">No posts match your search criteria.</p>
              <p v-else>No posts found. Start by creating your first blog post.</p>
              <router-link to="/admin/posts/new" class="btn btn-primary">
                Create New Post
              </router-link>
            </div>
            
            <table v-else class="posts-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in paginatedPosts" :key="post.id">
                  <td class="post-title-cell">
                    <div class="post-thumbnail" v-if="post.imageUrl">
                      <img :src="post.imageUrl" :alt="post.title">
                    </div>
                    <div class="post-title">
                      <router-link :to="`/admin/posts/edit/${post.id}`">{{ post.title }}</router-link>
                    </div>
                  </td>
                  <td>{{ post.category || 'Uncategorized' }}</td>
                  <td>{{ formatDate(post.createdAt) }}</td>
                  <td>
                    <button 
                      class="feature-toggle" 
                      :class="{ featured: post.featured }"
                      @click="toggleFeatured(post)"
                      :disabled="isUpdating"
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    </button>
                  </td>
                  <td class="actions-cell">
                    <div class="post-actions">
                      <router-link :to="`/admin/posts/edit/${post.id}`" class="action-btn edit-btn">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                        <span>Edit</span>
                      </router-link>
                      
                      <router-link :to="`/blog/${post.id}`" class="action-btn view-btn" target="_blank">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        <span>View</span>
                      </router-link>
                      
                      <button class="action-btn delete-btn" @click="confirmDelete(post)">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- 分页 -->
            <div class="pagination" v-if="totalPages > 1">
              <button 
                class="pagination-btn" 
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                Previous
              </button>
              
              <div class="pagination-info">
                Page {{ currentPage }} of {{ totalPages }}
              </div>
              
              <button 
                class="pagination-btn" 
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="cancelDelete">
      <div class="modal-container delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete</h3>
          <button class="modal-close" @click="cancelDelete">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <p>Are you sure you want to delete the post "<strong>{{ postToDelete?.title }}</strong>"?</p>
          <p>This action cannot be undone.</p>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="cancelDelete">Cancel</button>
          <button class="btn btn-danger" @click="deletePost" :disabled="isDeleting">
            {{ isDeleting ? 'Deleting...' : 'Delete Post' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'BlogListView',
  data() {
    return {
      searchQuery: '',
      categoryFilter: '',
      isUpdating: false,
      isDeleting: false,
      showDeleteConfirm: false,
      postToDelete: null,
      currentPage: 1,
      postsPerPage: 10
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading
    }),
    ...mapGetters({
      posts: 'blog/posts',
      categories: 'blog/categories'
    }),
    filteredPosts() {
      let filtered = [...this.posts];
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(query) || 
          (post.content && post.content.toLowerCase().includes(query))
        );
      }
      
      // 分类过滤
      if (this.categoryFilter) {
        filtered = filtered.filter(post => post.category === this.categoryFilter);
      }
      
      // 按日期排序（最新的先显示）
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    paginatedPosts() {
      const startIndex = (this.currentPage - 1) * this.postsPerPage;
      const endIndex = startIndex + this.postsPerPage;
      return this.filteredPosts.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredPosts.length / this.postsPerPage);
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Unknown';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },
    async toggleFeatured(post) {
      this.isUpdating = true;
      
      try {
        await this.$store.dispatch('blog/toggleFeaturedPost', post.id);
      } catch (error) {
        console.error('Error toggling featured status:', error);
      } finally {
        this.isUpdating = false;
      }
    },
    filterPosts() {
      // 重置为第一页
      this.currentPage = 1;
    },
    confirmDelete(post) {
      this.postToDelete = post;
      this.showDeleteConfirm = true;
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.postToDelete = null;
    },
    async deletePost() {
      if (!this.postToDelete) return;
      
      this.isDeleting = true;
      
      try {
        await this.$store.dispatch('blog/deletePost', this.postToDelete.id);
        this.showDeleteConfirm = false;
        this.postToDelete = null;
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        this.isDeleting = false;
      }
    },
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  created() {
    this.$store.dispatch('blog/fetchPosts');
  },
  watch: {
    currentPage() {
      // 滚动到页面顶部
      window.scrollTo(0, 0);
    }
  }
}
</script>

<style scoped>
.blog-list-admin {
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

.admin-content {
  padding: 2rem;
}

/* 内容头部样式 */
.content-header {
  margin-bottom: 2rem;
}

.search-filter {
  display: flex;
  gap: 1rem;
}

.search-input, .filter-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input {
  flex: 1;
}

.search-input:focus, .filter-select:focus {
  outline: none;
  border-color: #333;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 3rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 表格样式 */
.posts-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.posts-table th, .posts-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.posts-table th {
  background-color: #f9f9f9;
  font-weight: 500;
}

.posts-table tr:last-child td {
  border-bottom: none;
}

.post-title-cell {
  display: flex;
  align-items: center;
}

.post-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-title a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.post-title a:hover {
  color: #000;
  text-decoration: underline;
}

/* 特色帖子切换按钮 */
.feature-toggle {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-toggle svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.feature-toggle.featured {
  color: #ffc107;
}

.feature-toggle:hover:not(.featured):not(:disabled) {
  color: #aaa;
}

.feature-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 帖子操作样式 */
.post-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  text-decoration: none;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
  margin-right: 0.25rem;
}

.edit-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.view-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.delete-btn:hover {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: #666;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 1.5rem;
  font-size: 0.95rem;
  color: #666;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.modal-content {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

/* 响应式样式 */
@media (max-width: 992px) {
  .admin-sidebar {
    width: 200px;
  }
  
  .search-filter {
    flex-direction: column;
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
  
  .posts-table {
    display: block;
    overflow-x: auto;
  }
  
  .post-actions {
    flex-direction: column;
  }
}
</style> 