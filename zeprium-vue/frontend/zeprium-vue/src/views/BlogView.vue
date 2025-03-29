<template>
  <div class="blog">
    <main>
      <section class="blog-hero">
        <div class="container">
          <h1>Our Blog</h1>
          <p class="lead">Thoughts, stories, and ideas from the Zeprium team.</p>
        </div>
      </section>
      
      <section class="blog-content">
        <div class="container">
          <div class="blog-layout">
            <!-- 分类侧边栏 -->
            <div class="blog-sidebar">
              <div class="categories-container">
                <h2>Categories</h2>
                <ul class="categories-list">
                  <li 
                    v-for="category in categories" 
                    :key="category"
                    :class="{ active: selectedCategory === category }"
                    @click="selectCategory(category)"
                  >
                    {{ category }}
                  </li>
                  <li 
                    :class="{ active: selectedCategory === null }"
                    @click="selectCategory(null)"
                  >
                    All Posts
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- 博客列表 -->
            <div class="blog-list">
              <div v-if="isLoading" class="blog-loading">
                <p>Loading posts...</p>
              </div>
              
              <div v-else-if="filteredPosts.length === 0" class="no-posts">
                <p>No posts found in this category. Check back soon!</p>
              </div>
              
              <div v-else class="blog-grid">
                <BlogCard 
                  v-for="post in filteredPosts" 
                  :key="post.id" 
                  :post="post" 
                />
              </div>
              
              <div class="pagination" v-if="filteredPosts.length > 0">
                <button 
                  class="pagination-btn" 
                  :disabled="currentPage === 1"
                  @click="prevPage"
                >
                  Previous
                </button>
                
                <span class="pagination-info">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                
                <button 
                  class="pagination-btn" 
                  :disabled="currentPage === totalPages"
                  @click="nextPage"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import BlogCard from '@/components/blog/BlogCard.vue'

export default {
  name: 'BlogView',
  components: {
    BlogCard
  },
  data() {
    return {
      selectedCategory: null,
      currentPage: 1,
      postsPerPage: 6
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
      let filtered = this.posts;
      
      // 如果选择了分类，则过滤文章
      if (this.selectedCategory) {
        filtered = filtered.filter(post => post.category === this.selectedCategory);
      }
      
      // 分页
      const startIndex = (this.currentPage - 1) * this.postsPerPage;
      const endIndex = startIndex + this.postsPerPage;
      
      return filtered.slice(startIndex, endIndex);
    },
    totalPosts() {
      if (this.selectedCategory) {
        return this.posts.filter(post => post.category === this.selectedCategory).length;
      }
      return this.posts.length;
    },
    totalPages() {
      return Math.ceil(this.totalPosts / this.postsPerPage);
    }
  },
  methods: {
    selectCategory(category) {
      this.selectedCategory = category;
      this.currentPage = 1; // 重置到第一页
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  created() {
    // 获取博客文章
    this.$store.dispatch('blog/fetchPosts');
  }
}
</script>

<style scoped>
.blog {
  /* Blog-specific styles */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

section {
  margin-bottom: 5rem;
  padding: 2rem 0;
}

.blog-hero {
  text-align: center;
  padding: 3rem 0;
  background-color: #f9f9f9;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.lead {
  font-size: 1.5rem;
  margin-bottom: 0;
  color: #666;
}

.blog-layout {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 3rem;
}

/* 侧边栏样式 */
.blog-sidebar {
  padding-top: 1rem;
}

.categories-container {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 0.5rem;
}

.categories-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.categories-list li {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.categories-list li:hover {
  background-color: #eee;
}

.categories-list li.active {
  background-color: #333;
  color: white;
}

/* 博客列表样式 */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.blog-loading,
.no-posts {
  grid-column: 1 / -1;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  text-align: center;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #333;
  color: white;
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

/* 响应式样式 */
@media (max-width: 992px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }
  
  .blog-sidebar {
    margin-bottom: 2rem;
  }
  
  .categories-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .categories-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .categories-list li {
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  .lead {
    font-size: 1.2rem;
  }
  
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style> 