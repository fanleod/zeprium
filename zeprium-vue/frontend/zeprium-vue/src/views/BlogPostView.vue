<template>
  <div class="blog-post">
    <main>
      <div v-if="isLoading" class="loading-container container">
        <p>Loading article...</p>
      </div>
      
      <template v-else-if="post">
        <!-- 文章头部 -->
        <section class="post-header">
          <div class="container">
            <div class="post-meta">
              <span class="post-category" v-if="post.category">{{ post.category }}</span>
              <span class="post-date">{{ formattedDate }}</span>
              <span class="post-read-time">{{ readTime }} min read</span>
            </div>
            
            <h1 class="post-title">{{ post.title }}</h1>
            
            <div class="post-author" v-if="post.author">
              <div class="author-avatar" v-if="post.author.avatar">
                <img :src="post.author.avatar" :alt="post.author.name">
              </div>
              <div class="author-info">
                <span class="author-name">{{ post.author.name }}</span>
                <span class="author-title" v-if="post.author.title">{{ post.author.title }}</span>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 特色图片 -->
        <section class="post-featured-image" v-if="post.imageUrl">
          <div class="container">
            <div class="image-container">
              <img :src="post.imageUrl" :alt="post.title">
            </div>
          </div>
        </section>
        
        <!-- 文章内容 -->
        <section class="post-content">
          <div class="container">
            <div class="content" v-html="post.content"></div>
          </div>
        </section>
        
        <!-- 分享和标签 -->
        <section class="post-footer">
          <div class="container">
            <div class="post-tags" v-if="post.tags && post.tags.length > 0">
              <span class="tags-title">Tags:</span>
              <ul class="tags-list">
                <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
              </ul>
            </div>
            
            <div class="post-share">
              <span class="share-title">Share:</span>
              <div class="share-buttons">
                <!-- Twitter -->
                <a href="#" class="share-button" aria-label="Share on Twitter">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                
                <!-- Facebook -->
                <a href="#" class="share-button" aria-label="Share on Facebook">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                
                <!-- LinkedIn -->
                <a href="#" class="share-button" aria-label="Share on LinkedIn">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 相关文章 -->
        <section class="related-posts" v-if="relatedPosts.length > 0">
          <div class="container">
            <h2>You Might Also Like</h2>
            <div class="related-grid">
              <BlogCard 
                v-for="relatedPost in relatedPosts" 
                :key="relatedPost.id" 
                :post="relatedPost" 
              />
            </div>
          </div>
        </section>
      </template>
      
      <div v-else class="error-container container">
        <h2>Post Not Found</h2>
        <p>The blog post you're looking for doesn't exist or has been removed.</p>
        <router-link to="/blog" class="btn btn-primary">Back to Blog</router-link>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import BlogCard from '@/components/blog/BlogCard.vue'

export default {
  name: 'BlogPostView',
  components: {
    BlogCard
  },
  data() {
    return {
      maxRelatedPosts: 3
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.loading
    }),
    ...mapGetters({
      posts: 'blog/posts',
      getPostById: 'blog/post'
    }),
    postId() {
      return this.$route.params.id;
    },
    post() {
      return this.getPostById(this.postId);
    },
    formattedDate() {
      if (!this.post || !this.post.createdAt) return '';
      const date = new Date(this.post.createdAt);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    readTime() {
      if (!this.post || !this.post.content) return '1';
      const words = this.post.content.split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      return minutes;
    },
    relatedPosts() {
      if (!this.post) return [];
      
      // 获取相同分类的文章，但排除当前文章
      return this.posts
        .filter(p => p.id !== this.post.id)
        .filter(p => p.category === this.post.category)
        .slice(0, this.maxRelatedPosts);
    }
  },
  methods: {
    fetchPost() {
      this.$store.dispatch('blog/fetchPost', this.postId);
    }
  },
  created() {
    this.fetchPost();
  },
  watch: {
    // 当路由参数变化时重新获取文章
    postId: {
      handler() {
        this.fetchPost();
      }
    }
  }
}
</script>

<style scoped>
.blog-post {
  /* Post-specific styles */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

section {
  margin-bottom: 4rem;
}

.loading-container,
.error-container {
  padding: 5rem 0;
  text-align: center;
}

.error-container h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

.error-container p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

/* Post Header Styles */
.post-header {
  padding: 4rem 0 2rem;
  text-align: center;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: #666;
}

.post-meta > span {
  margin: 0 0.75rem;
}

.post-category {
  font-weight: 500;
  color: #333;
}

.post-title {
  font-size: 3.5rem;
  line-height: 1.2;
  font-weight: 300;
  margin-bottom: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.post-author {
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.author-name {
  font-weight: 500;
}

.author-title {
  font-size: 0.9rem;
  color: #666;
}

/* Featured Image Styles */
.image-container {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.image-container img {
  width: 100%;
  height: auto;
  display: block;
}

/* Content Styles */
.post-content .container {
  max-width: 800px;
}

.content {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #333;
}

.content >>> p {
  margin-bottom: 1.5rem;
}

.content >>> h2 {
  font-size: 2rem;
  margin: 2.5rem 0 1rem;
  font-weight: 400;
}

.content >>> h3 {
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  font-weight: 500;
}

.content >>> ul,
.content >>> ol {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.content >>> li {
  margin-bottom: 0.5rem;
}

.content >>> blockquote {
  border-left: 4px solid #333;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #555;
}

.content >>> img {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

/* Footer Styles */
.post-footer {
  padding: 2rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.post-footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.post-tags {
  display: flex;
  align-items: center;
}

.tags-title {
  margin-right: 1rem;
  font-weight: 500;
}

.tags-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tags-list li {
  margin-right: 0.75rem;
  padding: 0.35rem 0.75rem;
  background-color: #f5f5f5;
  border-radius: 2rem;
  font-size: 0.85rem;
}

.post-share {
  display: flex;
  align-items: center;
}

.share-title {
  margin-right: 1rem;
  font-weight: 500;
}

.share-buttons {
  display: flex;
}

.share-button {
  display: block;
  width: 35px;
  height: 35px;
  margin-left: 0.75rem;
  color: #333;
  transition: transform 0.3s ease;
}

.share-button:hover {
  transform: translateY(-3px);
  color: #000;
}

/* Related Posts Styles */
.related-posts {
  padding: 4rem 0;
}

.related-posts h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 300;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #333;
  color: white;
}

.btn-primary:hover {
  background-color: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .post-title {
    font-size: 2.5rem;
  }
  
  .post-footer .container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .post-share {
    margin-top: 1.5rem;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style> 