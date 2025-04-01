// 导航栏脚本 - v1.4
// 更新于2024年3月 - 优化导航链接激活状态逻辑
function createNavigation() {
  // 获取当前页面路径和基础路径
  const currentPath = window.location.pathname;
  const basePath = currentPath.includes('/pages/') ? '../' : './';
  
  // 创建导航栏HTML
  const navHTML = `
    <div class="nav-container">
      <div class="nav-links">
        ${createNavLinks(basePath, currentPath)}
      </div>
      <div class="lang-switcher-container">
        <div class="lang-switcher">
          <button id="lang-toggle" aria-label="Switch Language">EN</button>
        </div>
      </div>
    </div>
  `;
  
  // 插入导航栏
  const navElement = document.createElement('nav');
  navElement.innerHTML = navHTML;
  document.body.insertBefore(navElement, document.body.firstChild);
  
  // 添加滚动效果
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });
  
  // 语言切换功能
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const currentLang = document.documentElement.lang;
      const newLang = currentLang === 'en' ? 'zh' : 'en';
      document.documentElement.lang = newLang;
      langToggle.textContent = newLang.toUpperCase();
      langToggle.classList.toggle('lang-zh', newLang === 'zh');
      
      // 更新所有语言特定的内容
      document.querySelectorAll('[data-lang-en], [data-lang-zh]').forEach(el => {
        el.style.display = el.getAttribute(`data-lang-${newLang}`) ? 'block' : 'none';
      });
    });
  }
}

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
    
    return `<a href="${basePath}pages/${link.href}" ${isActive ? 'class="active"' : ''} aria-label="${link.label}" tabindex="0">${link.label}</a>`;
  }).join('');
}

// 页面加载完成后创建导航栏
document.addEventListener('DOMContentLoaded', createNavigation); 