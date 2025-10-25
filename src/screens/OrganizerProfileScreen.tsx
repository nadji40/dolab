import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, shadow } from '../theme';
import { Organizer, Event } from '../lib/mockApi';
import { MockApi } from '../lib/mockApi';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import ResponsiveGrid from '../components/ResponsiveGrid';

type OrganizerProfileRouteProp = RouteProp<RootStackParamList, 'OrganizerProfile'>;
type OrganizerProfileNavigationProp = StackNavigationProp<RootStackParamList, 'OrganizerProfile'>;

const { width } = Dimensions.get('window');

const OrganizerProfileScreen: React.FC = () => {
  const route = useRoute<OrganizerProfileRouteProp>();
  const navigation = useNavigation<OrganizerProfileNavigationProp>();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  
  const { organizerId } = route.params;
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'posts'>('about');
  
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  useEffect(() => {
    loadOrganizerData();
  }, [organizerId]);

  const loadOrganizerData = async () => {
    try {
      setLoading(true);
      const [organizerData, eventsData] = await Promise.all([
        MockApi.getOrganizer(organizerId),
        MockApi.getOrganizerEvents(organizerId),
      ]);
      
      setOrganizer(organizerData);
      setOrganizerEvents(eventsData);
    } catch (error) {
      console.error('Error loading organizer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  if (loading || !organizer) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  const StatCard = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
      <Ionicons name={icon as any} size={24} color={colors.accent} style={styles.statIcon} />
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );

  const EventCard = ({ event }: { event: Event }) => (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}
      onPress={() => handleEventPress(event.id)}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={[styles.eventTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {isRTL ? event.name.ar : event.name.en}
        </Text>
        <Text style={[styles.eventDate, { color: colors.textMuted }]}>
          {new Date(event.date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const PostCard = ({ post }: { post: any }) => (
    <View style={[styles.postCard, { backgroundColor: colors.surfaceCard, borderColor: colors.border }]}>
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}
      <View style={styles.postContent}>
        <Text style={[styles.postTitle, { color: colors.textPrimary }]}>
          {isRTL ? post.title.ar : post.title.en}
        </Text>
        <Text style={[styles.postText, { color: colors.textSecondary }]} numberOfLines={3}>
          {isRTL ? post.content.ar : post.content.en}
        </Text>
        <Text style={[styles.postDate, { color: colors.textMuted }]}>
          {new Date(post.publishedDate).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <View style={styles.headerContent}>
            {organizer.logo && (
              <Image source={{ uri: organizer.logo }} style={styles.logo} />
            )}
            <View style={styles.headerText}>
              <Text style={[styles.organizerName, { color: colors.textPrimary }]}>
                {isRTL ? organizer.name.ar : organizer.name.en}
              </Text>
              <Text style={[styles.organizerType, { color: colors.textMuted }]}>
                {t(`organizer.type.${organizer.type}`)}
              </Text>
              {organizer.address && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.locationText, { color: colors.textMuted }]}>
                    {isRTL ? organizer.address.ar : organizer.address.en}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Social Links */}
          {organizer.socialLinks && (
            <View style={styles.socialLinks}>
              {organizer.socialLinks.website && (
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: colors.accent }]}
                  onPress={() => handleOpenLink(organizer.website!)}
                >
                  <Ionicons name="globe-outline" size={20} color="#fff" />
                </TouchableOpacity>
              )}
              {organizer.socialLinks.twitter && (
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
                  onPress={() => handleOpenLink(organizer.socialLinks!.twitter!)}
                >
                  <Ionicons name="logo-twitter" size={20} color="#fff" />
                </TouchableOpacity>
              )}
              {organizer.socialLinks.linkedin && (
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: '#0077B5' }]}
                  onPress={() => handleOpenLink(organizer.socialLinks!.linkedin!)}
                >
                  <Ionicons name="logo-linkedin" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Stats */}
        {organizer.stats && (
          <View style={styles.statsContainer}>
            <ResponsiveGrid minItemWidth={120}>
              <StatCard
                icon="calendar-outline"
                label={t('organizer.total_events')}
                value={organizer.stats.totalEvents}
              />
              <StatCard
                icon="people-outline"
                label={t('organizer.total_attendees')}
                value={organizer.stats.totalAttendees.toLocaleString()}
              />
              <StatCard
                icon="star-outline"
                label={t('organizer.rating')}
                value={organizer.stats.averageRating.toFixed(1)}
              />
              <StatCard
                icon="time-outline"
                label={t('organizer.years_active')}
                value={organizer.stats.yearsActive}
              />
            </ResponsiveGrid>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && { borderBottomColor: colors.accent }]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'about' ? colors.accent : colors.textMuted }]}>
              {t('organizer.about')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'events' && { borderBottomColor: colors.accent }]}
            onPress={() => setActiveTab('events')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'events' ? colors.accent : colors.textMuted }]}>
              {t('organizer.events')} ({organizerEvents.length})
            </Text>
          </TouchableOpacity>
          {organizer.posts && organizer.posts.length > 0 && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'posts' && { borderBottomColor: colors.accent }]}
              onPress={() => setActiveTab('posts')}
            >
              <Text style={[styles.tabText, { color: activeTab === 'posts' ? colors.accent : colors.textMuted }]}>
                {t('organizer.posts')} ({organizer.posts.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'about' && (
            <View style={styles.aboutContent}>
              {organizer.bio && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    {t('organizer.about')}
                  </Text>
                  <Text style={[styles.bioText, { color: colors.textSecondary }]}>
                    {isRTL ? organizer.bio.ar : organizer.bio.en}
                  </Text>
                </View>
              )}

              {organizer.specialties && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    {t('organizer.specialties')}
                  </Text>
                  <View style={styles.specialtiesContainer}>
                    {(isRTL ? organizer.specialties.ar : organizer.specialties.en).map((specialty, index) => (
                      <View key={index} style={[styles.specialtyTag, { backgroundColor: colors.accent }]}>
                        <Text style={styles.specialtyText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  {t('organizer.details')}
                </Text>
                {organizer.establishedYear && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                      {t('organizer.established')}:
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {organizer.establishedYear}
                    </Text>
                  </View>
                )}
                {organizer.teamSize && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
                      {t('organizer.team_size')}:
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {organizer.teamSize} {t('organizer.employees')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {activeTab === 'events' && (
            <View style={styles.eventsContent}>
              <ResponsiveGrid minItemWidth={280}>
                {organizerEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </ResponsiveGrid>
            </View>
          )}

          {activeTab === 'posts' && organizer.posts && (
            <View style={styles.postsContent}>
              {organizer.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </View>
          )}
        </View>

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
  header: {
    padding: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  organizerName: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  organizerType: {
    fontSize: typography.sizes.md,
    textTransform: 'capitalize',
    marginBottom: spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: typography.sizes.sm,
    marginLeft: spacing.xs,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    padding: spacing.lg,
  },
  statCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 120,
  },
  statIcon: {
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  tabText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  tabContent: {
    padding: spacing.lg,
  },
  aboutContent: {},
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  bioText: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.md,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specialtyTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  specialtyText: {
    color: '#fff',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.sizes.md,
  },
  detailValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  eventsContent: {},
  eventCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  eventImage: {
    width: '100%',
    height: 120,
  },
  eventContent: {
    padding: spacing.md,
  },
  eventTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  eventDate: {
    fontSize: typography.sizes.sm,
  },
  postsContent: {},
  postCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  postImage: {
    width: '100%',
    height: 160,
  },
  postContent: {
    padding: spacing.md,
  },
  postTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  postText: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.normal * typography.sizes.md,
    marginBottom: spacing.sm,
  },
  postDate: {
    fontSize: typography.sizes.sm,
  },
});

export default OrganizerProfileScreen;

