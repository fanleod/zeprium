/**
 * Language Switcher
 * 
 * This module handles the language switching functionality across the website.
 * It toggles between English and Chinese languages and saves the preferred language
 * to localStorage.
 */

document.addEventListener('DOMContentLoaded', function() {
  const langToggleBtn = document.getElementById('lang-toggle');
  
  if (langToggleBtn) {
    // Initialize the language switcher
    initLanguageSwitcher(langToggleBtn);
    
    // Set up event listener for language toggle
    langToggleBtn.addEventListener('click', function() {
      const currentLang = localStorage.getItem('zeprium-lang') || 'en';
      const newLang = currentLang === 'en' ? 'zh' : 'en';
      
      // Save the new language preference
      localStorage.setItem('zeprium-lang', newLang);
      
      // Update the UI
      updateLanguageUI(newLang);
      
      // Dispatch a custom event for other components to listen to
      document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: newLang }
      }));
    });
  }
});

/**
 * Initialize the language switcher based on the saved preference
 * @param {HTMLElement} button - The language toggle button
 */
function initLanguageSwitcher(button) {
  // Get saved language or default to English
  const savedLang = localStorage.getItem('zeprium-lang') || 'en';
  
  // Update the UI to match the saved language
  updateLanguageUI(savedLang);
}

/**
 * Update the UI elements based on the selected language
 * @param {string} lang - The language code ('en' or 'zh')
 */
function updateLanguageUI(lang) {
  const langToggleBtn = document.getElementById('lang-toggle');
  const langTextSpan = langToggleBtn.querySelector('.lang-text');
  
  // Update the button text
  if (langTextSpan) {
    langTextSpan.textContent = lang === 'en' ? 'EN' : '中';
  }
  
  // Update the button class
  if (lang === 'zh') {
    langToggleBtn.classList.add('lang-zh');
  } else {
    langToggleBtn.classList.remove('lang-zh');
  }
  
  // Update page title if applicable
  updatePageTitle(lang);
  
  // Update all elements with data-lang attributes
  updatePageContent(lang);
}

/**
 * Update the page title based on the selected language
 * @param {string} lang - The language code ('en' or 'zh')
 */
function updatePageTitle(lang) {
  const titleMeta = document.querySelector(`meta[name="title-${lang}"]`);
  if (titleMeta) {
    document.title = titleMeta.getAttribute('content');
  }
}

/**
 * Update all page content with language-specific text
 * @param {string} lang - The language code ('en' or 'zh')
 */
function updatePageContent(lang) {
  // Find all elements with data-lang attributes
  const elements = document.querySelectorAll(`[data-lang-${lang}]`);
  
  elements.forEach(element => {
    const content = element.getAttribute(`data-lang-${lang}`);
    if (content) {
      // If the element has inner HTML that needs to be preserved (like links),
      // we need to handle it carefully
      if (content.includes('<') && content.includes('>')) {
        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    }
  });
}

/**
 * 提供给外部使用的API，用于更改网页中的文本内容
 * @param {HTMLElement} element - 要修改的元素
 * @param {string} textEn - 英文文本
 * @param {string} textZh - 中文文本
 */
function setElementText(element, textEn, textZh) {
  if (!element) return;
  
  // 保存原始文本
  element.setAttribute('data-lang-en', textEn);
  element.setAttribute('data-lang-zh', textZh);
  
  // 应用当前语言
  element.innerHTML = currentLang === 'en' ? textEn : textZh;
}

// 导出API供其他模块使用
window.ZepriumLang = {
  getCurrentLang: () => currentLang,
  setElementText: setElementText
}; 