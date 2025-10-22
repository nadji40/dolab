import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage, useApp } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, shadow } from '../theme';
import { Event } from '../lib/mockApi';
import { RootStackParamList } from '../navigation/AppNavigator';

type EventDetailRouteProp = RouteProp<RootStackParamList, 'EventDetail'>;
type EventDetailNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetail'>;

const { width } = Dimensions.get('window');

const EventDetailScreen: React.FC = () => {
  const route = useRoute<EventDetailRouteProp>();
  const navigation = useNavigation<EventDetailNavigationProp>();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { state } = useApp();
  
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
  
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  useEffect(() => {
    const foundEvent = state.events.find(e => e.id === eventId);
    setEvent(foundEvent || null);
    
    if (foundEvent && foundEvent.tickets.length > 0) {
      setSelectedTicketType(foundEvent.tickets[0].id);
    }
  }, [eventId, state.events]);

  const handleShare = async () => {
    if (!event) return;
    
    try {
      const message = `${isRTL ? event.name.ar : event.name.en}\n${isRTL ? event.description.ar : event.description.en}\n\nDate: ${event.date} at ${event.time}\nVenue: ${isRTL ? event.venue.ar : event.venue.en}`;
      
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: isRTL ? event.name.ar : event.name.en,
            text: message,
            url: window.location.href,
          });
        } else {
          // Fallback for web browsers without Web Share API
          navigator.clipboard.writeText(message);
          alert('Event details copied to clipboard!');
        }
      } else {
        await Share.share({
          message,
          title: isRTL ? event.name.ar : event.name.en,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBuyTicket = () => {
    if (!event || !selectedTicketType) return;
    
    navigation.navigate('Checkout', {
      eventId: event.id,
      ticketTypeId: selectedTicketType,
    });
  };

  const formatDate = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: timeString,
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price);
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

  if (!event) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          Event not found
        </Text>
      </View>
    );
  }

  const { date, time } = formatDate(event.date, event.time);
  const selectedTicket = event.tickets.find(t => t.id === selectedTicketType);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: event.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          {/* Overlay */}
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
                <Text style={styles.statusText}>
                  {t(`status.${event.status}`)}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.shareButton, { backgroundColor: colors.glass }]}
                onPress={handleShare}
              >
                <Text style={styles.shareIcon}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Description */}
          <View style={styles.titleSection}>
            <Text 
              style={[
                styles.title, 
                { color: colors.textPrimary, textAlign: isRTL ? 'right' : 'left' }
              ]}
            >
              {isRTL ? event.name.ar : event.name.en}
            </Text>
            
            <Text 
              style={[
                styles.description, 
                { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }
              ]}
            >
              {isRTL ? event.description.ar : event.description.en}
            </Text>
          </View>

          {/* Event Info */}
          <View
            style={[
              styles.infoCard,
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
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📅</Text>
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                  {t('event.date_time')}
                </Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {date}
                </Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {time}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                  {t('event.venue')}
                </Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {isRTL ? event.venue.ar : event.venue.en}
                </Text>
                <Text style={[styles.infoSubValue, { color: colors.textMuted }]}>
                  {isRTL ? event.location.address.ar : event.location.address.en}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>👥</Text>
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                  {t('event.capacity')}
                </Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {event.ticketsSold} / {event.capacity}
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

            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🏢</Text>
              <View style={styles.infoText}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>
                  {t('event.organizer')}
                </Text>
                <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                  {isRTL ? event.organizer.name.ar : event.organizer.name.en}
                </Text>
              </View>
            </View>
          </View>

          {/* Tickets */}
          <View
            style={[
              styles.ticketsCard,
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
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('ticket.title')}
            </Text>
            
            {event.tickets.map((ticket, index) => (
              <TouchableOpacity
                key={ticket.id}
                style={[
                  styles.ticketOption,
                  {
                    backgroundColor: selectedTicketType === ticket.id ? `${colors.accent}20` : 'transparent',
                    borderColor: selectedTicketType === ticket.id ? colors.accent : colors.border,
                  },
                  index < event.tickets.length - 1 && { marginBottom: spacing.md }
                ]}
                onPress={() => setSelectedTicketType(ticket.id)}
              >
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketInfo}>
                    <Text style={[styles.ticketName, { color: colors.textPrimary }]}>
                      {isRTL ? ticket.name.ar : ticket.name.en}
                    </Text>
                    <Text style={[styles.ticketPrice, { color: colors.accent }]}>
                      {formatPrice(ticket.price)}
                    </Text>
                  </View>
                  
                  <View style={styles.ticketAvailability}>
                    <Text style={[styles.availabilityText, { color: colors.textMuted }]}>
                      {ticket.available} {t('ticket.available')}
                    </Text>
                    <View style={[
                      styles.radioButton,
                      {
                        borderColor: selectedTicketType === ticket.id ? colors.accent : colors.border,
                        backgroundColor: selectedTicketType === ticket.id ? colors.accent : 'transparent',
                      }
                    ]}>
                      {selectedTicketType === ticket.id && (
                        <View style={[styles.radioButtonInner, { backgroundColor: '#fff' }]} />
                      )}
                    </View>
                  </View>
                </View>
                
                <View style={styles.ticketFeatures}>
                  {(isRTL ? ticket.features.ar : ticket.features.en).map((feature, featureIndex) => (
                    <Text key={featureIndex} style={[styles.featureText, { color: colors.textMuted }]}>
                      • {feature}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.priceInfo}>
          <Text style={[styles.priceLabel, { color: colors.textMuted }]}>
            {t('ticket.price')}
          </Text>
          <Text style={[styles.priceValue, { color: colors.textPrimary }]}>
            {selectedTicket ? formatPrice(selectedTicket.price) : '---'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.buyButton,
            {
              backgroundColor: selectedTicket && selectedTicket.available > 0 ? colors.accent : colors.muted,
            }
          ]}
          onPress={handleBuyTicket}
          disabled={!selectedTicket || selectedTicket.available === 0}
        >
          <Text style={styles.buyButtonText}>
            {selectedTicket && selectedTicket.available > 0 
              ? t('event.buy_ticket') 
              : 'Sold Out'
            }
          </Text>
        </TouchableOpacity>
      </View>
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
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.xl,
  },
  statusText: {
    color: '#fff',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  shareButton: {
    alignSelf: 'flex-end',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },
  content: {
    padding: spacing.lg,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight * typography.sizes.xxxl,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.sizes.lg,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.lg,
  },
  infoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    marginTop: spacing.xs,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  infoSubValue: {
    fontSize: typography.sizes.sm,
  },
  capacityBar: {
    height: 6,
    borderRadius: 3,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 3,
  },
  ticketsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.lg,
  },
  ticketOption: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  ticketPrice: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  ticketAvailability: {
    alignItems: 'flex-end',
  },
  availabilityText: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ticketFeatures: {
    marginTop: spacing.sm,
  },
  featureText: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  priceInfo: {
    flex: 1,
  },
  priceLabel: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
  },
  priceValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  buyButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 120,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  errorText: {
    fontSize: typography.sizes.lg,
    textAlign: 'center',
  },
});

export default EventDetailScreen;
