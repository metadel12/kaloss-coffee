const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = phase => {
    const isDev = phase === PHASE_DEVELOPMENT_SERVER;
    
    return {
        reactStrictMode: true,
        distDir: isDev ? '.next-dev' : '.next-build',
        // CRITICAL: Add these two lines
        basePath: '',  // Change if app is in subfolder like '/myapp'
        assetPrefix: isDev ? '' : '/.next-build',  // Points to actual asset location
    };
};
