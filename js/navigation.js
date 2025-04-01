// 导航栏脚本 - v1.4
// 更新于2024年3月 - 优化导航链接激活状态逻辑
function createNavigation() {
  // 获取当前页面路径和基础路径
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/').filter(Boolean);
  const basePath = getBasePath(pathParts);

  // 创建导航HTML
  const navHTML = createNavHTML(basePath, currentPath);
  
  // 在body开始处插入导航
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  
  // 初始化导航功能
  initializeNavigation();
}

// 根据路径确定基础路径
function getBasePath(pathParts) {
  const isRoot = pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'index.html');
  const isInSubfolder = pathParts.length >= 2 && pathParts[pathParts.length - 2] === 'projects';
  
  if (isRoot) return '';
  if (isInSubfolder) return '../../';
  return '../';
}

// 创建导航HTML
function createNavHTML(basePath, currentPath) {
  return `
    <header>
      <a href="${basePath}index.html" aria-label="Back to Homepage">
        <picture class="logo-picture">
          <!-- 夜间模式HDR logo -->
          <source srcset="${basePath}images/zeprium-logo-light.avif" type="image/avif" 
                  media="(prefers-color-scheme: dark) and (dynamic-range: high)">
          <!-- 夜间模式P3色域 -->
          <source srcset="${basePath}images/zeprium-logo-light.avif" type="image/avif" 
                  media="(prefers-color-scheme: dark) and (color-gamut: p3)">
          <!-- 夜间模式普通logo -->
          <source srcset="${basePath}images/zeprium-logo-light.png" type="image/png" 
                  media="(prefers-color-scheme: dark)">
          <!-- 日间模式HDR logo -->
          <source srcset="${basePath}images/zeprium-logo.avif" type="image/avif" 
                  media="(dynamic-range: high)">
          <!-- 日间模式P3色域 -->
          <source srcset="${basePath}images/zeprium-logo.avif" type="image/avif" 
                  media="(color-gamut: p3)">
          <!-- 普通PNG后备 -->
          <img src="${basePath}images/zeprium-logo.png" alt="Zeprium Logo" class="site-logo" draggable="false">
        </picture>
      </a>
    </header>
    <nav id="site-nav">
      <div class="nav-container">
        <div class="nav-links">
          ${createNavLinks(basePath, currentPath)}
        </div>
        <div class="lang-switcher-container">
          <div class="lang-switcher">
            <button id="lang-toggle" aria-label="Switch language" title="切换语言">
              <span class="lang-text">EN</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

// 创建导航链接
function createNavLinks(basePath, currentPath) {
  const links = [
    { href: 'about.html', label: 'About' },
    { href: 'projects.html', label: 'Projects' },
    { href: 'blog.html', label: 'Blog' },
    { href: 'contact.html', label: 'Contact' },
    { href: 'styleguide.html', label: 'Style Guide' }
  ];

  return links.map(link => {
    // 改进active状态的判断逻辑
    const isActive = currentPath.endsWith(link.href) || 
                    currentPath.includes(`/pages/${link.href}`) ||
                    (link.href === 'index.html' && currentPath === '/');
    
    return `<a href="${basePath}pages/${link.href}" ${isActive ? 'class="active"' : ''} aria-label="${link.label}">${link.label}</a>`;
  }).join('');
}

// 初始化导航功能
function initializeNavigation() {
  // 阻止logo右键点击
  const logoImage = document.querySelector('.site-logo');
  if (logoImage) {
    logoImage.addEventListener('contextmenu', e => e.preventDefault());
  }
  
  // 设置滚动检测
  setupScrollDetection();
}

// 设置滚动检测
function setupScrollDetection() {
  const nav = document.getElementById('site-nav');
  const header = document.querySelector('header');
  const langSwitcher = document.querySelector('.lang-switcher');
  
  if (!nav || !header) return;
  
  const headerHeight = header.offsetHeight;
  
  // 初始检查
  updateScrollStyle(window.scrollY > headerHeight);
  
  // 监听滚动事件
  window.addEventListener('scroll', debounce(() => {
    updateScrollStyle(window.scrollY > headerHeight);
  }, 10));
  
  // 监听窗口大小改变
  window.addEventListener('resize', debounce(() => {
    updateScrollStyle(window.scrollY > headerHeight);
  }, 100));
  
  // 监听颜色模式变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (nav.classList.contains('scrolled')) {
        updateScrollStyle(true);
      }
    });
  }
}

// 更新滚动样式
function updateScrollStyle(isScrolled) {
  const nav = document.getElementById('site-nav');
  const langSwitcher = document.querySelector('.lang-switcher');
  
  if (nav) {
    nav.classList.toggle('scrolled', isScrolled);
    if (isScrolled) {
      nav.style.webkitBackdropFilter = 'blur(10px)';
      nav.style.backdropFilter = 'blur(10px)';
      nav.style.backgroundColor = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'rgba(18, 18, 18, 0.85)' 
        : 'rgba(255, 255, 255, 0.8)';
    } else {
      nav.style.webkitBackdropFilter = '';
      nav.style.backdropFilter = '';
      nav.style.backgroundColor = '';
    }
  }
  
  if (langSwitcher) {
    langSwitcher.classList.toggle('scrolled', isScrolled);
  }
}

// 防抖函数
function debounce(func, wait = 20) {
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

// 初始化导航
document.addEventListener('DOMContentLoaded', createNavigation); 