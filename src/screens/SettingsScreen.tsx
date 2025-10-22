import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage, useApp } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, shadow } from '../theme';

const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();
  const { syncData, state } = useApp();
  
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncData();
      Alert.alert(
        t('common.success'),
        'Data synced successfully',
        [{ text: t('common.confirm') }]
      );
    } catch (error) {
      Alert.alert(
        t('common.error'),
        'Failed to sync data',
        [{ text: t('common.confirm') }]
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      t('settings.clear_cache'),
      'Are you sure you want to clear the cache?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.confirm'), 
          style: 'destructive',
          onPress: () => {
            // Clear cache logic here
            Alert.alert(t('common.success'), 'Cache cleared successfully');
          }
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      'Are you sure you want to logout?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('settings.logout'), 
          style: 'destructive',
          onPress: () => {
            // Logout logic here
          }
        },
      ]
    );
  };

  const openURL = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionContent,
          {
            backgroundColor: Platform.OS === 'web' ? glassStyle.backgroundColor : colors.surfaceCard,
            borderColor: colors.border,
            ...(Platform.OS === 'web' && {
              backdropFilter: glassStyle.backdropFilter,
              borderWidth: glassStyle.borderWidth,
              borderColor: glassStyle.borderColor,
            }),
          },
          shadow.card,
        ]}
      >
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    showArrow = false,
    isLast = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showArrow?: boolean;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {rightElement}
        {showArrow && (
          <Text style={[styles.settingArrow, { color: colors.textMuted }]}>
            {isRTL ? '‹' : '›'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              John Doe
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
              john.doe@dolab.com
            </Text>
          </View>
        </View>

        {/* Appearance */}
        <SettingSection title={t('settings.appearance')}>
          <SettingItem
            icon="🌙"
            title={t('settings.theme')}
            subtitle={isDark ? t('settings.dark_mode') : t('settings.light_mode')}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={isDark ? '#fff' : colors.textMuted}
              />
            }
          />
          
          <SettingItem
            icon="🌐"
            title={t('settings.language')}
            subtitle={language === 'ar' ? 'العربية' : 'English'}
            onPress={() => {
              Alert.alert(
                t('settings.language'),
                'Select Language / اختر اللغة',
                [
                  { text: 'Cancel / إلغاء', style: 'cancel' },
                  { text: 'العربية', onPress: () => handleLanguageChange('ar') },
                  { text: 'English', onPress: () => handleLanguageChange('en') },
                ]
              );
            }}
            showArrow
            isLast
          />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title={t('settings.notifications')}>
          <SettingItem
            icon="🔔"
            title={t('settings.push_notifications')}
            subtitle="Receive push notifications"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={notifications ? '#fff' : colors.textMuted}
              />
            }
          />
          
          <SettingItem
            icon="📧"
            title={t('settings.email_notifications')}
            subtitle="Receive email updates"
            rightElement={
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={'#fff'}
              />
            }
            isLast
          />
        </SettingSection>

        {/* Data & Sync */}
        <SettingSection title="Data & Sync">
          <SettingItem
            icon="🔄"
            title={t('settings.sync')}
            subtitle={state.lastSync ? `Last: ${new Date(state.lastSync).toLocaleString()}` : 'Never synced'}
            onPress={handleSync}
            rightElement={
              isSyncing ? (
                <Text style={[styles.syncingText, { color: colors.accent }]}>
                  {t('common.loading')}
                </Text>
              ) : null
            }
            showArrow
          />
          
          <SettingItem
            icon="⚡"
            title={t('settings.auto_sync')}
            subtitle="Automatically sync data"
            rightElement={
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={autoSync ? '#fff' : colors.textMuted}
              />
            }
          />
          
          <SettingItem
            icon="🗑️"
            title={t('settings.clear_cache')}
            subtitle="Free up storage space"
            onPress={handleClearCache}
            showArrow
            isLast
          />
        </SettingSection>

        {/* Account */}
        <SettingSection title={t('settings.account')}>
          <SettingItem
            icon="👤"
            title={t('settings.profile')}
            subtitle="Edit your profile"
            onPress={() => {}}
            showArrow
          />
          
          <SettingItem
            icon="🔒"
            title={t('settings.privacy')}
            subtitle="Privacy settings"
            onPress={() => {}}
            showArrow
          />
          
          <SettingItem
            icon="🛡️"
            title={t('settings.security')}
            subtitle="Security settings"
            onPress={() => {}}
            showArrow
            isLast
          />
        </SettingSection>

        {/* About */}
        <SettingSection title={t('settings.about')}>
          <SettingItem
            icon="ℹ️"
            title={t('settings.version')}
            subtitle="1.0.0"
            rightElement={
              <Text style={[styles.versionText, { color: colors.textMuted }]}>
                Latest
              </Text>
            }
          />
          
          <SettingItem
            icon="📄"
            title="Terms of Service"
            onPress={() => openURL('https://dolab.com/terms')}
            showArrow
          />
          
          <SettingItem
            icon="🔒"
            title="Privacy Policy"
            onPress={() => openURL('https://dolab.com/privacy')}
            showArrow
          />
          
          <SettingItem
            icon="💼"
            title="Careers"
            subtitle="Join our team"
            onPress={() => openURL('https://dolab.com/careers')}
            showArrow
          />
          
          <SettingItem
            icon="🌐"
            title="Website"
            onPress={() => openURL('https://dolab.com')}
            showArrow
            isLast
          />
        </SettingSection>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.danger }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              {t('settings.logout')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            {t('system.copyright')}
          </Text>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Made with ❤️ in Saudi Arabia
          </Text>
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    width: '100%',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
  },
  profileName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.sizes.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
    marginLeft: spacing.lg,
  },
  sectionContent: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    width: 24,
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    fontSize: typography.sizes.sm,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingArrow: {
    fontSize: 18,
    marginLeft: spacing.sm,
  },
  syncingText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  versionText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  logoutSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  logoutButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});

export default SettingsScreen;
