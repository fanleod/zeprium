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
    // Apply language to the page title
    this.updatePageTitle(savedLang);
    // Set html lang attribute
    document.documentElement.lang = savedLang;
    // *** Call updatePageContent AFTER initial paint/layout ***
    requestAnimationFrame(() => {
        console.log('[LangSwitcher] initLanguageState: Requesting updatePageContent via requestAnimationFrame.');
        this.updatePageContent(savedLang);
    });
  }

  setupEventListeners() {
    this.langToggleBtn.addEventListener('click', () => {
      const currentLang = document.documentElement.lang || 'en';
      const newLang = currentLang === 'en' ? 'zh' : 'en';
      
      localStorage.setItem('zeprium-lang', newLang);
      
      // Update UI and page title immediately
      this.updateLanguageUI(newLang);
      this.updatePageTitle(newLang);
      
      // *** ADDED: Call updatePageContent on language switch ***
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

  updatePageContent(lang) {
    console.log(`[LangSwitcher] updatePageContent started for lang: ${lang}.`); // Log: Start
    // Select all elements with data-lang-* attributes
    document.querySelectorAll('[data-lang-en], [data-lang-zh]').forEach(el => {
      // Construct a more descriptive identifier
      let elIdentifier = el.tagName;
      if (el.id) elIdentifier += `#${el.id}`;
      if (el.classList.length > 0) elIdentifier += `.${Array.from(el.classList).join('.')}`;
      // Get first few characters of text content for context
      const textSample = (el.textContent || "").trim().substring(0, 30).replace(/\n/g, ' '); 
      
      console.log(`[LangSwitcher] ---> Processing element: ${elIdentifier} (Sample: "${textSample}...")`); // Log: Processing Element

      // Determine if this element should be active based on its data-lang-* attributes
      const hasEn = el.hasAttribute('data-lang-en');
      const hasZh = el.hasAttribute('data-lang-zh');
      const shouldBeActive = (lang === 'en' && hasEn) || (lang === 'zh' && hasZh);
      
      // --- Step 1: Always toggle visibility class --- 
      el.classList.toggle('lang-active', shouldBeActive);
      el.classList.toggle('lang-inactive', !shouldBeActive); // Explicitly add inactive for clarity
      console.log(`[LangSwitcher] --> Visibility set: ${shouldBeActive ? 'ACTIVE' : 'INACTIVE'} for ${elIdentifier}`);

      // --- Step 2: ONLY update text content if element has BOTH attributes --- 
      if (hasEn && hasZh && shouldBeActive) { 
          let newContent = null;
          if (lang === 'zh' && textZh !== null) {
              newContent = textZh;
          } else if (lang === 'en' && textEn !== null) {
              newContent = textEn;
          } else if (textEn !== null) { // Fallback
              newContent = textEn;
          } else if (textZh !== null) { // Fallback
              newContent = textZh;
          }
          
          if (newContent !== null) {
              try {
                  const oldContent = el.textContent; 
                  // Only update if different, to avoid unnecessary changes
                  if (el.textContent !== newContent) { 
                      console.log(`[LangSwitcher] ---> Updating INLINE TEXT for ${elIdentifier}. Old: "${oldContent.substring(0,30)}..." New: "${newContent.substring(0,30)}..."`); 
                      el.textContent = newContent;
                      console.log(`[LangSwitcher] ----> INLINE TEXT AFTER update attempt for ${elIdentifier}: "${(el.textContent || "").substring(0,30)}..."`); 
                  } else {
                       console.log(`[LangSwitcher] ---> Inline text already correct for ${elIdentifier}`);
                  }
              } catch (e) {
                  console.error(`[LangSwitcher] ERROR assigning textContent for INLINE TEXT element ${elIdentifier}:`, e);
              }
          }
      } else if (shouldBeActive) {
           console.log(`[LangSwitcher] ---> Element ${elIdentifier} is active but only has one lang attribute. Skipping inline text update.`);
      }
      // --- END Text Content Update Logic --- 
      
      // REMOVED previous combined/forced text update logic
      
    });
     console.log(`[LangSwitcher] updatePageContent finished for lang: ${lang}.`); // Log: End
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