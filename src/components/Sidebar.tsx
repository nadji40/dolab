import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, layout } from '../theme';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface SidebarItem {
  key: string;
  icon: string;
  activeIcon: string;
  labelKey: string;
}

const sidebarItems: SidebarItem[] = [
  {
    key: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    labelKey: 'home.title',
  },
  {
    key: 'Dashboard',
    icon: 'bar-chart-outline',
    activeIcon: 'bar-chart',
    labelKey: 'dashboard.title',
  },
  {
    key: 'Jobs',
    icon: 'briefcase-outline',
    activeIcon: 'briefcase',
    labelKey: 'jobs.title',
  },
  {
    key: 'CheckIn',
    icon: 'qr-code-outline',
    activeIcon: 'qr-code',
    labelKey: 'checkin.title',
  },
  {
    key: 'Settings',
    icon: 'settings-outline',
    activeIcon: 'settings',
    labelKey: 'settings.title',
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  const sidebarWidth = collapsed ? layout.sidebar.collapsedWidth : layout.sidebar.width;

  const SidebarItem = ({ item }: { item: SidebarItem }) => {
    const isActive = activeRoute === item.key;
    const iconName = isActive ? item.activeIcon : item.icon;

    return (
      <TouchableOpacity
        style={[
          styles.sidebarItem,
          {
            backgroundColor: isActive ? colors.accent : 'transparent',
            marginHorizontal: collapsed ? spacing.xs : spacing.sm,
            paddingHorizontal: collapsed ? spacing.sm : spacing.md,
            justifyContent: collapsed ? 'center' : 'flex-start',
          },
        ]}
        onPress={() => onNavigate(item.key)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={iconName as any}
          size={20}
          color={isActive ? '#fff' : colors.textPrimary}
          style={[
            styles.sidebarIcon,
            {
              marginRight: collapsed ? 0 : spacing.md,
            },
          ]}
        />
        {!collapsed && (
          <Text
            style={[
              styles.sidebarLabel,
              {
                color: isActive ? '#fff' : colors.textPrimary,
                textAlign: isRTL ? 'right' : 'left',
              },
            ]}
          >
            {t(item.labelKey)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: sidebarWidth,
          backgroundColor: Platform.OS === 'web' ? glassStyle.backgroundColor : colors.surface,
          borderRightColor: colors.border,
          ...(Platform.OS === 'web' && {
            backdropFilter: glassStyle.backdropFilter,
            borderRightWidth: glassStyle.borderWidth,
            borderRightColor: glassStyle.borderColor,
          }),
        },
      ]}
    >
      {/* Header */}
      <View style={styles.sidebarHeader}>
        {!collapsed && (
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: colors.accent }]}>
              {t('system.name')}
            </Text>
          </View>
        )}
        
        {onToggleCollapse && (
          <TouchableOpacity
            style={[
              styles.collapseButton,
              {
                backgroundColor: colors.surfaceElev,
                alignSelf: collapsed ? 'center' : 'flex-end',
              },
            ]}
            onPress={onToggleCollapse}
            activeOpacity={0.7}
          >
            <Ionicons
              name={collapsed ? 'chevron-forward-outline' : 'chevron-back-outline'}
              size={16}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Navigation Items */}
      <View style={styles.sidebarContent}>
        {sidebarItems.map((item) => (
          <SidebarItem key={item.key} item={item} />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.sidebarFooter}>
        {!collapsed && (
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            {t('system.copyright')}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    height: '100%',
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80,
    justifyContent: 'space-between',
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  collapseButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarContent: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
    borderRadius: borderRadius.md,
  },
  sidebarIcon: {
    width: 20,
    textAlign: 'center',
  },
  sidebarLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    flex: 1,
  },
  sidebarFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
});

export default Sidebar;

