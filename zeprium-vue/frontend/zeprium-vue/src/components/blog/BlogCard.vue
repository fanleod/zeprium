<template>
  <div class="blog-card">
    <router-link :to="{ name: 'BlogPost', params: { id: post.id } }" class="blog-link">
      <div class="blog-image">
        <img :src="imageUrl" :alt="post.title" />
        <div class="blog-category" v-if="post.category">{{ post.category }}</div>
      </div>
      <div class="blog-content">
        <h3 class="blog-title">{{ post.title }}</h3>
        <p class="blog-excerpt">{{ excerpt }}</p>
        <div class="blog-meta">
          <span class="blog-date">{{ formattedDate }}</span>
          <span class="blog-read">{{ readTime }} min read</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'BlogCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageUrl() {
      // 如果没有图片，则使用默认图片
      return this.post.imageUrl || require('@/assets/images/blog-placeholder.jpg');
    },
    excerpt() {
      // 将内容截取为摘要
      if (!this.post.content) return '';
      return this.post.content.substring(0, 120) + (this.post.content.length > 120 ? '...' : '');
    },
    formattedDate() {
      // 格式化日期
      if (!this.post.createdAt) return '';
      const date = new Date(this.post.createdAt);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    readTime() {
      // 计算阅读时间（假设每分钟阅读200个单词）
      if (!this.post.content) return '1';
      const words = this.post.content.split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      return minutes;
    }
  }
}
</script>

<style scoped>
.blog-card {
  background-color: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.blog-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.blog-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.blog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card:hover .blog-image img {
  transform: scale(1.05);
}

.blog-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.blog-content {
  padding: 1.5rem;
}

.blog-title {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #333;
  line-height: 1.3;
}

.blog-excerpt {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
}

.blog-date, .blog-read {
  display: inline-block;
}
</style> 