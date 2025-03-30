// 导航栏脚本 - v1.3
function createNavigation() {
  // 获取当前页面路径
  const currentPath = window.location.pathname;
  
  // 判断页面层级
  const pathParts = currentPath.split('/').filter(part => part !== '');
  const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
  const isInProjectsSubfolder = pathParts.length >= 2 && pathParts[0] === 'pages' && pathParts[1] === 'projects' && pathParts.length >= 3;
  const isInBlogSubfolder = pathParts.length >= 2 && pathParts[0] === 'pages' && pathParts[1] === 'blog' && pathParts.length >= 3;
  const isInSubfolder = isInProjectsSubfolder || isInBlogSubfolder;
  const isInPages = pathParts.length >= 1 && pathParts[0] === 'pages' && !isInSubfolder;
  
  // 根据页面层级确定基础路径
  let basePath = '';
  if (isRoot) {
    basePath = '';
  } else if (isInSubfolder) {
    basePath = '../../';
  } else if (pathParts.length >= 1) {
    basePath = '../';
  }
=======
  const basePath = isRoot ? '' : '../';
>>>>>>> parent of 45cf682 (更新navigation.js以根据页面层级动态设置基础路径，确保导航链接在不同文件夹结构下正确指向。更新portfolio-template.html中的项目链接，修正为指向当前模板页面。</message>)
  
  // 创建导航HTML
  const navHTML = `
    <header>
      <a href="${basePath}index.html" aria-label="Back to Homepage">
        <picture class="logo-picture">
          <!-- 夜间模式使用的浅色HDR logo -->
          <source srcset="${basePath}images/zeprium-logo-light.avif" type="image/avif" 
                  media="(prefers-color-scheme: dark) and (dynamic-range: high)">
          <!-- 支持P3色域但非HDR的夜间模式 -->  
          <source srcset="${basePath}images/zeprium-logo-light.avif" type="image/avif" 
                  media="(prefers-color-scheme: dark) and (color-gamut: p3)">
          <!-- 夜间模式使用的浅色普通logo (后备) -->
          <source srcset="${basePath}images/zeprium-logo-light.png" type="image/png" 
                  media="(prefers-color-scheme: dark)">
          <!-- 日间模式使用的HDR logo -->
          <source srcset="${basePath}images/zeprium-logo.avif" type="image/avif" 
                  media="(dynamic-range: high)">
          <!-- 支持P3色域但非HDR的日间模式 -->
          <source srcset="${basePath}images/zeprium-logo.avif" type="image/avif" 
                  media="(color-gamut: p3)">
          <!-- 普通PNG作为后备 -->
          <img src="${basePath}images/zeprium-logo.png" alt="Zeprium Logo" class="site-logo" draggable="false">
        </picture>
      </a>
    </header>
    <nav id="site-nav">
      <div class="nav-container">
        <div class="nav-links">
          <a href="${basePath}${isRoot ? 'pages/about.html' : isInSubfolder ? '../about.html' : 'about.html'}" ${currentPath.includes('/about.html') ? 'class="active"' : ''}>About</a>
          <a href="${basePath}${isRoot ? 'pages/projects.html' : isInSubfolder ? '../projects.html' : 'projects.html'}" ${(currentPath.includes('/projects.html') || (isInProjectsSubfolder && !currentPath.endsWith('.html'))) ? 'class="active"' : ''}>Projects</a>
          <a href="${basePath}${isRoot ? 'pages/blog.html' : isInSubfolder ? '../blog.html' : 'blog.html'}" ${(currentPath.includes('/blog.html') || (isInBlogSubfolder && !currentPath.endsWith('.html'))) ? 'class="active"' : ''}>Blog</a>
          <a href="${basePath}${isRoot ? 'pages/contact.html' : isInSubfolder ? '../contact.html' : 'contact.html'}" ${currentPath.includes('/contact.html') ? 'class="active"' : ''}>Contact</a>
          <a href="${basePath}${isRoot ? 'pages/styleguide.html' : isInSubfolder ? '../styleguide.html' : 'styleguide.html'}" ${currentPath.includes('/styleguide.html') ? 'class="active"' : ''}>Style Guide</a>
        </div>
        <div class="lang-switcher">
          <button id="lang-toggle" aria-label="Switch language" title="切换语言">
            <span class="lang-text">EN</span>
          </button>
        </div>
      </div>
    </nav>
  `;
  
  // 在body开始处插入导航
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  
  // 初始化语言切换按钮
  setupLanguageSwitcher();
  
  // 阻止logo右键点击
  const logoImage = document.querySelector('.site-logo');
  if (logoImage) {
    logoImage.addEventListener('contextmenu', e => e.preventDefault());
  }
  
  // 添加滚动检测
  setupScrollDetection();
}

// 设置语言切换功能
function setupLanguageSwitcher() {
  const langToggle = document.getElementById('lang-toggle');
  if (!langToggle) return;
  
  // 应用保存的语言设置
  const savedLang = localStorage.getItem('zeprium-lang');
  if (savedLang === 'zh') {
    langToggle.querySelector('.lang-text').textContent = '中';
    langToggle.classList.add('lang-zh');
    document.documentElement.setAttribute('lang', 'zh');
    switchLanguage('zh');
  }
  
  // 添加点击事件
  langToggle.addEventListener('click', function() {
    const langText = this.querySelector('.lang-text');
    if (langText.textContent === 'EN') {
      langText.textContent = '中';
      this.classList.add('lang-zh');
      document.documentElement.setAttribute('lang', 'zh');
      localStorage.setItem('zeprium-lang', 'zh');
      switchLanguage('zh');
    } else {
      langText.textContent = 'EN';
      this.classList.remove('lang-zh');
      document.documentElement.setAttribute('lang', 'en');
      localStorage.setItem('zeprium-lang', 'en');
      switchLanguage('en');
    }
    
    // 触发语言改变事件
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: langText.textContent === 'EN' ? 'en' : 'zh' }
    }));
  });
}

// 切换内容语言
function switchLanguage(lang) {
  document.querySelectorAll('[data-lang-en], [data-lang-zh]').forEach(el => {
    const attributeName = `data-lang-${lang}`;
    if (el.hasAttribute(attributeName)) {
      el.textContent = el.getAttribute(attributeName);
    }
  });
}

// 检测页面滚动并为导航栏添加阴影效果
function setupScrollDetection() {
  const nav = document.getElementById('site-nav');
  const header = document.querySelector('header');
  const langSwitcher = document.querySelector('.lang-switcher');
  
  if (nav && header) {
    // 获取header的高度作为滚动阈值
    const headerHeight = header.offsetHeight;
    
    // 初始检查 - 如果页面已经滚动超过header高度
    updateScrollStyle(window.scrollY > headerHeight);
    
    // 监听滚动事件 - 使用防抖以提高性能
    window.addEventListener('scroll', debounce(() => {
      updateScrollStyle(window.scrollY > headerHeight);
    }, 10));
    
    // 监听窗口大小改变，重新计算header高度
    window.addEventListener('resize', debounce(() => {
      updateScrollStyle(window.scrollY > header.offsetHeight);
    }, 100));
    
    // 监听颜色模式变化
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (nav.classList.contains('scrolled')) {
          updateScrollStyle(true);
        }
      });
    }
    
    function updateScrollStyle(isScrolled) {
      if (isScrolled) {
        nav.classList.add('scrolled');
        // 显式设置CSS属性，解决一些浏览器的兼容性问题
        nav.style.webkitBackdropFilter = 'blur(10px)';
        nav.style.backdropFilter = 'blur(10px)';
        
        // 根据暗色/亮色模式设置不同的背景色
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          nav.style.backgroundColor = 'rgba(18, 18, 18, 0.85)';
          if (langSwitcher) {
            langSwitcher.style.backgroundColor = 'rgba(18, 18, 18, 0.85)';
          }
        } else {
          nav.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          if (langSwitcher) {
            langSwitcher.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          }
        }
      } else {
        nav.classList.remove('scrolled');
        // 清除显式设置的CSS属性
        nav.style.webkitBackdropFilter = '';
        nav.style.backdropFilter = '';
        nav.style.backgroundColor = '';
        
        if (langSwitcher) {
          langSwitcher.style.backgroundColor = '';
        }
      }
    }
  }
}

// 防抖函数 - 避免过多事件触发
function debounce(func, wait = 20) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// 页面加载时运行
document.addEventListener('DOMContentLoaded', createNavigation); 