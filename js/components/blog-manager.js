console.log('[BlogManager] blog-manager.js script executing...'); // DEBUG: Top-level execution check

/**
 * 博客卡片管理系统
 * 
 * 该模块负责处理 Zeprium 网站博客文章的加载、渲染和管理。
 * 从 JSON 文件获取数据并动态生成博客卡片组件。
 */

// 博客卡片加载和渲染控制器
class BlogManager {
  constructor(options = {}) {
    console.log('[BlogManager] Constructor called.'); // DEBUG: Confirm constructor starts
    // 默认配置
    this.config = {
      dataUrl: 'data/blog-posts.json',
      gridSelector: '.blog-grid',
      maxHomePageCards: 3,
      ...options
    };
    
    // **正确定义页面类型属性**
    this.isBlogListPage = window.location.pathname.includes('/blog.html');
    this.isSinglePostPage = !this.isBlogListPage && window.location.pathname.includes('/pages/blog/');
    console.log(`[BlogManager] Page type detected - isBlogListPage: ${this.isBlogListPage}, isSinglePostPage: ${this.isSinglePostPage}`); // DEBUG
    
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
    console.log(`[BlogManager] Constructor: Document readyState is ${document.readyState}`); // DEBUG
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      console.log('[BlogManager] Constructor: Calling init() immediately.'); // DEBUG
      this.init();
    } else {
      console.log('[BlogManager] Constructor: Adding DOMContentLoaded listener for init().'); // DEBUG
      document.addEventListener('DOMContentLoaded', () => {
         console.log('[BlogManager] DOMContentLoaded event fired, calling init().'); // DEBUG
         this.init()
      });
    }
    console.log('[BlogManager] Constructor finished.'); // DEBUG
  }
  
  /**
   * 初始化博客管理器
   */
  init() {
    console.log('[BlogManager] init() method started.'); // DEBUG: Confirm init starts
    // 监听语言变更事件 (所有页面都需要)
    document.addEventListener('languageChanged', this.handleLanguageChange);

    const blogGrid = document.querySelector(this.config.gridSelector);
    const urlParams = new URLSearchParams(window.location.search);
    const postIdFromUrl = urlParams.get('post');

    if (this.isBlogListPage) {
        console.log('[BlogManager] init(): Initializing on Blog List Page.'); // DEBUG
        if (blogGrid) {
            this.loadBlogCards().then(() => {
                 // 数据加载完成后检查 URL 参数
                const currentUrlParams = new URLSearchParams(window.location.search);
                const currentPostId = currentUrlParams.get('post');
                if (currentPostId) {
                    // URL 有 post 参数，handleBlogPostDisplay 会处理
                    this.handleBlogPostDisplay(); 
                } else {
                    // URL 没有 post 参数，是纯列表视图
                    this.setupFilters(); // 设置过滤器
                    this.renderCards(null, true); // 确保列表已渲染
                }
            });
        } else {
             console.warn('[BlogManager] Blog grid not found on blog list page.');
        }
    } else if (this.isSinglePostPage) {
        console.log('[BlogManager] init(): Initializing on Single Post Page.'); // DEBUG
        // 单文章页面: 不需要加载所有卡片，不需要 setupFilters
        // 只需确保语言显示正确
        // DOMContentLoaded 可能触发 navigation.js 比这个脚本晚
        // 稍微延迟执行语言更新，确保导航栏的语言切换器可能已初始化
        requestAnimationFrame(() => {
             console.log('[BlogManager][Single Post Page] Calling updatePostLanguageDisplay.')
            this.updatePostLanguageDisplay(); 
        });
       
    } else if (blogGrid) { // Handle homepage or other pages with blog grid
        console.log('[BlogManager] init(): Initializing on Homepage or other page with grid.'); // DEBUG
        this.loadBlogCards(); // 加载特色卡片 (renderCards 会在 load 完成后调用)
    }
    console.log('[BlogManager] init() method finished.'); // DEBUG
  }
  
  /**
   * 处理语言变更事件
   * @param {Event} event - 包含语言数据的自定义事件
   */
  handleLanguageChange(event) {
    if (event.detail?.language) {
      console.log(`[BlogManager] Language changed event received: ${event.detail.language}`); // DEBUG
      this.currentLanguage = event.detail.language;
      
      // **恢复正确的逻辑：根据页面类型决定操作**
      if (this.isSinglePostPage) {
        console.log('[BlogManager] Updating language display for single article HTML page'); // DEBUG
        this.updatePostLanguageDisplay(); // 直接更新当前页面的语言元素
      } else if (this.isBlogListPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('post');
        if (postId) {
          console.log('[BlogManager] Updating language display for dynamically loaded article'); // DEBUG
          this.updatePostLanguageDisplay(); // 更新动态加载的文章内容
        } else {
          console.log('[BlogManager] Updating language display for blog list'); // DEBUG
          // 列表页需要重新渲染卡片和过滤器
          if (this.isLoaded) {
            this.renderCards(null, true); 
            this.setupFilters(); // 重新设置过滤器文本
          } else {
            this.loadBlogCards(); // 如果未加载，则加载
          }
        }
      } else {
           console.log('[BlogManager] Updating language display for homepage/other grid'); // DEBUG
           // 首页或其他页面，重新渲染卡片
           if (this.isLoaded) {
             this.renderCards(null, true);
           } else {
             this.loadBlogCards();
           }
      }
    }
  }
  
  /**
   * 从 JSON 数据文件加载博客文章
   */
  async loadBlogCards() {
    if (this.isLoaded) return;
    
    // Dynamically determine the correct path to the data file
    let dataPath = this.config.dataUrl;
    const currentPath = window.location.pathname;
    // Check if we are inside the /pages/ directory or similar subdirectories
    if (currentPath.includes('/pages/')) { 
        // Assuming dataUrl is relative from root like 'data/blog-posts.json'
        // We need to go up one level
        if (!dataPath.startsWith('../')) { // Avoid adding ../ if already present
             dataPath = '../' + dataPath;
        }
    } else if (currentPath !== '/' && !currentPath.endsWith('index.html') && !currentPath.startsWith('/data')) {
        // Handle potential other subdirectories if necessary, assuming root otherwise
        // For now, assume root path works if not in /pages/
    }
    console.log(`[BlogManager] Resolved data path: ${dataPath}`); // DEBUG

    try {
      // Use the resolved dataPath for the fetch request
      const response = await fetch(dataPath); 
      console.log(`[BlogManager] Fetching blog data from: ${dataPath}, Status: ${response.status}`); // DEBUG
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.posts = await response.json();
      this.isLoaded = true;
      console.log('[BlogManager] Blog data loaded successfully:', this.posts); // DEBUG
      
      // 渲染卡片
      this.renderCards(); // Render cards for the current page view (home or list)
      
      // 设置文章渲染 (仅在 blog.html 页面执行)
      if (window.location.pathname.includes('/blog.html')) {
          console.log('[BlogManager] On blog page, calling handleBlogPostDisplay.'); // DEBUG
          this.handleBlogPostDisplay(); // This will either show the list or a single post
      }
      
      return this.posts;
    } catch (error) {
      console.error(`[BlogManager] Error loading blog posts from ${dataPath}:`, error); // DEBUG
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
        <div class="blog-meta">
          <span class="blog-category" style="background-color: ${post.color};">${category}</span>
          <time datetime="${post.date}">${this.formatDate(post.date)}</time>
        </div>
        <h3>${title}</h3>
        <p>${summary}</p>
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
    const postId = post.id;
    
    // 判断当前是否在 blog.html 页面
    const onBlogListPage = window.location.pathname.includes('/blog.html');
    
    let targetUrl;
    
    if (onBlogListPage) {
        // 在 blog.html 页面，生成动态加载链接 (?post=...)
        targetUrl = `blog.html?post=${postId}`;
    } else {
        // 在其他页面 (如首页)，生成直接指向文章 HTML 的链接
        // 确保路径是从根目录开始的绝对路径
        targetUrl = `/pages/blog/${postId}.html`; 
    }
    
    // 为目标 URL 添加 lang 参数 (如果需要且不在参数中)
    if (this.currentLanguage === 'zh' && !targetUrl.includes('lang=')) {
        targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'lang=zh';
    }
    
    console.log(`[BlogManager] Generated post URL: ${targetUrl} (onBlogListPage: ${onBlogListPage})`); // DEBUG
    return targetUrl;
  }
  
  /**
   * 获取图片 HTML
   * @param {Object} post - 博客文章数据
   * @param {String} category - 文章分类
   * @returns {String} - 图片 HTML
   */
  getImageHtml(post, category) {
    // Use post.id to generate alt text if title is unavailable
    const altTextBase = this.currentLanguage === 'zh' && post.title_zh ? post.title_zh : (post.title || post.id);
    const altText = `${altTextBase} - ${category}`;

    if (post.image) {
       // Construct the correct relative path from the root or current page
      let imagePath = post.image;
      // Assuming blog-cards.js runs on pages like /pages/blog.html or /index.html
      // The JSON path is '../images/blog/...' relative to 'data/' directory.
      // If running from /pages/blog.html, path should be '../images/blog/...' (correct)
      // If running from /index.html, path should be './images/blog/...' (needs adjustment)
      // Let's adjust based on current path for robustness
      if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
         // If on homepage, remove the leading '../'
         if (imagePath.startsWith('../')) {
           imagePath = imagePath.substring(3);
         }
      } 
      // If on other pages deep in /pages/, '../' should be correct relative to the HTML file.

      return `<div class="blog-image" aria-label="${category} category"><img src="${imagePath}" alt="${altText}" loading="lazy"></div>`;
    }
    // Fallback if no image is specified
    return `<div class="blog-image no-image" style="background-color: ${post.color};" aria-label="${category} category"><span>${category}</span></div>`;
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
   * !! 重要: 此函数只应在博客列表页调用 !!
   */
  setupFilters() {
    // **增加严格检查：确保不在单文章页面执行**
    if (this.isSinglePostPage) {
        console.warn('[BlogManager] Attempted to run setupFilters on a single post page. Aborting.');
        return; 
    }
    // 确保我们在博客列表页面
    if (!this.isBlogListPage) {
         console.warn('[BlogManager] Attempted to run setupFilters outside the blog list page. Aborting.');
        return;
    }
    // 确保文章数据已加载
    if (!this.isLoaded || !this.posts || this.posts.length === 0) {
        console.warn('[BlogManager] Cannot setup filters: Blog posts not loaded or empty.');
        // 可以在这里稍后重试或显示消息
        // 延迟尝试，以防数据仍在加载中
        setTimeout(() => {
            if (this.isLoaded && this.posts && this.posts.length > 0) {
                 this.setupFilters(); 
            }
        }, 500);
        return; 
    }

    // 从文章数据中提取所有唯一的分类 (英文作为 key)
    // 使用 Set 来自动处理重复项
    const uniqueCategories = [...new Set(this.posts.flatMap(post => post.category.split(',').map(cat => cat.trim())))];
    
    // 如果没有分类或只有一个分类，则不显示过滤器
    if (uniqueCategories.length <= 1) {
      console.log('[BlogManager] No need for filters with 0 or 1 category.');
      return;
    }

    const filterContainer = this.getOrCreateFilterContainer();
    // Only proceed if filterContainer exists and is on the blog list page
    if (!filterContainer) {
        console.error('[BlogManager] Filter container not found when trying to setup filters.');
        return;
    }
    filterContainer.innerHTML = ''; // 清空现有按钮以防重复添加
    
    // 创建 "All" 按钮
    const allBtn = this.createFilterButton('all', this.currentLanguage === 'zh' ? '全部' : 'All', true); // 默认激活
    filterContainer.appendChild(allBtn);
    
    // 为每个唯一分类创建按钮
    uniqueCategories.forEach(categoryKey => {
      if (categoryKey) { //确保分类不是空字符串
        // 尝试找到包含此分类的第一篇文章以获取多语言名称
        const postWithCategory = this.posts.find(p => p.category.split(',').map(c=>c.trim()).includes(categoryKey));
        let categoryName = categoryKey; // 默认为英文 key
        if (postWithCategory && this.currentLanguage === 'zh' && postWithCategory.category_zh) {
            // 查找中文分类名 - 假设中英文分类逗号分隔顺序一致
            const categoriesEn = postWithCategory.category.split(',').map(c=>c.trim());
            const categoriesZh = postWithCategory.category_zh.split(',').map(c=>c.trim());
            const index = categoriesEn.indexOf(categoryKey);
            if (index !== -1 && categoriesZh[index]) {
                 categoryName = categoriesZh[index];
            }
        }
        const btn = this.createFilterButton(categoryKey, categoryName);
      filterContainer.appendChild(btn);
      }
    });
    
    // 为所有按钮添加事件监听器 (事件委托可能更优，但为清晰起见先这样)
    filterContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleFilterClick(e));
    });
  }

  /**
   * 创建单个过滤器按钮
   * @param {String} categoryKey - 分类的值 (e.g., 'all', 'Design')
   * @param {String} categoryName - 显示的按钮文本
   * @param {Boolean} isActive - 是否默认激活
   * @returns {HTMLElement} - 按钮元素
   */
   createFilterButton(categoryKey, categoryName, isActive = false) {
        const btn = document.createElement('button');
        btn.textContent = categoryName;
        btn.className = 'button filter-button'; // 使用通用 button 样式，并添加 filter-button 类
        if (isActive) {
            btn.classList.add('active');
        }
        btn.setAttribute('data-category', categoryKey);
        return btn;
    }

  /**
   * 处理过滤器按钮点击事件
   * @param {Event} e - 点击事件对象
   */
  handleFilterClick(e) {
      const targetButton = e.currentTarget; // 使用 currentTarget 以防点击内部元素
      // Update active button state
      targetButton.parentElement.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
      targetButton.classList.add('active');
      
      const categoryKey = targetButton.getAttribute('data-category');
      this.filterPosts(categoryKey);
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
   * @param {String} categoryKey - 要过滤的分类的 key，或 'all'
   */
  filterPosts(categoryKey) {
    console.log(`[BlogManager] Filtering posts by category: ${categoryKey}`); // DEBUG
    if (categoryKey === 'all') {
      this.renderCards(this.posts); // 渲染所有文章
    } else {
      // 支持文章有多个分类的情况
      const filteredPosts = this.posts.filter(post => 
          post.category.split(',').map(cat => cat.trim()).includes(categoryKey)
      );
      this.renderCards(filteredPosts);
    }
  }
  
  /**
   * 处理基于 URL 参数的单个博客文章显示
   * 这个函数会在 BlogManager 初始化时被调用
   */
  handleBlogPostDisplay() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    
    if (postId) {
      // 确保文章数据已加载
      if (!this.isLoaded) {
        // 如果数据未加载，先加载再尝试显示
        // 使用 Promise.resolve 包装 loadBlogCards 以确保它返回 Promise
        Promise.resolve(this.loadBlogCards()).then(() => {
            if (!this.posts) { // Check if posts array exists after loading
                console.error('Blog posts data is missing after load attempt.');
                this.displayPostNotFoundError(postId, 'Failed to load blog data.');
                return;
            }
            const post = this.posts.find(p => p.id === postId);
            if (post) {
                this.hideBlogListElements(); // 隐藏列表相关元素
                this.displayBlogPost(post, postId);
            } else {
                this.displayPostNotFoundError(postId);
            }
        }).catch(error => {
            console.error('Error loading blog cards before displaying post:', error);
            this.displayPostNotFoundError(postId, 'Error loading prerequisite data.');
        });
      } else {
        // 数据已加载，直接查找并显示
      const post = this.posts.find(p => p.id === postId);
      if (post) {
            this.hideBlogListElements();
            this.displayBlogPost(post, postId);
        } else {
            this.displayPostNotFoundError(postId);
        }
      }
    } else {
        // 如果 URL 没有 post 参数，则确保列表元素是可见的（如果之前被隐藏了）
        this.showBlogListElements();
    }
  }
  
  /**
   * 隐藏博客列表、过滤器及介绍文字 (H1, P)
   */
  hideBlogListElements() {
    const contentBox = document.querySelector('main#main-content section.content-box');
    if (!contentBox) return;

    const blogGrid = contentBox.querySelector(this.config.gridSelector);
    const filters = contentBox.querySelector('.blog-filters');
    const blogIntroH1 = contentBox.querySelector('h1'); 
    const blogIntroP = contentBox.querySelector('p');
    
    if (blogGrid) blogGrid.style.display = 'none';
    if (filters) filters.style.display = 'none';
    if (blogIntroH1) blogIntroH1.style.display = 'none'; 
    if (blogIntroP) blogIntroP.style.display = 'none'; 
  }

  /**
   * 显示博客列表、过滤器及介绍文字 (如果它们存在)
   */
   showBlogListElements() {
    const contentBox = document.querySelector('main#main-content section.content-box');
    if (!contentBox) return;

    const blogGrid = contentBox.querySelector(this.config.gridSelector);
    const filters = contentBox.querySelector('.blog-filters');
    const blogIntroH1 = contentBox.querySelector('h1');
    const blogIntroP = contentBox.querySelector('p');

    if (blogGrid) blogGrid.style.display = ''; // Reset to default display
    if (filters) filters.style.display = ''; // Reset to default display
    if (blogIntroH1) blogIntroH1.style.display = ''; // Reset display
    if (blogIntroP) blogIntroP.style.display = ''; // Reset display
  }
  
  /**
   * 获取并显示单个博客文章
   * @param {Object} post - 博客文章的元数据 (来自 JSON)
   * @param {String} postId - 文章 ID
   */
  async displayBlogPost(post, postId) {
    // 这个函数现在只应该在 blog.html?post=... 的场景下被调用
    console.log(`[BlogManager] Starting displayBlogPost for postId: ${postId} (Dynamic Injection)`); // DEBUG
    
    const contentBox = document.querySelector('main#main-content section.content-box');
    if (!contentBox) {
        console.error('[BlogManager] Target content container not found for dynamic injection');
        return;
    }

    try {
        const filename = `${postId}.html`;
        // 恢复使用绝对路径进行 fetch
        const articlePath = `/pages/blog/${filename}`; 
        
        console.log(`[BlogManager] Attempting to fetch dynamic content from absolute path: ${articlePath}`); // DEBUG
        const response = await fetch(articlePath);
        
        if (!response.ok) {
            let errorBody = '';
            try { errorBody = await response.text(); } catch {}
            throw new Error(`Failed to fetch post content dynamically. Status: ${response.status}. Path: ${articlePath}. Response: ${errorBody}`);
        }
        
        const postHTML = await response.text();
        console.log('[BlogManager] Dynamic post HTML fetched successfully.'); // DEBUG

        // Inject the HTML content
        try {
            // --- MODIFIED Injection Logic --- 
            // 1. Parse the fetched HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(postHTML, 'text/html');
            // 2. Find the main article container within the fetched HTML
            //    Adjust selector based on the actual structure of individual post HTML files
            const fetchedArticle = doc.querySelector('article.blog-article-container'); 
            
            if (fetchedArticle) {
                // 3. Clear the existing container 
                contentBox.innerHTML = ''; 
                // 4. Append the fetched article content into the container
                contentBox.appendChild(fetchedArticle);
                console.log(`[BlogManager] Fetched article content injected into container for ${postId}.`); // Log: Injection Success
            } else {
                 console.error(`[BlogManager] displayBlogPost ERROR: Could not find 'article.blog-article-container' within fetched HTML for ${postId}. Injecting raw HTML as fallback.`);
                 // Fallback to old method if parsing fails, though this might still cause issues
                 contentBox.innerHTML = postHTML; 
            }
            // --- END MODIFIED --- 
            
            // Old simple injection:
            // postContentContainer.innerHTML = postHTML;
            // console.log(`[BlogManager] Content injected into container for ${postId}. Container child count: ${postContentContainer.children.length}`); // Log: Injection
            // if (postContentContainer.children.length === 0 && postHTML.length > 0) {
            //      console.warn(`[BlogManager] Container is empty after injecting non-empty HTML for ${postId}! Possible parsing issue?`);
            // }
        } catch (injectError) {
            console.error(`[BlogManager] Error injecting dynamic blog post content for ${postId}:`, injectError); // DEBUG
            this.displayPostNotFoundErrorInContainer(contentBox, postId, injectError.message);
            return;
        }

        // 4. 更新页面标题
        const title = this.currentLanguage === 'zh' && post.title_zh ? post.title_zh : post.title;
        document.title = `${title} - Zeprium`;

        // 5. 更新语言显示 (重要: updatePostLanguageDisplay 会处理 .active 类)
        this.updatePostLanguageDisplay(); 
        
        console.log('[BlogManager] Dynamic article displayed successfully.'); // DEBUG
    } catch (error) {
        console.error('[BlogManager] Error loading or displaying dynamic blog post:', error); // DEBUG
        this.displayPostNotFoundErrorInContainer(contentBox, postId, error.message);
    }
  }

  /**
   * 显示文章未找到或加载错误信息 (注入到指定容器)
   * @param {HTMLElement} container - 要注入错误信息的容器元素
   * @param {String} postId - 未找到的文章 ID
   * @param {String} errorMessage - 可选的错误信息
   */
  displayPostNotFoundErrorInContainer(container, postId, errorMessage = '') {
      if (!container) return;
      const errorMsgHtml = this.currentLanguage === 'zh' ? 
          `错误：无法加载文章 '${postId}'. ${errorMessage}` :
          `Error: Could not load post '${postId}'. ${errorMessage}`;
      const backLinkText = this.currentLanguage === 'zh' ? '← 返回博客列表' : '← Back to blog list';
      
      // Keep the error message within the standard layout if possible
      container.innerHTML = 
          `<div class="error-message">` +
          `<p>${errorMsgHtml}</p>` +
          `<a href="blog.html" class="button secondary">${backLinkText}</a>` +
          `</div>`;
      // We don't call hideBlogListElements here because the target container was already cleared
  }

  updatePostLanguageDisplay() {
    // **将 pageType 声明移到使用之前**
    let pageType = 'Unknown'; // For logging
    
    console.log(`[BlogManager][${pageType}] === Starting updatePostLanguageDisplay for lang: ${this.currentLanguage} ===`); // DEBUG: Mark start
    let scope = document;

    if (this.isBlogListPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('post');
        if(postId) {
            scope = document.querySelector('main#main-content section.content-box') || document;
            pageType = 'Blog List (Dynamic Post)';
            console.log(`[BlogManager][${pageType}] Scope set to contentBox for dynamic article on ${pageType}`); // DEBUG
        } else {
            pageType = 'Blog List (List View)';
            console.log(`[BlogManager][${pageType}] On ${pageType}, skipping post language update.`); // DEBUG
            return; 
        }
    } else if (this.isSinglePostPage) {
        scope = document;
        pageType = 'Single Post Page';
        console.log(`[BlogManager][${pageType}] Scope set to document.`); // DEBUG
    } else {
        pageType = 'Other Page (e.g., Homepage)';
        console.log(`[BlogManager][${pageType}] Not on article page (${pageType}), skipping post language update.`); // DEBUG
        return;
    }

    // 1. 查找所有语言元素
    const allLangElements = scope.querySelectorAll('[data-lang-en], [data-lang-zh]');
    console.log(`[BlogManager][${pageType}] Found ${allLangElements.length} total language elements.`); // DEBUG
    
    // 2. 移除 active 类
    let hiddenCount = 0;
    console.log(`[BlogManager][${pageType}] --- Attempting to remove 'active' class ---`); // DEBUG
    allLangElements.forEach((el, index) => {
        if (el.classList.contains('active')) {
            el.classList.remove('active');
            hiddenCount++;
            // console.log(`[BlogManager][${pageType}] Removed active from [${index}]:`, el.tagName, el.getAttribute('data-lang-en') !== null ? 'EN' : 'ZH', el.textContent.substring(0, 30) + '...'); // DEBUG: Verbose logging
        }
    });
    console.log(`[BlogManager][${pageType}] --- Finished removing active class. Count: ${hiddenCount} ---`); // DEBUG

    // 3. 查找当前语言元素
    const selector = `[data-lang-${this.currentLanguage}]`;
    const currentLangElements = scope.querySelectorAll(selector);
    console.log(`[BlogManager][${pageType}] Found ${currentLangElements.length} elements for selector '${selector}' to show.`); // DEBUG
    
    // 4. 添加 active 类
    let shownCount = 0;
    console.log(`[BlogManager][${pageType}] --- Attempting to add 'active' class for ${this.currentLanguage} ---`); // DEBUG
    currentLangElements.forEach((el, index) => {
        // 检查是否已经有 active (理论上不应该有，除非逻辑问题)
        if (!el.classList.contains('active')) {
             el.classList.add('active');
             shownCount++;
             console.log(`[BlogManager][${pageType}] Added active to [${index}]:`, el.tagName, el.textContent.substring(0, 50) + '...'); // DEBUG
        } else {
             console.warn(`[BlogManager][${pageType}] Element already had active class? [${index}]:`, el.tagName); // DEBUG
        }
    });
    console.log(`[BlogManager][${pageType}] --- Finished adding active class. Count: ${shownCount} ---`); // DEBUG

    // 确保文章容器本身可见 (主要用于动态加载场景)
    if (this.isBlogListPage) {
        const articleContainer = scope.querySelector('.blog-article-container');
        if (articleContainer && articleContainer.style.display !== 'block') {
            articleContainer.style.display = 'block'; 
            console.log(`[BlogManager][${pageType}] Ensured dynamic article container is visible.`); // DEBUG
        }
    } 
    // For Single Post Page, the container should naturally be visible unless CSS hides it.
    else if (this.isSinglePostPage) {
        const articleContainer = scope.querySelector('article.blog-article-container');
        if (articleContainer && window.getComputedStyle(articleContainer).display === 'none') {
             console.warn(`[BlogManager][${pageType}] Article container 'article.blog-article-container' is computed as display:none. Check CSS.`);
        }
    }
    console.log(`[BlogManager][${pageType}] === Finished updatePostLanguageDisplay for lang: ${this.currentLanguage} ===`); // DEBUG: Mark end
  }
}

// Remove the global initialization and export from here
// Initialization happens in blog.html
// window.blogManager = blogManager; // Remove if not needed globally

export default BlogManager; // Ensure the class is exported 