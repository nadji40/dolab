import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from './contexts/AppContext';
import AppNavigator from './navigation/AppNavigator';
import './locales/i18n'; // Initialize i18n

// Web-specific imports
if (Platform.OS === 'web') {
  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

const App: React.FC = () => {
  useEffect(() => {
    // Set up web-specific configurations
    if (Platform.OS === 'web') {
      // Set viewport meta tag for mobile-first design
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }

      // Set app title
      document.title = 'Dolab Event Manager';

      // Add PWA meta tags
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) {
        themeColor.setAttribute('content', '#d29d59');
      }

      // Add manifest link
      const manifest = document.querySelector('link[rel="manifest"]');
      if (!manifest) {
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = '/manifest.json';
        document.head.appendChild(link);
      }

      // Add apple-touch-icon
      const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
      if (!appleIcon) {
        const link = document.createElement('link');
        link.rel = 'apple-touch-icon';
        link.href = '/icon-192.png';
        document.head.appendChild(link);
      }

      // Prevent zoom on input focus (mobile)
      const addMaximumScaleToMetaViewport = () => {
        const el = document.querySelector('meta[name=viewport]');
        if (el !== null) {
          let content = el.getAttribute('content');
          let re = /maximum\-scale=[0-9\.]+/g;
          if (re.test(content)) {
            content = content.replace(re, 'maximum-scale=1.0');
          } else {
            content = [content, 'maximum-scale=1.0'].join(', ');
          }
          el.setAttribute('content', content);
        }
      };

      const disableIosTextFieldZoom = addMaximumScaleToMetaViewport;

      // Disable zoom on input focus
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="number"], textarea');
      inputs.forEach((input) => {
        input.addEventListener('focus', disableIosTextFieldZoom, false);
        input.addEventListener('blur', () => {
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes');
          }
        }, false);
      });
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProviders>
          <StatusBar 
            barStyle="light-content" 
            backgroundColor="#0a0a0a"
            translucent={Platform.OS === 'android'}
          />
          <AppNavigator />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

