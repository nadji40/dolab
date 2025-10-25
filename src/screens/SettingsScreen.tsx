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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme, useLanguage, useApp } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, shadow } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsNavigationProp = StackNavigationProp<RootStackParamList>;

// Custom Toggle Component for better web compatibility
const CustomToggle = ({ 
  value, 
  onValueChange, 
  trackColor, 
  thumbColor 
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor: { false: string; true: string };
  thumbColor: string;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.toggleContainer,
        {
          backgroundColor: value ? trackColor.true : trackColor.false,
        }
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.toggleThumb,
          {
            backgroundColor: thumbColor,
            transform: [{ translateX: value ? 20 : 2 }],
          }
        ]}
      />
    </TouchableOpacity>
  );
};

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavigationProp>();
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
       <Text style={[styles.sectionTitle, { 
         color: colors.textPrimary,
         marginLeft: isRTL ? 0 : spacing.lg,
         marginRight: isRTL ? spacing.lg : 0,
         textAlign: isRTL ? 'right' : 'left'
       }]}>
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
    icon: React.ReactNode;
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
         <View style={styles.settingIcon}>{icon}</View>
         <View style={styles.settingText}>
           <Text style={[styles.settingTitle, { 
             color: colors.textPrimary,
             textAlign: isRTL ? 'right' : 'left'
           }]}>
             {title}
           </Text>
           {subtitle && (
             <Text style={[styles.settingSubtitle, { 
               color: colors.textMuted,
               textAlign: isRTL ? 'right' : 'left'
             }]}>
               {subtitle}
             </Text>
           )}
         </View>
       </View>
      
      <View style={styles.settingRight}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {rightElement}
          {showArrow && (
            <Ionicons
              name={isRTL ? 'chevron-back-outline' : 'chevron-forward-outline'}
              size={18}
              color={colors.textMuted}
              style={{ marginLeft: spacing.sm }}
            />
          )}
        </View>
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
            <Ionicons name="person" size={32} color="#fff" />
          </View>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              John Doe
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
              john.doe@eventdolab.com
            </Text>
          </View>
        </View>

        {/* Appearance */}
        <SettingSection title={t('settings.appearance')}>
          <SettingItem
            icon={<Ionicons name={isDark ? 'moon' : 'moon-outline'} size={20} color={colors.textPrimary} />}
            title={t('settings.theme')}
            subtitle={isDark ? t('settings.dark_mode') : t('settings.light_mode')}
            rightElement={
              <CustomToggle
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={isDark ? '#fff' : colors.textMuted}
              />
            }
          />
          
           <SettingItem
             icon={<Ionicons name="globe-outline" size={20} color={colors.textPrimary} />}
             title={t('settings.language')}
             subtitle={language === 'ar' ? 'العربية' : 'English'}
             onPress={() => {
               if (Platform.OS === 'web') {
                 // Web-specific language selection
                 const userChoice = window.confirm(
                   `${t('settings.select_language')}\n\nClick OK for العربية, Cancel for English`
                 );
                 handleLanguageChange(userChoice ? 'ar' : 'en');
               } else {
                 // Mobile Alert
                 Alert.alert(
                   t('settings.select_language'),
                   '',
                   [
                     { text: t('common.cancel'), style: 'cancel' },
                     { text: 'العربية', onPress: () => handleLanguageChange('ar') },
                     { text: 'English', onPress: () => handleLanguageChange('en') },
                   ],
                   { cancelable: true }
                 );
               }
             }}
             showArrow
             isLast
           />
        </SettingSection>

        {/* Notifications */}
        <SettingSection title={t('settings.notifications')}>
          <SettingItem
            icon={<Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.push_notifications')}
            subtitle={t('settings.receive_push')}
            rightElement={
              <CustomToggle
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={notifications ? '#fff' : colors.textMuted}
              />
            }
          />
          
          <SettingItem
            icon={<Ionicons name="mail-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.email_notifications')}
            subtitle={t('settings.receive_email')}
            rightElement={
              <CustomToggle
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
        <SettingSection title={t('settings.data_sync')}>
          <SettingItem
            icon={<Ionicons name="refresh-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.sync')}
            subtitle={state.lastSync ? `${t('settings.last_prefix')}: ${new Date(state.lastSync).toLocaleString()}` : t('settings.never_synced')}
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
            icon={<Ionicons name="flash-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.auto_sync')}
            subtitle={t('settings.auto_sync_desc')}
            rightElement={
              <CustomToggle
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={autoSync ? '#fff' : colors.textMuted}
              />
            }
          />
          
          <SettingItem
            icon={<Ionicons name="trash-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.clear_cache')}
            subtitle={t('settings.clear_cache_desc')}
            onPress={handleClearCache}
            showArrow
            isLast
          />
        </SettingSection>

        {/* Account */}
        <SettingSection title={t('settings.account')}>
          <SettingItem
            icon={<Ionicons name="person-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.profile')}
            subtitle={t('settings.profile_desc')}
            onPress={() => {}}
            showArrow
          />
          
          <SettingItem
            icon={<Ionicons name="lock-closed-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.privacy')}
            subtitle={t('settings.privacy_desc')}
            onPress={() => {}}
            showArrow
          />
          
          <SettingItem
            icon={<Ionicons name="shield-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.security')}
            subtitle={t('settings.security_desc')}
            onPress={() => {}}
            showArrow
            isLast
          />
        </SettingSection>

        {/* About */}
        <SettingSection title={t('settings.about')}>
          <SettingItem
            icon={<Ionicons name="information-circle-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.version')}
            subtitle="1.0.0"
            rightElement={
              <Text style={[styles.versionText, { color: colors.textMuted }]}>
                {t('settings.latest')}
              </Text>
            }
          />
          
          <SettingItem
            icon={<Ionicons name="document-text-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.terms')}
            onPress={() => openURL('https://eventdolab.com/terms')}
            showArrow
          />
          
          <SettingItem
            icon={<Ionicons name="lock-closed-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.privacy_policy')}
            onPress={() => openURL('https://eventdolab.com/privacy')}
            showArrow
          />
          
          <SettingItem
            icon={<Ionicons name="briefcase-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.careers')}
            subtitle={t('settings.join_team')}
            onPress={() => openURL('https://eventdolab.com/careers')}
            showArrow
          />
          
          <SettingItem
            icon={<Ionicons name="globe-outline" size={20} color={colors.textPrimary} />}
            title={t('settings.website')}
            onPress={() => openURL('https://eventdolab.com')}
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
            {t('system.made_in')}
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
     fontWeight: '600',
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
     fontWeight: '600',
     marginBottom: spacing.sm,
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
     paddingVertical: spacing.md,
     paddingHorizontal: spacing.lg,
   },
   settingLeft: {
     flexDirection: 'row',
     alignItems: 'center',
     flex: 1,
   },
   settingIcon: {
     width: 24,
     alignItems: 'center',
     justifyContent: 'center',
     marginRight: spacing.md,
   },
  settingText: {
    flex: 1,
  },
   settingTitle: {
     fontSize: typography.sizes.md,
     fontWeight: '500',
     marginBottom: spacing.xs,
   },
  settingSubtitle: {
    fontSize: typography.sizes.sm,
  },
   settingRight: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'flex-end',
   },
   syncingText: {
     fontSize: typography.sizes.sm,
     fontWeight: '500',
   },
   versionText: {
     fontSize: typography.sizes.sm,
     fontWeight: '500',
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
     fontWeight: '600',
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
  // Custom Toggle Styles
  toggleContainer: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default SettingsScreen;

