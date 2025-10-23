const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Enhanced HTML template with better dynamic meta tag handling
  const customHtmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1.00001,viewport-fit=cover"/>
  
  <!-- Google Fonts: Arabic families -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&family=Noto+Naskh+Arabic:wght@400..700&display=swap" rel="stylesheet">
  
  <!-- Mobile-only restrictions -->
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-touch-fullscreen" content="yes"/>
  <meta name="apple-mobile-web-app-title" content="Mivy"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
  
  <!-- Prevent desktop access -->
  <script>
    (function() {
      function isMobile() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile', 'tablet'];
        const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
        const isSmallScreen = window.innerWidth <= 768;
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Check if URL contains games-related paths
        const isGamesUrl = window.location.pathname.includes('games') || 
                          window.location.hash.includes('games') ||
                          window.location.hash.includes('WebGame');
                          
        // Allow desktop access for games
        if (isGamesUrl) {
          return true;
        }
        
        return isMobile || isSmallScreen || hasTouch;
      }
      
      if (!isMobile()) {
        document.body.innerHTML = \`
          <div style="
            background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2a2f4a 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
            text-align: center;
            padding: 20px;
          ">
            <div style="max-width: 400px;">
              <h1 style="font-size: 32px; margin-bottom: 16px; font-weight: bold;">Mobile Only</h1>
              <p style="font-size: 18px; margin-bottom: 24px; color: #e0e0e0; line-height: 24px;">
                This app is designed exclusively for mobile devices
              </p>
              <p style="font-size: 16px; margin-bottom: 32px; color: #b0b0b0; line-height: 22px;">
                Please access this application on your smartphone or tablet for the best experience.
              </p>
              <div style="font-size: 64px; margin: 20px 0;">📱</div>
              <p style="font-size: 14px; color: #808080; line-height: 20px; font-style: italic;">
                If you're on a mobile device, try refreshing the page or using a mobile browser.
              </p>
            </div>
          </div>
        \`;
      }
    })();
  </script>
  
  <!-- Redirect root to /home to avoid stale shell issues -->
  <script>
    (function () {
      try {
        var path = window.location.pathname || '/';
        var hash = window.location.hash || '';
        // Only redirect when exactly on root and not going to games
        if ((path === '/' || path === '') && !hash && !/games/i.test(path)) {
           
          window.location.replace('/home');
        }
      } catch (e) {
         
      }
    })();
  </script>
  
  <!-- Meta tags handled entirely by React Head component -->
  
  <style>
    #root,body,html{width:100%;-webkit-overflow-scrolling:touch;margin:0;padding:0;min-height:100%}
    #root{flex-shrink:0;flex-basis:auto;flex-grow:1;display:flex;flex:1}
    html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;height:calc(100% + env(safe-area-inset-top))}
    body{display:flex;overflow-y:auto;overscroll-behavior-y:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-ms-overflow-style:scrollbar}
    /* Global Arabic font stack applied when page lang is ar (without overriding icon fonts) */
    :root{--arabic-font-stack:'IBM Plex Sans Arabic','Noto Naskh Arabic','Noto Sans Arabic',system-ui,-apple-system,'Segui UI',Roboto,'Helvetica Neue',Arial,'Apple Color Emoji','Segui UI Emoji','Segui UI Symbol'}
    html[lang="ar"] body { font-family: var(--arabic-font-stack); }
    html[lang="ar"] body * { font-family: inherit; }
  </style>
  <link rel="manifest" href="/manifest.json"/>
  <link rel="icon" href="/icons.png"/>
  <link rel="shortcut icon" href="/icons.png"/>
  <link rel="apple-touch-icon" sizes="180x180" href="/pwa/apple-touch-icon/apple-touch-icon-180.png"/>
  
  <!-- Meta tags are now handled by React Head component -->
</head>
<body>
  <noscript>
    <form action="" style="background-color:#fff;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999">
      <div style="font-size:18px;font-family:Helvetica,sans-serif;line-height:24px;margin:10%;width:80%">
        <p>Oh no! It looks like JavaScript is not enabled in your browser.</p>
        <p style="margin:20px 0">
          <button type="submit" style="background-color:#4630eb;border-radius:100px;border:none;box-shadow:none;color:#fff;cursor:pointer;font-weight:700;line-height:20px;padding:6px 16px">Reload</button>
        </p>
      </div>
    </form>
  </noscript>
  <div id="root"></div>
</body>
</html>`;

  // Replace the default HTML plugin with our custom one
  config.plugins = config.plugins.map(plugin => {
    if (plugin instanceof HtmlWebpackPlugin) {
      return new HtmlWebpackPlugin({
        ...plugin.options,
        templateContent: customHtmlTemplate,
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      });
    }
    return plugin;
  });

  return config;
}; 