import React, { useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();
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

  const handleSidebarNavigation = (route: string) => {
    // Use the navigation hook directly
    navigation.navigate(route as never);
    // Also call the original onNavigate for state updates
    onNavigate(route);
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
          onNavigate={handleSidebarNavigation}
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
