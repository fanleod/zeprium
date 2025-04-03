// 导航组件 - v2.1 (集成 LangSwitcher)
import LangSwitcher from './lang-switcher.js';

class Navigation {
  constructor(options = {}) {
    this.options = {
      basePath: '',
      logoPath: 'images/zeprium-logo',
      ...options
    };
    
    this.init();
  }

  init() {
    this.createNavigation();
    this.setupEventListeners();
    // Instantiate LangSwitcher after navigation is added to the DOM
    this.langSwitcher = new LangSwitcher('.lang-switcher-container'); 
  }

  createNavigation() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    const basePath = this.options.basePath || this.getBasePath(pathParts);
    
    const navHTML = this.createNavHTML(basePath, currentPath);
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }

  getBasePath(pathParts) {
    // 根目录或首页
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'index.html')) {
      return '';
    }
    
    // 在 /pages/ 但不在子目录 (e.g., /pages/about.html)
    if (pathParts.length === 2 && pathParts[0] === 'pages' && pathParts[1].endsWith('.html')) {
        return '../'; // 从 pages/xxx.html 回到根目录
    }
    
    // 在 /pages/ 的子目录中 (e.g., /pages/blog/xxx.html, /pages/projects/xxx.html)
    if (pathParts.length >= 2 && pathParts[0] === 'pages' && pathParts[1] !== '') {
        // 计算需要回退的层级数，相对于 /pages/ 目录
        // e.g., pages/blog/ -> 需要 ../../ (2)
        // e.g., pages/projects/ -> 需要 ../../ (2)
        // e.g., pages/foo/bar/ -> 需要 ../../../../ (4)
        // pathParts.length gives total segments. Need to go up (length) levels.
        // Let's rethink. Base path relates to the *root*. 
        // If path starts with 'pages', we need to go up relative to that.
        // /pages/about.html -> needs ../ to get to root for images/
        // /pages/blog/post.html -> needs ../../ to get to root for images/
        // /pages/projects/detail.html -> needs ../../
        
        // Simpler logic: If the path starts with 'pages' and has more than one segment after 'pages'
        if (pathParts.length > 2 && pathParts[0] === 'pages') {
            return '../../'; // Assumes max one level deep under /pages like /pages/blog/
        }
        // If exactly /pages/something.html
        if (pathParts.length === 2 && pathParts[0] === 'pages') {
             return '../';
        }
    }
    
    // 默认情况或其他未预料的结构 (尝试 ../)
    // This might catch cases like /blog.html if it exists at root.
    console.warn(`[Navigation] Unhandled path structure for basePath calculation: ${pathParts.join('/')}. Defaulting to '../'.`);
    return '../'; 
  }

  createNavHTML(basePath, currentPath) {
    return `
      <header class="site-header">
        <a href="${basePath}index.html" aria-label="Back to Homepage">
          <picture class="logo-picture">
            <source srcset="${basePath}${this.options.logoPath}-light.avif" type="image/avif" 
                    media="(prefers-color-scheme: dark) and (dynamic-range: high)">
            <source srcset="${basePath}${this.options.logoPath}-light.avif" type="image/avif" 
                    media="(prefers-color-scheme: dark) and (color-gamut: p3)">
            <source srcset="${basePath}${this.options.logoPath}-light.png" type="image/png" 
                    media="(prefers-color-scheme: dark)">
            <source srcset="${basePath}${this.options.logoPath}.avif" type="image/avif" 
                    media="(dynamic-range: high)">
            <source srcset="${basePath}${this.options.logoPath}.avif" type="image/avif" 
                    media="(color-gamut: p3)">
            <img src="${basePath}${this.options.logoPath}.png" alt="Logo" loading="lazy" class="site-logo" draggable="false">
          </picture>
        </a>
      </header>
      <nav id="site-nav" class="site-navigation">
        <div class="nav-container">
          <div class="nav-links">
            ${this.createNavLinks(basePath, currentPath)}
          </div>
          <div class="lang-switcher-container">
            <slot name="lang-switcher"></slot>
          </div>
        </div>
      </nav>
    `;
  }

  createNavLinks(basePath, currentPath) {
    const links = [
      { href: 'about.html', label: 'About' },
      { href: 'projects.html', label: 'Projects' },
      { href: 'blog.html', label: 'Blog' },
      { href: 'contact.html', label: 'Contact' },
      { href: 'styleguide.html', label: 'Style Guide' }
    ];

    return links.map(link => {
      // 获取当前页面的完整路径
      const currentPage = currentPath.split('/').pop();
      // 获取链接的完整路径
      const linkPage = link.href;
      
      // 检查是否是首页
      const isHomePage = currentPage === 'index.html' || currentPage === '';
      
      // 检查当前页面是否匹配链接
      const isActive = !isHomePage && currentPage === linkPage;
      
      // 如果是首页，检查是否在pages目录下
      const isInPages = currentPath.includes('/pages/');
      const isActiveInPages = isInPages && currentPage === linkPage;
      
      // 最终判断是否激活
      const shouldBeActive = isActive || isActiveInPages;
      
      return `<a href="${basePath}pages/${link.href}" 
                 class="nav-link ${shouldBeActive ? 'active' : ''}" 
                 aria-label="${link.label}"
                 data-page="${link.href}">${link.label}</a>`;
    }).join('');
  }

  setupEventListeners() {
    // 阻止logo右键点击
    const logoImage = document.querySelector('.site-logo');
    if (logoImage) {
      logoImage.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    // 设置滚动检测
    this.setupScrollDetection();
  }

  setupScrollDetection() {
    const nav = document.getElementById('site-nav');
    const header = document.querySelector('.site-header');
    // LangSwitcher instance will handle its own scroll state changes
    // const langSwitcherContainer = document.querySelector('.lang-switcher-container'); 
    
    if (!nav || !header) return;
    
    const headerHeight = header.offsetHeight;
    
    const updateScrollStyle = (isScrolled) => {
      if (nav) {
        const navWasScrolled = nav.classList.contains('scrolled');
        nav.classList.toggle('scrolled', isScrolled);
        
        // Only update styles if scroll state changed
        if (navWasScrolled !== isScrolled) {
            // Dispatch event for LangSwitcher
            document.dispatchEvent(new CustomEvent('navScrolled', { detail: { isScrolled } }));
        }
      }
      
      // Removed direct manipulation of langSwitcherContainer class
      // if (langSwitcherContainer) {
      //   langSwitcherContainer.classList.toggle('scrolled', isScrolled);
      // }
    };
    
    // Get initial scroll state correctly
    let initialScrollY = window.scrollY;
    let initialIsScrolled = initialScrollY > headerHeight;
    updateScrollStyle(initialIsScrolled);
    // Need to manually dispatch the initial state for LangSwitcher
    document.dispatchEvent(new CustomEvent('navScrolled', { detail: { isScrolled: initialIsScrolled } }));

    // Use passive: true for better scroll performance
    window.addEventListener('scroll', this.debounce(() => {
      updateScrollStyle(window.scrollY > headerHeight);
    }, 10), { passive: true });
    
    // Debounced resize listener
    window.addEventListener('resize', this.debounce(() => {
      // Re-calculate header height on resize and update scroll style
      const newHeaderHeight = header.offsetHeight;
      updateScrollStyle(window.scrollY > newHeaderHeight);
    }, 100));
    
    // Color scheme change listener
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        // Re-apply background color based on new scheme if scrolled
        /* 移除这里的直接样式修改，让 CSS 类和媒体查询处理
        if (nav.classList.contains('scrolled')) {
            nav.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches 
                ? 'rgba(18, 18, 18, 0.85)' 
                : 'rgba(255, 255, 255, 0.8)';
        }
        */
      });
    }
  }

  debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // REMOVE autoInit static method as initialization is now tied to the class instance
  /* 
  static autoInit() {
    // Check if navigation already exists
    if (document.querySelector('.site-navigation')) {
      return;
    }
    
    // Create navigation instance
    const navigation = new Navigation();
    
    // Remove manual lang switcher creation
    // const langSwitcher = document.createElement('div');
    // langSwitcher.className = 'lang-switcher';
    // langSwitcher.innerHTML = `
    //   <button id="lang-toggle" aria-label="Switch language" title="切换语言">
    //     <span class="lang-text">EN</span>
    //   </button>
    // `;
    // 
    // // Insert into the designated container (which might not exist yet if nav creates it)
    // const langSwitcherContainer = document.querySelector('.lang-switcher-container');
    // if (langSwitcherContainer) {
    //   langSwitcherContainer.appendChild(langSwitcher);
    // }
  }
  */
}

// Auto-initialize Navigation on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Only create one instance
  if (!document.querySelector('.site-navigation')) {
    new Navigation();
    // LangSwitcher is now instantiated within the Navigation constructor
  }
});

// Export Navigation component
export default Navigation; 