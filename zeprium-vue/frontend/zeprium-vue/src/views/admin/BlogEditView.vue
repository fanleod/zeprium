<template>
  <div class="blog-edit">
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
          <h2 class="page-title">{{ isEditing ? 'Edit Post' : 'Create Post' }}</h2>
          <div class="header-actions">
            <button class="btn btn-secondary" @click="$router.push('/admin/posts')">
              Cancel
            </button>
          </div>
        </header>
        
        <div class="admin-content">
          <div v-if="isLoading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading post data...</p>
          </div>
          
          <form v-else @submit.prevent="savePost" class="post-form">
            <div class="form-grid">
              <div class="form-main">
                <div class="form-group">
                  <label for="title">Title</label>
                  <input 
                    type="text" 
                    id="title" 
                    v-model="form.title" 
                    class="form-control"
                    placeholder="Enter post title"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="content">Content</label>
                  <textarea 
                    id="content" 
                    v-model="form.content" 
                    class="form-control content-editor"
                    placeholder="Write your post content here..."
                    rows="15"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div class="form-sidebar">
                <div class="sidebar-card">
                  <h3>Post Settings</h3>
                  
                  <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" v-model="form.category" class="form-control">
                      <option value="">Select a category</option>
                      <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                      </option>
                      <option value="new">+ Add New Category</option>
                    </select>
                  </div>
                  
                  <div v-if="form.category === 'new'" class="form-group">
                    <label for="newCategory">New Category</label>
                    <input 
                      type="text" 
                      id="newCategory" 
                      v-model="newCategory" 
                      class="form-control"
                      placeholder="Enter new category name"
                    >
                  </div>
                  
                  <div class="form-group">
                    <label for="tags">Tags</label>
                    <input 
                      type="text" 
                      id="tags" 
                      v-model="tagsInput" 
                      class="form-control"
                      placeholder="Enter tags separated by commas"
                    >
                    <small class="form-text">Separate tags with commas</small>
                  </div>
                  
                  <div class="form-group">
                    <label for="imageUrl">Featured Image URL</label>
                    <input 
                      type="text" 
                      id="imageUrl" 
                      v-model="form.imageUrl" 
                      class="form-control"
                      placeholder="Enter image URL or select from media"
                    >
                    <button type="button" class="btn btn-secondary btn-sm mt-2" @click="openMediaLibrary">
                      Select from Media Library
                    </button>
                  </div>
                  
                  <div class="form-group form-checkbox">
                    <input type="checkbox" id="featured" v-model="form.featured">
                    <label for="featured">Featured Post</label>
                  </div>
                </div>
                
                <div class="sidebar-actions">
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post') }}
                  </button>
                  
                  <button v-if="isEditing" type="button" class="btn btn-danger mt-4" @click="confirmDelete">
                    Delete Post
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
    
    <!-- Media Library Modal -->
    <div v-if="showMediaLibrary" class="modal-overlay" @click="closeMediaLibrary">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>Media Library</h3>
          <button class="modal-close" @click="closeMediaLibrary">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div v-if="mediaLoading" class="loading-spinner"></div>
          
          <div v-else-if="mediaFiles.length === 0" class="empty-state">
            <p>No media files found. Upload some images first.</p>
          </div>
          
          <div v-else class="media-grid">
            <div 
              v-for="file in mediaFiles" 
              :key="file.id" 
              class="media-item"
              :class="{ selected: selectedMedia === file.url }"
              @click="selectMedia(file.url)"
            >
              <img :src="file.url" :alt="file.name">
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeMediaLibrary">Cancel</button>
          <button class="btn btn-primary" @click="useSelectedMedia" :disabled="!selectedMedia">
            Use Selected Image
          </button>
        </div>
      </div>
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
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
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
  name: 'BlogEditView',
  data() {
    return {
      form: {
        title: '',
        content: '',
        category: '',
        featured: false,
        imageUrl: '',
        tags: []
      },
      tagsInput: '',
      newCategory: '',
      isSaving: false,
      isDeleting: false,
      showMediaLibrary: false,
      selectedMedia: null,
      mediaLoading: false,
      showDeleteConfirm: false
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading
    }),
    ...mapGetters({
      getPostById: 'blog/post',
      categories: 'blog/categories',
      mediaFiles: 'media/mediaFiles'
    }),
    postId() {
      return this.$route.params.id;
    },
    isEditing() {
      return !!this.postId;
    }
  },
  methods: {
    loadPost() {
      if (this.isEditing) {
        this.$store.dispatch('blog/fetchPost', this.postId).then(() => {
          const post = this.getPostById(this.postId);
          if (post) {
            this.form = { ...post };
            this.tagsInput = post.tags ? post.tags.join(', ') : '';
          }
        });
      }
    },
    async savePost() {
      this.isSaving = true;
      
      try {
        // 处理新分类
        if (this.form.category === 'new' && this.newCategory) {
          this.form.category = this.newCategory;
        }
        
        // 处理标签
        if (this.tagsInput) {
          this.form.tags = this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        } else {
          this.form.tags = [];
        }
        
        if (this.isEditing) {
          // 更新文章
          await this.$store.dispatch('blog/updatePost', {
            id: this.postId,
            post: this.form
          });
          
          this.$router.push('/admin/posts');
        } else {
          // 创建新文章
          await this.$store.dispatch('blog/createPost', this.form);
          
          this.$router.push('/admin/posts');
        }
      } catch (error) {
        console.error('Error saving post:', error);
        // 这里可以添加错误处理UI
      } finally {
        this.isSaving = false;
      }
    },
    async deletePost() {
      this.isDeleting = true;
      
      try {
        await this.$store.dispatch('blog/deletePost', this.postId);
        this.$router.push('/admin/posts');
      } catch (error) {
        console.error('Error deleting post:', error);
        // 这里可以添加错误处理UI
      } finally {
        this.isDeleting = false;
        this.showDeleteConfirm = false;
      }
    },
    confirmDelete() {
      this.showDeleteConfirm = true;
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
    },
    openMediaLibrary() {
      this.showMediaLibrary = true;
      this.selectedMedia = null;
      this.mediaLoading = true;
      
      this.$store.dispatch('media/fetchMedia').then(() => {
        this.mediaLoading = false;
      }).catch(error => {
        console.error('Error loading media:', error);
        this.mediaLoading = false;
      });
    },
    closeMediaLibrary() {
      this.showMediaLibrary = false;
    },
    selectMedia(url) {
      this.selectedMedia = url;
    },
    useSelectedMedia() {
      if (this.selectedMedia) {
        this.form.imageUrl = this.selectedMedia;
        this.closeMediaLibrary();
      }
    },
    logout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  created() {
    this.loadPost();
    this.$store.dispatch('blog/fetchPosts');
  }
}
</script>

<style scoped>
.blog-edit {
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

/* 表单布局 */
.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.form-main {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.form-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.sidebar-card h3 {
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
}

/* 表单元素 */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #333;
}

.content-editor {
  min-height: 300px;
  resize: vertical;
}

.form-text {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

.form-checkbox {
  display: flex;
  align-items: center;
}

.form-checkbox label {
  margin: 0 0 0 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

/* 媒体库模态框 */
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
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.delete-modal {
  max-width: 500px;
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
  overflow: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.media-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 0.25rem;
  cursor: pointer;
  position: relative;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-item.selected {
  border-color: #333;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

/* 响应式样式 */
@media (max-width: 992px) {
  .admin-sidebar {
    width: 200px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
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
  
  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style> 