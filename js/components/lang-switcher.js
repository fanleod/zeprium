class LangSwitcher {
  constructor(containerSelector = '.lang-switcher-container') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      // Don't throw an error, just exit gracefully if the container isn't needed on the page
      // console.error('Language switcher container not found:', containerSelector);
      return;
    }
    this.langToggleBtn = null;
    this.init();
  }

  init() {
    this.createSwitcherHTML();
    this.langToggleBtn = document.getElementById('lang-toggle');
    if (this.langToggleBtn) {
      this.initLanguageState();
      this.setupEventListeners();
      // Check initial scroll state when nav might already be scrolled
      this.updateScrollState();
    } else {
      console.error("Language toggle button not found after creation.");
    }
  }

  createSwitcherHTML() {
    // Get initial language to display correct text
    const initialLang = localStorage.getItem('zeprium-lang') || 'en';
    const initialText = initialLang === 'en' ? 'EN' : '中';
    const switcherHTML = `
      <div class="lang-switcher">
        <button id="lang-toggle" aria-label="Switch language" title="切换语言">
          <span class="lang-text">${initialText}</span>
        </button>
      </div>
    `;
    // Ensure container is clean before adding new HTML
    this.container.innerHTML = switcherHTML;
  }

  initLanguageState() {
    const savedLang = localStorage.getItem('zeprium-lang') || 'en';
    // Update button UI immediately
    this.updateLanguageUI(savedLang);
    // Apply language to the page content and title
    this.updatePageContent(savedLang);
    this.updatePageTitle(savedLang);
    // Set html lang attribute
    document.documentElement.lang = savedLang;
  }

  setupEventListeners() {
    this.langToggleBtn.addEventListener('click', () => {
      const currentLang = document.documentElement.lang || 'en';
      const newLang = currentLang === 'en' ? 'zh' : 'en';
      
      localStorage.setItem('zeprium-lang', newLang);
      
      // Update UI and page content immediately
      this.updateLanguageUI(newLang);
      this.updatePageContent(newLang);
      this.updatePageTitle(newLang);

      // Dispatch a custom event for other components if needed (optional)
      document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: newLang }
      }));
    });

    // Listen for scroll events dispatched by the navigation component
    document.addEventListener('navScrolled', (e) => {
        this.updateScrollState(e.detail.isScrolled);
    });

    // Optional: Listen for external requests to update language (e.g., from browser settings or another component)
    // document.addEventListener('setLanguage', (e) => {
    //    const newLang = e.detail.language;
    //    if (newLang && (newLang === 'en' || newLang === 'zh')) {
    //        localStorage.setItem('zeprium-lang', newLang);
    //        this.updateLanguageUI(newLang);
    //        this.updatePageContent(newLang);
    //        this.updatePageTitle(newLang);
    //        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: newLang } }));
    //    }
    // });
  }

  updateLanguageUI(lang) {
    if (!this.langToggleBtn) return;
    const langTextSpan = this.langToggleBtn.querySelector('.lang-text');

    if (langTextSpan) {
      langTextSpan.textContent = lang === 'en' ? 'EN' : '中';
    }

    // Toggle class for specific language styling (e.g., font)
    this.langToggleBtn.classList.toggle('lang-zh', lang === 'zh');
    
    // Update the html lang attribute for accessibility and CSS selectors
    document.documentElement.lang = lang;
  }

  updateScrollState(isScrolled = null) {
    const switcherDiv = this.container.querySelector('.lang-switcher');
    if (!switcherDiv) return;

    // If isScrolled state isn't passed, determine it from the navigation element
    if (isScrolled === null) {
      const nav = document.getElementById('site-nav');
      isScrolled = nav ? nav.classList.contains('scrolled') : false;
    }
    // Apply or remove the 'scrolled' class based on the state
    switcherDiv.classList.toggle('scrolled', isScrolled);
  }

  // --- Global Page Update Functions ---
  // These methods are responsible for updating the rest of the page
  // when the language changes.

  updatePageTitle(lang) {
    const titleMeta = document.querySelector(`meta[name="title-${lang}"]`);
    if (titleMeta) {
      document.title = titleMeta.getAttribute('content');
    } else {
      // Fallback or default title logic if needed
      const defaultTitleMeta = document.querySelector('meta[name="title-en"]');
      document.title = defaultTitleMeta ? defaultTitleMeta.getAttribute('content') : 'Zeprium';
    }
  }

  updatePageContent(lang) {
    // Update elements with data-lang attributes
    const elements = document.querySelectorAll('[data-lang-en], [data-lang-zh]');
    elements.forEach(element => {
      const content = element.getAttribute(`data-lang-${lang}`);
      // Only update if the target language content exists
      if (content !== null) {
        // Basic check for HTML content
        if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
           if (element.innerHTML !== content) { element.innerHTML = content; }
        } else {
           if (element.textContent !== content) { element.textContent = content; }
        }
      } else {
          // Optional: Handle cases where content for the selected language is missing
          // For example, fallback to English or hide the element
          const fallbackContent = element.getAttribute('data-lang-en'); // Default to English
          if (fallbackContent !== null) {
              if (fallbackContent.trim().startsWith('<') && fallbackContent.trim().endsWith('>')) {
                  if (element.innerHTML !== fallbackContent) element.innerHTML = fallbackContent;
              } else {
                  if (element.textContent !== fallbackContent) element.textContent = fallbackContent;
              }
          } else {
              // Hide element if no content is available for either language?
              // element.style.display = 'none'; 
          }
      }
    });

    // Specifically handle project content visibility on project detail pages
    this.updateProjectContentVisibility(lang);
  }

  updateProjectContentVisibility(lang) {
    // Select only project content blocks that have language attributes
    const projectContents = document.querySelectorAll('.project-content[data-lang-en], .project-content[data-lang-zh]');
    if (projectContents.length > 0) {
        // Check if we are on a project detail page (presence of .project-container)
        const isProjectDetail = document.querySelector('.project-container') !== null;
        if (isProjectDetail) {
            projectContents.forEach(el => {
                // Determine the language this block is for
                const elLang = el.matches('[data-lang-zh]') ? 'zh' : 'en';
                // Show the block if its language matches the selected language, hide otherwise
                el.style.display = (elLang === lang) ? 'block' : 'none';
            });
        }
        // On non-project pages, we assume these blocks should be handled by the general data-lang logic
        // or are always visible. No action needed here for non-project pages.
    }
  }

  // --- Optional Utility ---
  // Method to programmatically set text if needed by other modules,
  // ensuring data attributes are also updated.
  setElementText(element, textEn, textZh) {
    if (!element) return;
    element.setAttribute('data-lang-en', textEn);
    element.setAttribute('data-lang-zh', textZh);
    // Update immediately based on current language
    const currentLang = document.documentElement.lang || 'en';
    const content = currentLang === 'en' ? textEn : textZh;
    if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
        element.innerHTML = content;
    } else {
        element.textContent = content;
    }
  }
}

// Export the class for use in other modules
export default LangSwitcher; 