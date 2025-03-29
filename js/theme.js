// Function to update theme color based on current CSS variable value
function updateThemeColor() {
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
  
  // Update the content attribute with the current background color
  themeColorMeta.setAttribute('content', bgColor);
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', updateThemeColor);

// Also run when CSS variables might change (e.g., when switching to dark mode)
// This is a placeholder for future theme switching functionality
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeColor);

// Export the function for potential use by other scripts
window.updateThemeColor = updateThemeColor; 