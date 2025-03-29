// Function to update theme color based on current CSS variable value
function updateThemeColor() {
  try {
    // Get the current background color from CSS variable
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
    
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

// Use a safe way to add event listeners
function addSafeEventListener(element, event, callback) {
  if (element && typeof element.addEventListener === 'function') {
    element.addEventListener(event, callback);
    return true;
  }
  return false;
}

// Run when the page loads
addSafeEventListener(document, 'DOMContentLoaded', updateThemeColor);

// Also run when CSS variables might change (e.g., when switching to dark mode)
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
if (darkModeMediaQuery && typeof darkModeMediaQuery.addEventListener === 'function') {
  darkModeMediaQuery.addEventListener('change', updateThemeColor);
} else if (darkModeMediaQuery && typeof darkModeMediaQuery.addListener === 'function') {
  // Fallback for older browsers
  darkModeMediaQuery.addListener(updateThemeColor);
}

// Safely export the function for potential use by other scripts
if (window) {
  window.updateThemeColor = updateThemeColor;
} 