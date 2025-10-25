import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, shadow } from '../theme';
import { JobPosting, MockApi } from '../lib/mockApi';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import ResponsiveGrid from '../components/ResponsiveGrid';

type JobsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const JobsScreen: React.FC = () => {
  const navigation = useNavigation<JobsScreenNavigationProp>();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await MockApi.getJobPostings();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handleJobPress = (jobId: string) => {
    navigation.navigate('JobDetail', { jobId });
  };

  const handleOrganizerPress = (organizerId: string) => {
    navigation.navigate('OrganizerProfile', { organizerId });
  };

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return t('jobs.salary_negotiable');
    
    const formatter = new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: salary.currency,
      minimumFractionDigits: 0,
    });
    
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return colors.success;
      case 'part-time': return colors.accentBlue;
      case 'contract': return colors.accentOrange;
      case 'internship': return colors.accentPurple;
      default: return colors.muted;
    }
  };

  const JobCard = ({ job }: { job: JobPosting }) => (
    <TouchableOpacity
      style={[
        styles.jobCard,
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
      onPress={() => handleJobPress(job.id)}
      activeOpacity={0.8}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleSection}>
          <Text 
            style={[
              styles.jobTitle, 
              { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }
            ]}
            numberOfLines={2}
          >
            {isRTL ? job.title.ar : job.title.en}
          </Text>
          
          <View style={[styles.jobTypeBadge, { backgroundColor: getJobTypeColor(job.type) }]}>
            <Text style={styles.jobTypeText}>
              {t(`jobs.type.${job.type}`)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.organizerSection}
        onPress={() => handleOrganizerPress(job.organizer.id)}
      >
        {job.organizer.logo && (
          <Image source={{ uri: job.organizer.logo }} style={styles.organizerLogo} />
        )}
        <View style={styles.organizerInfo}>
          <Text style={[styles.organizerName, { color: colors.accent }]}>
            {isRTL ? job.organizer.name.ar : job.organizer.name.en}
          </Text>
          <Text style={[styles.organizerType, { color: colors.textMuted }]}>
            {t(`organizer.type.${job.organizer.type}`)}
          </Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={16} color={colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            {isRTL ? job.location.ar : job.location.en}
          </Text>
        </View>
        
        <View style={styles.metaItem}>
          <Ionicons name="briefcase-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            {isRTL ? job.department.ar : job.department.en}
          </Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={[styles.salaryText, { color: colors.accent }]}>
          {formatSalary(job.salary)}
        </Text>
        
        <Text style={[styles.postedDate, { color: colors.textMuted }]}>
          {new Date(job.postedDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('jobs.available_positions')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            {jobs.length} {t('jobs.positions_available')}
          </Text>
        </View>

        {/* Jobs Grid */}
        <View style={styles.jobsContainer}>
          <ResponsiveGrid minItemWidth={320}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </ResponsiveGrid>
        </View>

        {/* Empty State */}
        {jobs.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {t('jobs.no_jobs')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {t('jobs.check_back_later')}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.lg,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.sizes.md,
  },
  jobsContainer: {
    padding: spacing.lg,
  },
  jobCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
  },
  jobHeader: {
    marginBottom: spacing.md,
  },
  jobTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginRight: spacing.sm,
  },
  jobTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  jobTypeText: {
    color: '#fff',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  organizerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  organizerLogo: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  organizerType: {
    fontSize: typography.sizes.sm,
    textTransform: 'capitalize',
  },
  jobMeta: {
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    marginLeft: spacing.xs,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  postedDate: {
    fontSize: typography.sizes.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed * typography.sizes.md,
  },
});

export default JobsScreen;


