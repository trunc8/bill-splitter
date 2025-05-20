// netlify.config.js
module.exports = {
  // Custom build settings for Netlify
  build: {
    // Optional: Configure TypeScript support 
    typescript: {
      // Don't fail the build on TypeScript errors
      ignoreBuildErrors: true
    },
    // Optional: Configure ESLint
    eslint: {
      // Don't fail the build on ESLint errors
      ignoreBuildErrors: true
    }
  }
};
