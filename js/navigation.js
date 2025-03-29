// Function to generate and insert the navigation bar
function createNavigation() {
  // Get the current page path to highlight the active link
  const currentPath = window.location.pathname;
  const isRoot = currentPath === '/' || currentPath.endsWith('index.html');
  const basePath = isRoot ? '' : '../';
  
  // Create the navigation HTML
  const navHTML = `
    <header>
      <img src="${basePath}images/zeprium-logo.png" alt="Zeprium Logo" class="site-logo" draggable="false" oncontextmenu="return false;">
    </header>
    <nav>
      <div class="nav-container">
        <a href="${isRoot ? 'index.html' : '../index.html'}" ${currentPath.includes('index.html') ? 'class="active"' : ''}>Home</a>
        <a href="${isRoot ? 'pages/about.html' : 'about.html'}" ${currentPath.includes('about.html') ? 'class="active"' : ''}>About</a>
        <a href="${isRoot ? 'pages/projects.html' : 'projects.html'}" ${currentPath.includes('projects.html') ? 'class="active"' : ''}>Projects</a>
        <a href="${isRoot ? 'pages/blog.html' : 'blog.html'}" ${currentPath.includes('blog.html') ? 'class="active"' : ''}>Blog</a>
        <a href="${isRoot ? 'pages/contact.html' : 'contact.html'}" ${currentPath.includes('contact.html') ? 'class="active"' : ''}>Contact</a>
        <a href="${isRoot ? 'pages/styleguide.html' : 'styleguide.html'}" class="dev-only">Style Guide</a>
      </div>
    </nav>
  `;
  
  // Get the body element
  const body = document.body;
  
  // Insert the navigation at the beginning of the body
  body.insertAdjacentHTML('afterbegin', navHTML);
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', createNavigation); 