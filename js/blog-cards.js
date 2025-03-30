/**
 * Blog Cards Management
 * 
 * This module handles the loading, rendering, and management of blog posts
 * across the Zeprium website. It fetches data from JSON and dynamically
 * generates blog card components.
 */

// 博客卡片加载和渲染控制器
class BlogManager {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      dataUrl: 'data/blog-posts.json',
      gridSelector: '.blog-grid',
      maxHomePageCards: 3,
      ...options
    };
    
    // State management
    this.posts = [];
    this.isLoaded = false;
    this.currentLanguage = 'en';
    
    // Bind methods
    this.loadBlogCards = this.loadBlogCards.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
    this.createBlogCard = this.createBlogCard.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    
    // Initialize if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      this.init();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.init());
    }
  }
  
  /**
   * Initialize the blog manager
   */
  init() {
    const blogGrid = document.querySelector(this.config.gridSelector);
    
    // Only proceed if we find a blog grid on the page
    if (blogGrid) {
      // Get current language from localStorage
      this.currentLanguage = localStorage.getItem('zeprium-lang') || 'en';
      
      // Load blog cards
      this.loadBlogCards();
      
      // If we're on the blog page, set up category filters
      if (window.location.pathname.includes('/blog.html')) {
        this.setupFilters();
      }
      
      // Listen for language change events
      document.addEventListener('languageChanged', this.handleLanguageChange);
    }
  }
  
  /**
   * Handle language change events
   * @param {Event} event - Custom event with language data
   */
  handleLanguageChange(event) {
    if (event.detail && event.detail.language) {
      this.currentLanguage = event.detail.language;
      this.renderCards(null, true); // Re-render with same posts but clear existing
    }
  }
  
  /**
   * Load blog posts from JSON data file
   */
  async loadBlogCards() {
    try {
      // Only load once
      if (this.isLoaded) return;
      
      const response = await fetch(this.config.dataUrl);
      
      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      this.posts = await response.json();
      this.isLoaded = true;
      
      // Render the cards
      this.renderCards();
      
      // Setup post rendering
      if (window.location.pathname.includes('/blog.html')) {
        this.handleBlogPostDisplay();
      }
      
      return this.posts;
    } catch (error) {
      console.error('Error loading blog posts:', error);
      
      // Provide fallback content in case of error
      const blogGrid = document.querySelector(this.config.gridSelector);
      if (blogGrid) {
        const errorMessage = this.currentLanguage === 'zh' 
          ? '无法加载博客文章。请稍后再试。'
          : 'Unable to load blog posts. Please try again later.';
        
        blogGrid.innerHTML = `
          <div class="error-message">
            <p>${errorMessage}</p>
          </div>
        `;
      }
    }
  }
  
  /**
   * Render blog cards to the DOM
   * @param {Array} posts - Optional filtered subset of posts to render
   * @param {Boolean} clearExisting - Whether to clear existing content
   */
  renderCards(posts = null, clearExisting = true) {
    const blogGrid = document.querySelector(this.config.gridSelector);
    if (!blogGrid) return;
    
    // Determine which posts to render
    const postsToRender = posts || this.posts;
    
    // Consider if we're on the homepage and should limit cards
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname.endsWith('index.html');
    
    // For homepage, only show featured posts up to the max limit
    const displayPosts = isHomePage 
      ? postsToRender.filter(post => post.featured).slice(0, this.config.maxHomePageCards)
      : postsToRender;
    
    // Clear existing cards if needed
    if (clearExisting) {
      blogGrid.innerHTML = '';
    }
    
    // Create and append cards
    if (displayPosts.length > 0) {
      displayPosts.forEach(post => {
        const card = this.createBlogCard(post);
        blogGrid.appendChild(card);
      });
    } else {
      const noPostsMessage = this.currentLanguage === 'zh'
        ? '没有找到符合条件的文章。'
        : 'No posts found matching your criteria.';
        
      blogGrid.innerHTML = `
        <div class="no-posts-message">
          <p>${noPostsMessage}</p>
        </div>
      `;
    }
  }
  
  /**
   * Create a blog card DOM element
   * @param {Object} post - Blog post data
   * @returns {HTMLElement} - Blog card element
   */
  createBlogCard(post) {
    // Create card article element
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-category', post.category);
    article.setAttribute('data-post-id', post.id);
    
    // Get the content in the current language
    const title = this.currentLanguage === 'zh' && post.title_zh ? post.title_zh : post.title;
    const summary = this.currentLanguage === 'zh' && post.summary_zh ? post.summary_zh : post.summary;
    const category = this.currentLanguage === 'zh' && post.category_zh ? post.category_zh : post.category;
    const readMore = this.currentLanguage === 'zh' ? '阅读更多' : 'Read more';
    
    // 确定文章URL，支持两种模式：单独HTML页面或参数化URL
    let postUrl = post.url;
    if (post.urlParams) {
      // 添加URL参数和语言参数（如果需要）
      postUrl += post.urlParams + (this.currentLanguage === 'zh' ? '&lang=zh' : '');
    } else if (this.currentLanguage === 'zh') {
      // 对于单独HTML页面，添加语言查询参数
      postUrl += (postUrl.includes('?') ? '&' : '?') + 'lang=zh';
    }
    
    // 处理图片显示
    let imageHtml = '';
    if (post.image) {
      imageHtml = `<div class="blog-image" style="background-image: url('${post.image}');" aria-label="${category} category"></div>`;
    } else {
      imageHtml = `<div class="blog-image" style="background-color: ${post.color};" aria-label="${category} category">${category}</div>`;
    }
    
    // Create card content with proper accessibility attributes
    article.innerHTML = `
      ${imageHtml}
      <div class="blog-content">
        <h3>${title}</h3>
        <p>${summary}</p>
        <div class="blog-meta">
          <time datetime="${post.date}">${this.formatDate(post.date)}</time>
        </div>
        <a href="${postUrl}" 
           aria-label="${this.currentLanguage === 'zh' ? '阅读更多关于' : 'Read more about'} ${title}" 
           class="read-more">${readMore}</a>
      </div>
    `;
    
    return article;
  }
  
  /**
   * Format date in a user-friendly way
   * @param {String} dateString - ISO date string
   * @returns {String} - Formatted date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    
    if (this.currentLanguage === 'zh') {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
  
  /**
   * Set up category filter buttons on the blog page
   */
  setupFilters() {
    // Get unique categories from posts
    const categories = [...new Set(this.posts.map(post => post.category))];
    
    // Find or create filter container
    let filterContainer = document.querySelector('.blog-filters');
    if (!filterContainer) {
      filterContainer = document.createElement('div');
      filterContainer.className = 'blog-filters';
      
      const blogSection = document.querySelector('section.content-box');
      if (blogSection) {
        blogSection.insertBefore(filterContainer, document.querySelector(this.config.gridSelector));
      }
    }
    
    // Create "All" filter button
    const allBtn = document.createElement('button');
    allBtn.textContent = this.currentLanguage === 'zh' ? '全部' : 'All';
    allBtn.className = 'filter-btn active';
    allBtn.setAttribute('data-category', 'all');
    filterContainer.appendChild(allBtn);
    
    // Create category filter buttons
    categories.forEach(category => {
      const btn = document.createElement('button');
      
      // Get category name in current language
      const categoryPost = this.posts.find(post => post.category === category);
      const categoryName = this.currentLanguage === 'zh' && categoryPost.category_zh ? 
        categoryPost.category_zh : category;
      
      btn.textContent = categoryName;
      btn.className = 'filter-btn';
      btn.setAttribute('data-category', category);
      filterContainer.appendChild(btn);
    });
    
    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const category = e.target.getAttribute('data-category');
        this.filterPosts(category);
      });
    });
  }
  
  /**
   * Filter posts by category
   * @param {String} category - Category to filter by, or 'all'
   */
  filterPosts(category) {
    if (category === 'all') {
      this.renderCards();
    } else {
      const filteredPosts = this.posts.filter(post => post.category === category);
      this.renderCards(filteredPosts);
    }
  }
  
  /**
   * Handle displaying individual blog posts based on URL parameters
   */
  handleBlogPostDisplay() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    
    if (postId) {
      const post = this.posts.find(p => p.id === postId);
      
      if (post) {
        // Hide the blog grid
        const blogGrid = document.querySelector(this.config.gridSelector);
        if (blogGrid) {
          blogGrid.style.display = 'none';
        }
        
        // Hide filters if they exist
        const filters = document.querySelector('.blog-filters');
        if (filters) {
          filters.style.display = 'none';
        }
        
        // Get or create blog post container
        let postContainer = document.querySelector('.blog-post-container');
        if (!postContainer) {
          postContainer = document.createElement('div');
          postContainer.className = 'blog-post-container';
          const contentBox = document.querySelector('section.content-box');
          if (contentBox) {
            contentBox.appendChild(postContainer);
          }
        }
        
        // Update page title
        document.title = `${post.title} - Zeprium`;
        
        // Populate with post content
        postContainer.innerHTML = `
          <article class="blog-post">
            <header>
              <div class="post-category" style="background-color: ${post.color};">${post.category}</div>
              <h1>${post.title}</h1>
              <div class="post-meta">
                <time datetime="${post.date}">${this.formatDate(post.date)}</time>
              </div>
            </header>
            <div class="post-content">
              <p>${post.summary}</p>
              <p>This is a placeholder for the full blog post content. In a production environment, this would be loaded from a CMS or database.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.</p>
            </div>
            <footer>
              <a href="blog.html" class="button secondary">← Back to all posts</a>
            </footer>
          </article>
        `;
      }
    }
  }
}

// Initialize the blog manager
const blogManager = new BlogManager();

// Export for potential use by other modules
window.blogManager = blogManager; 