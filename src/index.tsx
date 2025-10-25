import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

// Register the app for web
if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('app');
  AppRegistry.registerComponent('DoLabEventManager', () => App);
  AppRegistry.runApplication('DoLabEventManager', { rootTag });
} else {
  // For mobile platforms
  AppRegistry.registerComponent('DoLabEventManager', () => App);
}

export default App;



