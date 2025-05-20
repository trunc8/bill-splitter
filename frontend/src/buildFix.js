// Fix for potential issue with React 18 and Create React App
if (process.env.NODE_ENV === 'development') {
  const { createRoot } = require('react-dom/client');
  const originalRender = createRoot.prototype.render;
  
  createRoot.prototype.render = function() {
    // This try-catch prevents potential errors during hydration
    try {
      return originalRender.apply(this, arguments);
    } catch (error) {
      console.error('React rendering error:', error);
      // Continue rendering without failing
      return originalRender.apply(this, arguments);
    }
  };
}
