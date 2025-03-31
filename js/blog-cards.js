/**
 * 博客卡片管理系统
 * 
 * 该模块负责处理 Zeprium 网站博客文章的加载、渲染和管理。
 * 从 JSON 文件获取数据并动态生成博客卡片组件。
 */

// 博客卡片加载和渲染控制器
class BlogManager {
  constructor(options = {}) {
    // 默认配置
    this.config = {
      dataUrl: 'data/blog-posts.json',
      gridSelector: '.blog-grid',
      maxHomePageCards: 3,
      ...options
    };
    
    // 状态管理
    this.posts = [];
    this.isLoaded = false;
    this.currentLanguage = localStorage.getItem('zeprium-lang') || 'en';
    
    // 绑定方法
    this.loadBlogCards = this.loadBlogCards.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
    this.createBlogCard = this.createBlogCard.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    
    // 初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      this.init();
    } else {
      document.addEventListener('DOMContentLoaded', () => this.init());
    }
  }
  
  /**
   * 初始化博客管理器
   */
  init() {
    const blogGrid = document.querySelector(this.config.gridSelector);
    
    if (blogGrid) {
      // 加载博客卡片
      this.loadBlogCards();
      
      // 在博客页面设置分类过滤器
      if (window.location.pathname.includes('/blog.html')) {
        this.setupFilters();
      }
      
      // 监听语言变更事件
      document.addEventListener('languageChanged', this.handleLanguageChange);
    }
  }
  
  /**
   * 处理语言变更事件
   * @param {Event} event - 包含语言数据的自定义事件
   */
  handleLanguageChange(event) {
    if (event.detail?.language) {
      this.currentLanguage = event.detail.language;
      this.renderCards(null, true);
    }
  }
  
  /**
   * 从 JSON 数据文件加载博客文章
   */
  async loadBlogCards() {
    if (this.isLoaded) return;
    
    try {
      const response = await fetch(this.config.dataUrl);
      if (!response.ok) {
        throw new Error(`HTTP 错误！状态码：${response.status}`);
      }
      
      this.posts = await response.json();
      this.isLoaded = true;
      
      // 渲染卡片
      this.renderCards();
      
      // 设置文章渲染
      if (window.location.pathname.includes('/blog.html')) {
        this.handleBlogPostDisplay();
      }
      
      return this.posts;
    } catch (error) {
      console.error('加载博客文章时出错：', error);
      this.displayErrorMessage();
    }
  }
  
  /**
   * 显示错误信息
   */
  displayErrorMessage() {
    const blogGrid = document.querySelector(this.config.gridSelector);
    const blogSection = blogGrid?.closest('section.content-box');

    if (blogGrid) blogGrid.innerHTML = '';

    if (blogSection) {
      const errorMessage = this.currentLanguage === 'zh' 
        ? '无法加载博客文章。请稍后再试。'
        : 'Unable to load blog posts. Please try again later.';
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.innerHTML = `<p>${errorMessage}</p>`;
      
      blogSection.appendChild(errorDiv);
    }
  }
  
  /**
   * 渲染博客卡片到 DOM
   * @param {Array} posts - 可选的要渲染的文章子集
   * @param {Boolean} clearExisting - 是否清除现有内容
   */
  renderCards(posts = null, clearExisting = true) {
    const blogGrid = document.querySelector(this.config.gridSelector);
    if (!blogGrid) return;
    
    const postsToRender = posts || this.posts;
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname.endsWith('index.html');
    
    const displayPosts = isHomePage 
      ? postsToRender.filter(post => post.featured).slice(0, this.config.maxHomePageCards)
      : postsToRender;
    
    if (clearExisting) {
      blogGrid.innerHTML = '';
    }
    
    if (displayPosts.length > 0) {
      displayPosts.forEach(post => {
        const card = this.createBlogCard(post);
        blogGrid.appendChild(card);
      });
    } else {
      this.displayNoPostsMessage();
    }
  }
  
  /**
   * 显示无文章消息
   */
  displayNoPostsMessage() {
    const blogGrid = document.querySelector(this.config.gridSelector);
    const blogSection = blogGrid?.closest('section.content-box');
    
    const noPostsMessage = this.currentLanguage === 'zh'
      ? '没有找到符合条件的文章。'
      : 'No posts found matching your criteria.';
    
    if (blogSection) {
      const noPostsDiv = document.createElement('div');
      noPostsDiv.className = 'no-posts-message';
      noPostsDiv.innerHTML = `<p>${noPostsMessage}</p>`;
      blogSection.appendChild(noPostsDiv);
    } else {
      blogGrid.innerHTML = `
        <div class="no-posts-message">
          <p>${noPostsMessage}</p>
        </div>
      `;
    }
  }
  
  /**
   * 创建博客卡片 DOM 元素
   * @param {Object} post - 博客文章数据
   * @returns {HTMLElement} - 博客卡片元素
   */
  createBlogCard(post) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    article.setAttribute('data-category', post.category);
    article.setAttribute('data-post-id', post.id);
    
    const title = this.currentLanguage === 'zh' && post.title_zh ? post.title_zh : post.title;
    const summary = this.currentLanguage === 'zh' && post.summary_zh ? post.summary_zh : post.summary;
    const category = this.currentLanguage === 'zh' && post.category_zh ? post.category_zh : post.category;
    const readMore = this.currentLanguage === 'zh' ? '阅读更多' : 'Read more';
    
    // 处理文章 URL
    const postUrl = this.getPostUrl(post);
    
    // 处理图片显示
    const imageHtml = this.getImageHtml(post, category);
    
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
   * 获取文章 URL
   * @param {Object} post - 博客文章数据
   * @returns {String} - 处理后的 URL
   */
  getPostUrl(post) {
    let postUrl = post.url;
    if (post.urlParams) {
      postUrl += post.urlParams + (this.currentLanguage === 'zh' ? '&lang=zh' : '');
    } else if (this.currentLanguage === 'zh') {
      postUrl += (postUrl.includes('?') ? '&' : '?') + 'lang=zh';
    }
    return postUrl;
  }
  
  /**
   * 获取图片 HTML
   * @param {Object} post - 博客文章数据
   * @param {String} category - 文章分类
   * @returns {String} - 图片 HTML
   */
  getImageHtml(post, category) {
    if (post.image) {
      return `<div class="blog-image" style="background-image: url('${post.image}');" aria-label="${category} category"></div>`;
    }
    return `<div class="blog-image" style="background-color: ${post.color};" aria-label="${category} category">${category}</div>`;
  }
  
  /**
   * 格式化日期
   * @param {String} dateString - ISO 日期字符串
   * @returns {String} - 格式化后的日期
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(
      this.currentLanguage === 'zh' ? 'zh-CN' : 'en-US',
      options
    );
  }
  
  /**
   * 设置博客页面的分类过滤器
   */
  setupFilters() {
    const categories = [...new Set(this.posts.map(post => post.category))];
    const filterContainer = this.getOrCreateFilterContainer();
    
    // 创建"全部"过滤器按钮
    const allBtn = document.createElement('button');
    allBtn.textContent = this.currentLanguage === 'zh' ? '全部' : 'All';
    allBtn.className = 'button active';
    allBtn.setAttribute('data-category', 'all');
    filterContainer.appendChild(allBtn);
    
    // 创建分类过滤器按钮
    categories.forEach(category => {
      const btn = document.createElement('button');
      
      // Get category name in current language
      const categoryPost = this.posts.find(post => post.category === category);
      const categoryName = this.currentLanguage === 'zh' && categoryPost.category_zh ? 
        categoryPost.category_zh : category;
      
      btn.textContent = categoryName;
      btn.className = 'button';
      btn.setAttribute('data-category', category);
      filterContainer.appendChild(btn);
    });
    
    // Add event listeners to filter buttons
    document.querySelectorAll('.blog-filters .button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Update active button
        document.querySelectorAll('.blog-filters .button').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const category = e.target.getAttribute('data-category');
        this.filterPosts(category);
      });
    });
  }
  
  /**
   * 获取或创建过滤器容器
   * @returns {HTMLElement} - 过滤器容器
   */
  getOrCreateFilterContainer() {
    let filterContainer = document.querySelector('.blog-filters');
    if (!filterContainer) {
      filterContainer = document.createElement('div');
      filterContainer.className = 'blog-filters';
      
      const blogSection = document.querySelector('section.content-box');
      if (blogSection) {
        blogSection.insertBefore(filterContainer, document.querySelector(this.config.gridSelector));
      }
    }
    return filterContainer;
  }
  
  /**
   * 按分类过滤文章
   * @param {String} category - 要过滤的分类，或 'all'
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
   * 处理基于 URL 参数的单个博客文章显示
   */
  handleBlogPostDisplay() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    
    if (postId) {
      const post = this.posts.find(p => p.id === postId);
      
      if (post) {
        this.hideBlogElements();
        this.displayBlogPost(post);
      }
    }
  }
  
  /**
   * 隐藏博客元素
   */
  hideBlogElements() {
    const blogGrid = document.querySelector(this.config.gridSelector);
    const filters = document.querySelector('.blog-filters');
    
    if (blogGrid) blogGrid.style.display = 'none';
    if (filters) filters.style.display = 'none';
  }
  
  /**
   * 显示博客文章
   * @param {Object} post - 博客文章数据
   */
  displayBlogPost(post) {
    document.title = `${post.title} - Zeprium`;
    
    const postContainer = this.getOrCreatePostContainer();
    const title = this.currentLanguage === 'zh' && post.title_zh ? post.title_zh : post.title;
    const category = this.currentLanguage === 'zh' && post.category_zh ? post.category_zh : post.category;
    
    postContainer.innerHTML = `
      <article class="blog-post">
        <header>
          <div class="post-category" style="background-color: ${post.color};">${category}</div>
          <h1>${title}</h1>
          <div class="post-meta">
            <time datetime="${post.date}">${this.formatDate(post.date)}</time>
          </div>
        </header>
        <div class="post-content">
          <p>${post.summary}</p>
          <p>这是博客文章的完整内容占位符。在生产环境中，这将从 CMS 或数据库加载。</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.</p>
        </div>
        <footer>
          <a href="blog.html" class="button secondary">← ${this.currentLanguage === 'zh' ? '返回所有文章' : 'Back to all posts'}</a>
        </footer>
      </article>
    `;
  }
  
  /**
   * 获取或创建文章容器
   * @returns {HTMLElement} - 文章容器
   */
  getOrCreatePostContainer() {
    let postContainer = document.querySelector('.blog-post-container');
    if (!postContainer) {
      postContainer = document.createElement('div');
      postContainer.className = 'blog-post-container';
      const contentBox = document.querySelector('section.content-box');
      if (contentBox) {
        contentBox.appendChild(postContainer);
      }
    }
    return postContainer;
  }
}

// 初始化博客管理器
const blogManager = new BlogManager();

// 导出供其他模块使用
window.blogManager = blogManager; 