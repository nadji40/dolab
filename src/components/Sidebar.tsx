import { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme, useLanguage, useSidebar } from '../contexts/AppContext';
import {
  OverviewIcon,
  ChartIcon,
  ReportIcon,
  StarIcon,
  PerformanceIcon,
  TargetIcon,
  MessageIcon,
  SettingsIcon,
  HelpIcon,
  MenuIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
} from './Icons';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

function SidebarItem({ icon, label, active = false, onClick, collapsed = false }: SidebarItemProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: active 
          ? (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)')
          : 'transparent',
        borderColor: active ? colors.borderLight : 'transparent',
        borderWidth: 1,
        justifyContent: collapsed ? 'center' : 'flex-start',
        backdropFilter: active ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: active ? 'blur(10px)' : 'none',
      }}
    >
      {icon}
      {!collapsed && (
        <Text style={{
          color: active ? colors.textPrimary : colors.textSecondary,
          fontSize: 14,
          fontWeight: active ? '600' : '500',
          fontFamily: 'Playfair Display',
        }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

interface SidebarProps {
  children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const colors = isDark ? darkColors : lightColors;

  const iconColor = colors.textSecondary;
  const activeIconColor = colors.textPrimary;

  return (
    <View 
      style={{
        width: isCollapsed ? 80 : 280,
        backgroundColor: isDark 
          ? 'rgba(45, 64, 84, 0.15)' 
          : 'rgba(210, 157, 89, 0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRightColor: isRTL ? 'transparent' : colors.border,
        borderLeftColor: isRTL ? colors.border : 'transparent',
        borderRightWidth: isRTL ? 0 : 1,
        borderLeftWidth: isRTL ? 1 : 0,
        padding: isCollapsed ? 12 : 20,
        gap: 24,
        height: '100vh',
        position: 'fixed' as any,
        left: isRTL ? 'auto' : 0,
        right: isRTL ? 0 : 'auto',
        top: 0,
        zIndex: 1000,
        transition: 'width 0.3s ease',
        boxShadow: isDark 
          ? '0 8px 32px rgba(210, 157, 89, 0.2)' 
          : '0 8px 32px rgba(45, 64, 84, 0.15)',
      }}
      className="mobile-hidden"
    >
      {/* Header with toggle */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        paddingTop: 8,
      }}>
        {!isCollapsed && (
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
            <img 
              src="https://eventdolab.com/assets/images/logo_maharat.png" 
              alt="دولاب المبدعين" 
              style={{ 
                width: 32, 
                height: 32, 
                filter: isDark ? 'brightness(1)' : 'brightness(0.8)' 
              }} 
            />
            <Text style={{
              color: colors.textPrimary,
              fontSize: 16,
              fontWeight: '700',
              fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
              direction: isRTL ? 'rtl' : 'ltr',
            }}>
              {t('system_name')}
            </Text>
          </View>
        )}
        <TouchableOpacity 
          onPress={toggleSidebar} 
          style={{ 
            padding: 8,
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        >
          {isCollapsed ? (
            <MenuIcon size={20} color={colors.textSecondary} />
          ) : (
            <CloseIcon size={20} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Navigation Section */}
      <View style={{ gap: 4 }}>
        {!isCollapsed && (
          <Text style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8,
            fontFamily: 'Playfair Display',
          }}>
            {t('nav.navigation') || 'NAVIGATION'}
          </Text>
        )}
        <SidebarItem 
          icon={<OverviewIcon size={20} color={activeIconColor} />} 
          label={t('nav.overview')} 
          active 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<ChartIcon size={20} color={iconColor} />} 
          label={t('nav.events')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<ReportIcon size={20} color={iconColor} />} 
          label={t('nav.tickets')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<StarIcon size={20} color={iconColor} />} 
          label={t('nav.attendees')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<PerformanceIcon size={20} color={iconColor} />} 
          label={t('nav.analytics')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<TargetIcon size={20} color={iconColor} />} 
          label={t('nav.staff')} 
          collapsed={isCollapsed}
        />
      </View>

      {/* Account Section */}
      <View style={{ gap: 4 }}>
        {!isCollapsed && (
          <Text style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8,
            fontFamily: 'Playfair Display',
          }}>
            ACCOUNT
          </Text>
        )}
        <SidebarItem 
          icon={<MessageIcon size={20} color={iconColor} />} 
          label={t('account.messages')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<SettingsIcon size={20} color={iconColor} />} 
          label={t('account.settings')} 
          collapsed={isCollapsed}
        />
        <SidebarItem 
          icon={<HelpIcon size={20} color={iconColor} />} 
          label={t('account.help')} 
          collapsed={isCollapsed}
        />
      </View>

      {/* Language Selector */}
      {!isCollapsed && (
        <View style={{
          backgroundColor: colors.glass,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <TouchableOpacity
            onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}
          >
            <Text style={{ 
              color: colors.textPrimary, 
              fontSize: 14, 
              fontWeight: '500', 
              fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
              direction: isRTL ? 'rtl' : 'ltr'
            }}>
              {language === 'ar' ? 'العربية' : 'English'}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              {isRTL ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Currency Selector */}
      {!isCollapsed && (
        <View style={{
          backgroundColor: colors.glass,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Text style={{ 
            color: colors.textPrimary, 
            fontSize: 14, 
            fontWeight: '500', 
            fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
            direction: isRTL ? 'rtl' : 'ltr'
          }}>
            {t('currency.sar')}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
            {isRTL ? '▲' : '▼'}
          </Text>
        </View>
      )}

      {/* Dark Mode Toggle */}
      <View style={{
        flexDirection: isCollapsed ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        marginTop: 'auto',
        gap: isCollapsed ? 8 : 0,
      }}>
        {!isCollapsed && (
          <Text style={{ 
            color: colors.textPrimary, 
            fontSize: 14, 
            fontWeight: '500', 
            fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
            direction: isRTL ? 'rtl' : 'ltr'
          }}>
            {isDark ? t('dark_mode') : t('light_mode')}
          </Text>
        )}
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            width: 44,
            height: 24,
            backgroundColor: isDark ? colors.accentGold : colors.accentNavy,
            borderRadius: 12,
            padding: 2,
            alignItems: isDark ? 'flex-end' : 'flex-start',
            justifyContent: 'center'
          }}
        >
          <View style={{
            width: 20,
            height: 20,
            backgroundColor: colors.textPrimary,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {isDark ? (
              <MoonIcon size={12} color={colors.background} />
            ) : (
              <SunIcon size={12} color={colors.background} />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {children}
    </View>
  );
}