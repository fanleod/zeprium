// 导航组件 - v2.1 (集成 LangSwitcher)
import LangSwitcher from './lang-switcher.js';

class Navigation {
  constructor(options = {}) {
    this.options = {
      basePath: '',
      logoPath: 'images/zeprium-logo',
      ...options
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    try {
        this.createNavigation();
        this.setupEventListeners();
        this.langSwitcher = new LangSwitcher('.lang-switcher-container'); 

    } catch (error) {
        console.error('[Navigation] Error during init:', error);
    }
  }

  createNavigation() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    const basePath = this.options.basePath || this.getBasePath(pathParts);
    
    const navHTML = this.createNavHTML(basePath, currentPath);
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }

  getBasePath(pathParts) {
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'index.html')) {
      return '';
    }
    
    if (pathParts.length === 2 && pathParts[0] === 'pages' && pathParts[1].endsWith('.html')) {
        return '../';
    }
    
    if (pathParts.length >= 2 && pathParts[0] === 'pages' && pathParts[1] !== '') {
        if (pathParts.length > 2 && pathParts[0] === 'pages') {
            return '../../';
        }
        if (pathParts.length === 2 && pathParts[0] === 'pages') {
             return '../';
        }
    }
    
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
      { href: 'about.html', en: 'About', zh: '关于', isSection: false },
      { href: 'projects.html', en: 'Projects', zh: '项目', isSection: true },
      { href: 'blog.html', en: 'Blog', zh: '博客', isSection: true },
      { href: 'contact.html', en: 'Contact', zh: '联系', isSection: false }
    ];

    const currentLang = document.documentElement.lang || 'en';
    
    const normalizedPath = currentPath.replace(/^\/|\/$/g, '').replace(/index\.html$/, '');
    const pathSegments = normalizedPath.split('/').filter(Boolean); 

    return links.map(link => {
      const linkFilename = link.href; 
      const linkBasename = linkFilename.replace('.html', ''); 
      const currentFilename = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : '';
      
      let shouldBeActive = false;

      if (link.isSection) {
        if (pathSegments.length >= 2 && pathSegments[0] === 'pages') {
            if (pathSegments[1] === linkBasename || 
                (pathSegments.length === 2 && currentFilename === linkFilename)) {
                 shouldBeActive = true;
            }
        }
      } else {
        if (pathSegments.length === 2 && pathSegments[0] === 'pages' && currentFilename === linkFilename) {
          shouldBeActive = true;
        }
      }
      
      const initialText = currentLang === 'zh' ? link.zh : link.en;
      const activeClass = shouldBeActive ? 'active' : '';

      return `<a href="${basePath}pages/${link.href}" 
                 class="nav-link ${activeClass}" 
                 aria-label="${link.en}"
                 data-page="${link.href}"
                 data-lang-en="${link.en}"
                 data-lang-zh="${link.zh}">${initialText}</a>`;
    }).join('');
  }

  setupEventListeners() {
    const logoImage = document.querySelector('.site-logo');
    if (logoImage) {
      logoImage.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    this.setupScrollDetection();
  }

  setupScrollDetection() {
    const nav = document.getElementById('site-nav');
    const header = document.querySelector('.site-header');
    
    if (!nav || !header) return;
    
    const headerHeight = header.offsetHeight;
    
    const updateScrollStyle = (isScrolled) => {
      if (nav) {
        const navWasScrolled = nav.classList.contains('scrolled');
        nav.classList.toggle('scrolled', isScrolled);
        
        if (navWasScrolled !== isScrolled) {
            document.dispatchEvent(new CustomEvent('navScrolled', { detail: { isScrolled } }));
        }
      }
    };
    
    let initialScrollY = window.scrollY;
    let initialIsScrolled = initialScrollY > headerHeight;
    updateScrollStyle(initialIsScrolled);
    document.dispatchEvent(new CustomEvent('navScrolled', { detail: { isScrolled: initialIsScrolled } }));

    window.addEventListener('scroll', this.debounce(() => {
      updateScrollStyle(window.scrollY > headerHeight);
    }, 10), { passive: true });
    
    window.addEventListener('resize', this.debounce(() => {
      const newHeaderHeight = header.offsetHeight;
      updateScrollStyle(window.scrollY > newHeaderHeight);
    }, 100));
    
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
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
}

new Navigation();

export default Navigation; 