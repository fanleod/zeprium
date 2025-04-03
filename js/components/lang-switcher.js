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
    document.documentElement.lang = savedLang; // Set lang attribute early
    this.updateLanguageUI(savedLang); // Update button
    this.updatePageTitle(savedLang); // Update title
    this.updatePageContent(savedLang); // Update page content
  }

  setupEventListeners() {
    this.langToggleBtn.addEventListener('click', () => {
      const currentLang = document.documentElement.lang || 'en';
      const newLang = currentLang === 'en' ? 'zh' : 'en';
      
      localStorage.setItem('zeprium-lang', newLang);
      document.documentElement.lang = newLang; // Update lang attribute immediately

      // Update UI, title, and page content
      this.updateLanguageUI(newLang);
      this.updatePageTitle(newLang);
      this.updatePageContent(newLang);

      // Dispatch a custom event for other components if needed
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

  // --- NEW METHOD to update general page content ---
  updatePageContent(lang) {
    const elements = document.querySelectorAll('[data-lang-en], [data-lang-zh]');
    elements.forEach(el => {
      const text = el.getAttribute(`data-lang-${lang}`);
      // Check if text exists for the target language, fallback to 'en' if not
      const fallbackText = el.getAttribute('data-lang-en') || el.textContent; // Use existing content as last resort
      const contentToSet = text !== null ? text : fallbackText;

      // Basic check for HTML content vs plain text
      // More robust checking might be needed depending on content complexity
      if (contentToSet.trim().startsWith('<') && contentToSet.trim().endsWith('>')) {
         // Avoid replacing interactive elements or complex structures unintentionally.
         // Only set innerHTML if it seems relatively safe (e.g., simple tags like span, strong)
         // For complex content, consider more targeted updates or specific data attributes.
         // Currently, let's stick to textContent for safety unless explicitly marked.
         // A better approach might be a data-lang-type="html" attribute.
         // For now, we'll primarily use textContent.
          if (el.hasAttribute('data-lang-allow-html')) {
              el.innerHTML = contentToSet;
          } else {
              el.textContent = contentToSet;
          }
      } else {
          el.textContent = contentToSet;
      }
    });
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