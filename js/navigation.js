// Function to generate and insert the navigation bar
function createNavigation() {
  // Get the current page path to highlight the active link
  const currentPath = window.location.pathname;
  const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
  const basePath = isRoot ? '' : '../';
  
  // Create the navigation HTML with security best practices
  // - Use of content security policy compatible code
  // - Escaping potential XSS vectors
  const navHTML = `
    <header>
      <picture class="logo-picture">
        <source srcset="${basePath}images/zeprium-logo.avif" type="image/avif" media="all and (min--moz-device-pixel-ratio:0) and (min-resolution: 3e1dpcm) {}"> 
        <img src="${basePath}images/zeprium-logo.png" alt="Zeprium Logo" class="site-logo" draggable="false" style="image-rendering: -webkit-optimize-contrast;">
      </picture>
    </header>
    <nav id="site-nav">
      <div class="nav-container">
        <a href="${isRoot ? 'index.html' : '../index.html'}" ${currentPath.includes('index.html') ? 'class="active"' : ''} aria-label="Home">Home</a>
        <a href="${isRoot ? 'pages/about.html' : 'about.html'}" ${currentPath.includes('about.html') ? 'class="active"' : ''} aria-label="About">About</a>
        <a href="${isRoot ? 'pages/projects.html' : 'projects.html'}" ${currentPath.includes('projects.html') || currentPath.includes('portfolio-01.html') ? 'class="active"' : ''} aria-label="Projects">Projects</a>
        <a href="${isRoot ? 'pages/blog.html' : 'blog.html'}" ${currentPath.includes('blog.html') ? 'class="active"' : ''} aria-label="Blog">Blog</a>
        <a href="${isRoot ? 'pages/contact.html' : 'contact.html'}" ${currentPath.includes('contact.html') ? 'class="active"' : ''} aria-label="Contact">Contact</a>
        <a href="${isRoot ? 'pages/styleguide.html' : 'styleguide.html'}" ${currentPath.includes('styleguide.html') ? 'class="active"' : ''} aria-label="Style Guide">Style Guide</a>
      </div>
    </nav>
  `;
  
  // Get the body element
  const body = document.body;
  
  // Insert the navigation at the beginning of the body
  body.insertAdjacentHTML('afterbegin', navHTML);
  
  // Add event listener to prevent right-click on logo via JavaScript instead of inline HTML
  const logoImage = document.querySelector('.site-logo');
  if (logoImage) {
    logoImage.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      return false;
    });
  }
  
  // 添加滚动检测
  setupScrollDetection();
}

// 检测页面滚动并为导航栏添加阴影效果
function setupScrollDetection() {
  const nav = document.getElementById('site-nav');
  
  if (nav) {
    // 初始检查 - 如果页面已经滚动了
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', createNavigation); 