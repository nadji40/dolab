import React, { useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../contexts/AppContext';
import { darkColors, lightColors, responsive } from '../theme';
import Sidebar from './Sidebar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
  showSidebar?: boolean;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  activeRoute,
  onNavigate,
  showSidebar = true,
}) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const onChange = (result: { window: any }) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const isDesktop = responsive.isDesktop(screenData.width);
  const shouldShowSidebar = showSidebar && isDesktop;

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!shouldShowSidebar) {
    // Mobile/tablet layout - just return children
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {children}
      </View>
    );
  }

  // Desktop layout with sidebar
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.desktopLayout}>
        <Sidebar
          activeRoute={activeRoute}
          onNavigate={onNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
        <View style={styles.mainContent}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
  },
});

export default ResponsiveLayout;
