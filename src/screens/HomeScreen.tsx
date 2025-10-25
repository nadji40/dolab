import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage, useApp } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, shadow, responsive } from '../theme';
import { Event } from '../lib/mockApi';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import ResponsiveGrid from '../components/ResponsiveGrid';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - (spacing.lg * 2);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { state, refreshEvents } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  const categories = [
    { key: null, label: t('common.all') || 'All' },
    { key: 'business', label: t('category.business') },
    { key: 'cultural', label: t('category.cultural') },
    { key: 'educational', label: t('category.educational') },
    { key: 'government', label: t('category.government') },
    { key: 'entertainment', label: t('category.entertainment') },
  ];

  const filteredEvents = state.events.filter((event: Event) => {
    const matchesSearch = !searchQuery || 
      event.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.name.ar.includes(searchQuery) ||
      event.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.ar.includes(searchQuery);
    
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming');
  const activeEvents = filteredEvents.filter(event => event.status === 'active');

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshEvents();
    setRefreshing(false);
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  const formatDate = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const time = timeString;
    return {
      date: date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
        day: 'numeric',
        month: 'short',
      }),
      time: time,
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const EventCard = ({ event }: { event: Event }) => {
    const { date, time } = formatDate(event.date, event.time);
    const minPrice = Math.min(...event.tickets.map(t => t.price));
    
    return (
      <TouchableOpacity
        style={[
          styles.eventCard,
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
        onPress={() => handleEventPress(event.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: event.image }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text 
              style={[
                styles.eventTitle, 
                { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }
              ]}
              numberOfLines={2}
            >
              {isRTL ? event.name.ar : event.name.en}
            </Text>
            
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
              <Text style={[styles.statusText, { color: '#fff' }]}>
                {t(`status.${event.status}`)}
              </Text>
            </View>
          </View>
          
          <Text 
            style={[
              styles.eventDescription, 
              { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }
            ]}
            numberOfLines={2}
          >
            {isRTL ? event.description.ar : event.description.en}
          </Text>
          
          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
              <Text style={[styles.metaText, { color: colors.textMuted }]}>
                {date} • {time}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
              <Text style={[styles.metaText, { color: colors.textMuted }]} numberOfLines={1}>
                {isRTL ? event.venue.ar : event.venue.en}
              </Text>
            </View>
          </View>
          
          <View style={styles.eventFooter}>
            <Text style={[styles.priceText, { color: colors.accent }]}>
              {t('common.from')} {formatPrice(minPrice)}
            </Text>
            
            <View style={styles.capacityInfo}>
              <Text style={[styles.capacityText, { color: colors.textMuted }]}>
                {event.ticketsSold}/{event.capacity}
              </Text>
              <View style={[styles.capacityBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.capacityFill,
                    { 
                      backgroundColor: colors.accent,
                      width: `${(event.ticketsSold / event.capacity) * 100}%`
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'upcoming': return colors.accentBlue;
      case 'completed': return colors.muted;
      case 'cancelled': return colors.danger;
      default: return colors.muted;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.textMuted }]}>
              {t('home.welcome')}
            </Text>
            <Text style={[styles.titleText, { color: colors.textPrimary }]}>
              {t('system.name')}
            </Text>
          </View>
          
          <Image
            source={{ uri: 'https://eventdolab.com/assets/images/logo_maharat.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surfaceElev, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={16} color={colors.textMuted} style={{ marginRight: spacing.sm }} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder={t('home.search_placeholder')}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign={isRTL ? 'right' : 'left'}
          />
        </View>
        
        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key || 'all'}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.key ? colors.accent : colors.surfaceElev,
                  borderColor: selectedCategory === category.key ? colors.accent : colors.border,
                }
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.key ? '#fff' : colors.textSecondary,
                  }
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
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
        {/* Active Events */}
        {activeEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('home.active_events')}
            </Text>
            <ResponsiveGrid minItemWidth={320}>
              {activeEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ResponsiveGrid>
          </View>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('home.upcoming_events')}
            </Text>
            <ResponsiveGrid minItemWidth={320}>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </ResponsiveGrid>
          </View>
        )}

        {/* No Events */}
        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.textMuted} style={{ marginBottom: spacing.lg }} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {t('home.no_events')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              {t('home.subtitle')}
            </Text>
          </View>
        )}
        
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  welcomeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
  },
  titleText: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xs,
  },
  logo: {
    width: 40,
    height: 40,
    tintColor: '#fff', // Make white logo visible on dark backgrounds
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
  },
  categoriesContainer: {
    marginHorizontal: -spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  eventCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventContent: {
    padding: spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  eventTitle: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight * typography.sizes.lg,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  eventDescription: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.normal * typography.sizes.sm,
    marginBottom: spacing.md,
  },
  eventMeta: {
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  metaIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  metaText: {
    fontSize: typography.sizes.sm,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  capacityInfo: {
    alignItems: 'flex-end',
  },
  capacityText: {
    fontSize: typography.sizes.xs,
    marginBottom: spacing.xs,
  },
  capacityBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed * typography.sizes.md,
  },
});

export default HomeScreen;

