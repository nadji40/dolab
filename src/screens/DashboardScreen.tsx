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
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
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

  // Sample chart data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => colors.accent,
        strokeWidth: 3,
      },
    ],
  };

  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [65, 78, 90, 81, 56, 55, 40],
      },
    ],
  };

  const categoryData = [
    {
      name: t('category.business'),
      population: 35,
      color: colors.accentBlue,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: t('category.cultural'),
      population: 25,
      color: colors.accentGreen,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: t('category.educational'),
      population: 20,
      color: colors.accentPurple,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: t('category.government'),
      population: 15,
      color: colors.accentOrange,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
    {
      name: t('category.entertainment'),
      population: 5,
      color: colors.accentPink,
      legendFontColor: colors.textPrimary,
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.textPrimary,
    labelColor: (opacity = 1) => colors.textMuted,
    style: {
      borderRadius: borderRadius.md,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.accent,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.border,
      strokeWidth: 1,
    },
  };

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
          <LineChart
            data={salesData}
            width={chartWidth - (spacing.lg * 2)}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </ChartCard>

        {/* Attendance Chart */}
        <ChartCard title={t('dashboard.attendance_rate')}>
          <BarChart
            data={attendanceData}
            width={chartWidth - (spacing.lg * 2)}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
          />
        </ChartCard>

        {/* Category Distribution */}
        <ChartCard title={t('dashboard.event_categories')}>
          <PieChart
            data={categoryData}
            width={chartWidth - (spacing.lg * 2)}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
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

