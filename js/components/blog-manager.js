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
    // Correct logic: Always link to the page specified in post.url (pages/blog.html) 
    // and append the parameters from post.urlParams.
    // Ensure the base path starts with a '/' to make it absolute from the root.
    let targetPageUrl = post.url; // Should be "pages/blog.html"
    if (!targetPageUrl.startsWith('/')) {
        targetPageUrl = '/' + targetPageUrl; // Make it absolute: "/pages/blog.html"
    }
    
    let urlParams = post.urlParams || ''; // e.g., "?post=the-making-of-zeprium"

    // No complex relative path adjustments needed for the link destination itself.
    let finalUrl = targetPageUrl; // Starts with "/pages/blog.html"

    // Append urlParams
    if (urlParams) {
        finalUrl += urlParams;
    }
    
    console.log(`[BlogManager] getPostUrl: Target page (absolute): ${targetPageUrl}, Params: ${urlParams}`); // DEBUG

    // Append language parameter
    const langParam = this.currentLanguage === 'zh' ? 'lang=zh' : '';
    if (langParam) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + langParam;
    }

    console.log(`[BlogManager] getPostUrl: Final generated URL: ${finalUrl}`); // DEBUG
    return finalUrl;
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
   */
  setupFilters() {
    // Do not setup filters if we are displaying a single post
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('post')) {
      console.log('[BlogManager] Skipping filter setup because a single post is being displayed.');
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
    if (!contentBox) {
        console.warn('[BlogManager] hideBlogListElements: Content box not found.'); // DEBUG
        return;
    }

    const blogGrid = contentBox.querySelector(this.config.gridSelector);
    const filters = contentBox.querySelector('.blog-filters');
    const blogIntroH1 = contentBox.querySelector('h1'); 
    const blogIntroP = contentBox.querySelector('p');
    
    console.log('[BlogManager] Attempting to hide blog list elements:', { grid: !!blogGrid, filters: !!filters, h1: !!blogIntroH1, p: !!blogIntroP }); // DEBUG

    if (blogGrid) blogGrid.style.display = 'none';
    if (filters) {
        filters.style.display = 'none';
        console.log('[BlogManager] Filters hidden.'); // DEBUG
    } else {
        console.warn('[BlogManager] hideBlogListElements: Filters element (.blog-filters) not found in contentBox.'); // DEBUG
    }
    if (blogIntroH1) blogIntroH1.style.display = 'none'; 
    if (blogIntroP) blogIntroP.style.display = 'none'; 
  }

  /**
   * 显示博客列表、过滤器及介绍文字 (如果它们存在)
   */
   showBlogListElements() {
    const contentBox = document.querySelector('main#main-content section.content-box');
    if (!contentBox) {
        console.warn('[BlogManager] showBlogListElements: Content box not found.'); // DEBUG
        return;
    }

    const blogGrid = contentBox.querySelector(this.config.gridSelector);
    const filters = contentBox.querySelector('.blog-filters');
    const blogIntroH1 = contentBox.querySelector('h1');
    const blogIntroP = contentBox.querySelector('p');

    console.log('[BlogManager] Attempting to show blog list elements:', { grid: !!blogGrid, filters: !!filters, h1: !!blogIntroH1, p: !!blogIntroP }); // DEBUG

    if (blogGrid) blogGrid.style.display = ''; // Reset to default display
    if (filters) {
        filters.style.display = ''; // Reset to default display
         console.log('[BlogManager] Filters shown (display reset).'); // DEBUG
    } else {
        // This might be expected if filters haven't been created yet or aren't needed on this view
        console.log('[BlogManager] showBlogListElements: Filters element (.blog-filters) not found (might be normal if not yet created or not applicable).'); // DEBUG
    }
    if (blogIntroH1) blogIntroH1.style.display = ''; // Reset display
    if (blogIntroP) blogIntroP.style.display = ''; // Reset display
  }
  
  /**
   * 获取并显示单个博客文章
   * @param {Object} post - 博客文章的元数据 (来自 JSON)
   * @param {String} postId - 文章 ID
   */
  async displayBlogPost(post, postId) {
    console.log(`[BlogManager] Starting displayBlogPost for postId: ${postId}`); // DEBUG
    const contentBox = document.querySelector('main#main-content section.content-box');
    const pageTitleElement = document.querySelector('title');
    const metaTitleEn = document.querySelector('meta[name="title-en"]');
    const metaTitleZh = document.querySelector('meta[name="title-zh"]');

    if (!contentBox) {
        console.error('[BlogManager] Target content container `main section.content-box` not found.');
        const mainContent = document.getElementById('main-content');
        if(mainContent) {
             mainContent.innerHTML = '<p class="error-message">Page structure error. Cannot load post.</p>';
        }
        return;
    }
    console.log('[BlogManager] Target container found. Clearing and showing loading message.'); // DEBUG
    contentBox.innerHTML = '<p class="loading-message">Loading post...</p>';

    try {
      // Correct logic: Fetch the HTML file based on postId.
      // Since this runs on pages/blog.html, and the post HTML 
      // (e.g., the-making-of-zeprium.html) is in the *same* directory (pages/blog/),
      // the fetch URL is simply the filename.
      const filename = `${postId}.html`;
      // const fetchUrl = filename; // Fetch relative to the current page (pages/blog.html) - Original
      // Force absolute path for fetch, as direct access works but relative fetch fails.
      const fetchUrl = `/pages/blog/${filename}`; 
      
      console.log(`[BlogManager] Fetching post HTML using *absolute* path: ${fetchUrl}`); // DEBUG
      const response = await fetch(fetchUrl); 
      console.log(`[BlogManager] Fetch response status: ${response.status}`); // DEBUG
      if (!response.ok) {
         let errorDetail = '';
         let responseText = '';
         try {
             // Try to get text even on error, might contain helpful server message
             responseText = await response.text(); 
             errorDetail = responseText.substring(0, 500); // Limit length
         } catch (textError) {
             errorDetail = `(Could not read error response body: ${textError})`;
         }
         // Log more details
         console.error(`[BlogManager] Fetch failed! Status: ${response.status}, StatusText: ${response.statusText}, URL: ${response.url}. Response snippet: ${errorDetail}`);
         // Also log request details used
         console.error(`[BlogManager] Fetch was initiated for postId: ${postId}, requested filename: ${filename}, absolute URL used: ${fetchUrl}`);

         throw new Error(`HTTP error fetching post content! Status: ${response.status}. URL: ${fetchUrl}. Response snippet: ${errorDetail}`);
      }
      const postHtml = await response.text();
      console.log('[BlogManager] Post HTML fetched successfully.'); // DEBUG

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = postHtml;

      const postArticle = tempDiv.querySelector('article.blog-article-container');
      // Find the language script within the fetched HTML's article section
      const languageScriptElement = postArticle?.querySelector('script:not([src])');
      const languageScriptContent = languageScriptElement?.textContent;
      const fetchedTitle = tempDiv.querySelector('title')?.textContent || `${post.title} - Zeprium`;
      const fetchedMetaEn = tempDiv.querySelector('meta[name="title-en"]')?.getAttribute('content');
      const fetchedMetaZh = tempDiv.querySelector('meta[name="title-zh"]')?.getAttribute('content');
      // Remove the script from the article before injecting to avoid duplicate execution if browser somehow runs it
      languageScriptElement?.remove(); 

      if (postArticle) {
        console.log('[BlogManager] Article container found in fetched HTML.'); // DEBUG
        // Update page title and meta first
        console.log(`[BlogManager] Updating title to: ${fetchedTitle}`); // DEBUG
        if (pageTitleElement) pageTitleElement.textContent = fetchedTitle;
        if (metaTitleEn && fetchedMetaEn) metaTitleEn.setAttribute('content', fetchedMetaEn);
        if (metaTitleZh && fetchedMetaZh) metaTitleZh.setAttribute('content', fetchedMetaZh);

        // Clear loading message from contentBox and inject the fetched article
        console.log('[BlogManager] Clearing container and injecting article.'); // DEBUG
        contentBox.innerHTML = ''; 
        contentBox.appendChild(postArticle);
        console.log('[BlogManager] Article injected successfully.'); // DEBUG

        // Execute the extracted inline language script AFTER injecting the content
        if (languageScriptContent) {
           console.log('[BlogManager] Attempting to execute extracted inline script.'); // DEBUG
          try {
            // Use a function constructor for slightly safer execution than eval
            (new Function(languageScriptContent))(); 
            console.log('[BlogManager] Executed inline language script for post:', postId);
          } catch (scriptError) {
            console.error('[BlogManager] Error executing inline script from loaded post:', scriptError);
          } 
        } else {
          console.log('[BlogManager] No inline script found in article or script content missing.'); // DEBUG
        }
      } else {
        console.error('[BlogManager] Could not find `<article class="blog-article-container">` in fetched HTML.'); // DEBUG
        throw new Error('Could not find `<article class="blog-article-container">` in the fetched HTML.');
      }
    } catch (error) {
      console.error('[BlogManager] Error loading or displaying blog post:', error); // DEBUG
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
}

// Remove the global initialization and export from here
// Initialization happens in blog.html
// window.blogManager = blogManager; // Remove if not needed globally

export default BlogManager; // Ensure the class is exported 