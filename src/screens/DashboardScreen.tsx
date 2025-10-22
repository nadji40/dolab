import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
// Charts will be implemented with a compatible library in production
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage, useApp } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, shadow } from '../theme';

const { width } = Dimensions.get('window');
const chartWidth = width - (spacing.lg * 2);

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { state, refreshAnalytics, refreshEvents } = useApp();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  const periods = [
    { key: 'week', label: t('common.week') || 'Week' },
    { key: 'month', label: t('common.month') || 'Month' },
    { key: 'year', label: t('common.year') || 'Year' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshAnalytics(), refreshEvents()]);
    setRefreshing(false);
  };

  // Calculate analytics from events
  const analytics = state.analytics || {
    totalEvents: state.events.length,
    activeEvents: state.events.filter(e => e.status === 'active').length,
    totalAttendees: state.events.reduce((sum, event) => sum + event.ticketsSold, 0),
    totalRevenue: state.events.reduce((sum, event) => sum + event.revenue, 0),
  };

  const statsCards = [
    {
      title: t('dashboard.total_events'),
      value: analytics.totalEvents?.toString() || '0',
      icon: '📊',
      color: colors.accentBlue,
      change: '+12%',
    },
    {
      title: t('dashboard.active_events'),
      value: analytics.activeEvents?.toString() || '0',
      icon: '🎯',
      color: colors.accentGreen,
      change: '+8%',
    },
    {
      title: t('dashboard.total_attendees'),
      value: analytics.totalAttendees?.toLocaleString() || '0',
      icon: '👥',
      color: colors.accentPurple,
      change: '+25%',
    },
    {
      title: t('dashboard.revenue'),
      value: `${(analytics.totalRevenue / 1000000).toFixed(1)}M`,
      icon: '💰',
      color: colors.accent,
      change: '+18%',
    },
  ];

  // Sample chart data for recharts
  const salesData = [
    { month: 'Jan', sales: 20 },
    { month: 'Feb', sales: 45 },
    { month: 'Mar', sales: 28 },
    { month: 'Apr', sales: 80 },
    { month: 'May', sales: 99 },
    { month: 'Jun', sales: 43 },
  ];

  const attendanceData = [
    { day: 'Mon', attendance: 65 },
    { day: 'Tue', attendance: 78 },
    { day: 'Wed', attendance: 90 },
    { day: 'Thu', attendance: 81 },
    { day: 'Fri', attendance: 56 },
    { day: 'Sat', attendance: 55 },
    { day: 'Sun', attendance: 40 },
  ];

  const categoryData = [
    {
      name: t('category.business'),
      value: 35,
      fill: colors.accentBlue,
    },
    {
      name: t('category.cultural'),
      value: 25,
      fill: colors.accentGreen,
    },
    {
      name: t('category.educational'),
      value: 20,
      fill: colors.accentPurple,
    },
    {
      name: t('category.government'),
      value: 15,
      fill: colors.accentOrange,
    },
    {
      name: t('category.entertainment'),
      value: 5,
      fill: colors.accentPink,
    },
  ];

  // Chart styling for web compatibility

  const StatsCard = ({ title, value, icon, color, change }: any) => (
    <View
      style={[
        styles.statsCard,
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
      <View style={styles.statsHeader}>
        <View style={[styles.statsIcon, { backgroundColor: `${color}20` }]}>
          <Text style={styles.statsIconText}>{icon}</Text>
        </View>
        <View style={[styles.changeIndicator, { backgroundColor: colors.success }]}>
          <Text style={styles.changeText}>{change}</Text>
        </View>
      </View>
      
      <Text style={[styles.statsValue, { color: colors.textPrimary }]}>
        {value}
      </Text>
      
      <Text style={[styles.statsTitle, { color: colors.textMuted }]} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View
      style={[
        styles.chartCard,
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
      <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('dashboard.overview')}
        </Text>
        
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                {
                  backgroundColor: selectedPeriod === period.key ? colors.accent : 'transparent',
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodText,
                  {
                    color: selectedPeriod === period.key ? '#fff' : colors.textSecondary,
                  }
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </View>

        {/* Sales Trend Chart */}
        <ChartCard title={t('dashboard.sales_trend')}>
          <View style={[styles.chartPlaceholder, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartPlaceholderText, { color: colors.textMuted }]}>
              📈 Sales Trend Chart
            </Text>
            <Text style={[styles.chartPlaceholderSubtext, { color: colors.textMuted }]}>
              Interactive charts available in full version
            </Text>
          </View>
        </ChartCard>

        {/* Attendance Chart */}
        <ChartCard title={t('dashboard.attendance_rate')}>
          <View style={[styles.chartPlaceholder, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartPlaceholderText, { color: colors.textMuted }]}>
              📊 Attendance Chart
            </Text>
            <Text style={[styles.chartPlaceholderSubtext, { color: colors.textMuted }]}>
              Bar chart showing daily attendance
            </Text>
          </View>
        </ChartCard>

        {/* Category Distribution */}
        <ChartCard title={t('dashboard.event_categories')}>
          <View style={[styles.chartPlaceholder, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartPlaceholderText, { color: colors.textMuted }]}>
              🥧 Category Distribution
            </Text>
            <Text style={[styles.chartPlaceholderSubtext, { color: colors.textMuted }]}>
              Pie chart showing event categories
            </Text>
          </View>
        </ChartCard>

        {/* Recent Activity */}
        <View
          style={[
            styles.activityCard,
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
          <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>
            {t('dashboard.recent_activity')}
          </Text>
          
          {state.events.slice(0, 5).map((event, index) => (
            <View key={event.id} style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: colors.accent }]} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>
                  {isRTL ? event.name.ar : event.name.en}
                </Text>
                <Text style={[styles.activitySubtitle, { color: colors.textMuted }]}>
                  {event.ticketsSold} {t('attendees.title')} • {event.status}
                </Text>
              </View>
              <Text style={[styles.activityTime, { color: colors.textMuted }]}>
                {new Date(event.date).toLocaleDateString()}
              </Text>
            </View>
          ))}
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
  },
  periodText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statsCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsIconText: {
    fontSize: 20,
  },
  changeIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  changeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: '#fff',
  },
  statsValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  statsTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.tight * typography.sizes.sm,
  },
  chartCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  chartPlaceholder: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
  },
  chartPlaceholderText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  chartPlaceholderSubtext: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  activityCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  activitySubtitle: {
    fontSize: typography.sizes.sm,
  },
  activityTime: {
    fontSize: typography.sizes.xs,
  },
});

export default DashboardScreen;
