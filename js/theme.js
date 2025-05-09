// Function to update theme color based on current CSS variable value
function updateThemeColor() {
  try {
    // 检查是否支持P3色域
    const supportsP3 = CSS.supports('color', 'color(display-p3 0 0 0)');
    
    // Get the current background color from CSS variable
    let bgColor;
    if (supportsP3) {
      bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-bg-p3').trim();
      // 如果没有获取到P3颜色，回退到标准色域
      if (!bgColor || bgColor.length === 0) {
        bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
      }
    } else {
      bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
    }
    
    // Find the theme-color meta tag
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    // If it doesn't exist, create it
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    
    // Only update if we have a valid color
    if (bgColor && bgColor.length > 0) {
      // Update the content attribute with the current background color
      themeColorMeta.setAttribute('content', bgColor);
    }
  } catch (error) {
    console.error('Error updating theme color:', error);
  }
}

// 检查是否支持P3色域
function checkP3Support() {
  let supportsP3 = false;
  try {
    // 尝试使用display-p3色彩空间
    supportsP3 = CSS.supports('color', 'color(display-p3 0 0 0)');
    // 检查是否支持 color-gamut: p3
    supportsP3 = supportsP3 || window.matchMedia('(color-gamut: p3)').matches;
    return supportsP3;
  } catch (e) {
    return false;
  }
}

// 检查是否支持HDR
function checkHDRSupport() {
  // 检查是否支持 color-gamut: p3
  const supportsP3 = window.matchMedia('(color-gamut: p3)').matches;
  // 检查是否支持 dynamic-range: high
  const supportsDynamicRange = window.matchMedia('(dynamic-range: high)').matches;
  // 使用CSS变量检查
  let supportsDisplayP3 = false;
  try {
    // 尝试使用display-p3色彩空间
    supportsDisplayP3 = CSS.supports('color', 'color(display-p3 0 0 0)');
  } catch (e) {
    // 如果出错，则不支持
    supportsDisplayP3 = false;
  }
  
  return supportsP3 || supportsDynamicRange || supportsDisplayP3;
}

// 应用主题的函数
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  // 添加或移除body上的暗色模式类
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  // 更新主题颜色
  updateThemeColor();
}

// 初始化函数
function initTheme() {
  // 更新主题颜色
  updateThemeColor();
  
  // 检查是否支持P3色域
  if (checkP3Support()) {
    document.body.classList.add('p3-supported');
    console.log('P3 color gamut supported');
  }
  
  // 如果支持HDR，添加特定类
  if (checkHDRSupport()) {
    document.body.classList.add('hdr-supported');
    console.log('HDR display detected and supported');
  }
  
  // 检查用户首选主题
  const savedTheme = localStorage.getItem('theme');
  
  // 如果用户有保存的主题设置，应用它
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // 否则根据系统设置自动选择
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }
}

// 当页面加载完成时初始化主题
document.addEventListener('DOMContentLoaded', initTheme);

// 监听系统主题变化
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
if (darkModeMediaQuery && typeof darkModeMediaQuery.addEventListener === 'function') {
  darkModeMediaQuery.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        applyTheme('dark');
      } else {
        applyTheme('light');
      }
    }
    updateThemeColor();
  });
} else if (darkModeMediaQuery && typeof darkModeMediaQuery.addListener === 'function') {
  // Fallback for older browsers
  darkModeMediaQuery.addListener(e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        applyTheme('dark');
      } else {
        applyTheme('light');
      }
    }
    updateThemeColor();
  });
}

// Safely export the functions for potential use by other scripts
if (window) {
  window.updateThemeColor = updateThemeColor;
  window.checkP3Support = checkP3Support;
  window.checkHDRSupport = checkHDRSupport;
  window.applyTheme = applyTheme;
} 