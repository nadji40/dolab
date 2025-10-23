import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useApp, useLanguage, useTheme } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism } from '../theme';

const AttendeesScreen: React.FC = () => {
  const { state, refreshAttendees, checkInAttendee } = useApp();
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  const [query, setQuery] = useState('');

  useEffect(() => {
    refreshAttendees().catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return state.attendees;
    return state.attendees.filter(a => {
      const name = `${a.name.en} ${a.name.ar}`.toLowerCase();
      return (
        name.includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.ticketType.toLowerCase().includes(q)
      );
    });
  }, [query, state.attendees]);

  const onToggleCheckIn = async (attendeeId: string) => {
    await checkInAttendee(attendeeId);
  };

  const renderItem = ({ item }: any) => {
    const statusColor =
      item.checkInStatus === 'checked-in' ? colors.success : item.checkInStatus === 'no-show' ? colors.warn : colors.muted;
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: Platform.OS === 'web' ? glassStyle.backgroundColor : colors.surfaceCard,
            borderColor: colors.border,
            ...(Platform.OS === 'web' && {
              backdropFilter: glassStyle.backdropFilter,
              borderWidth: glassStyle.borderWidth,
              borderColor: glassStyle.borderColor,
            }),
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {isRTL ? item.name.ar : item.name.en}
          </Text>
          <Text style={[styles.status, { color: statusColor }]}>{item.checkInStatus}</Text>
        </View>
        <Text style={[styles.meta, { color: colors.textMuted }]}>{item.email} • {item.phone}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {t('attendees.ticket_type')}: {item.ticketType}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onToggleCheckIn(item.id)}
            style={[styles.button, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.buttonText}>{t('attendees.toggle_checkin')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: Platform.OS === 'web' ? glassStyle.backgroundColor : colors.surface,
            borderColor: colors.border,
            ...(Platform.OS === 'web' && {
              backdropFilter: glassStyle.backdropFilter,
              borderWidth: glassStyle.borderWidth,
              borderColor: glassStyle.borderColor,
            }),
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={t('attendees.search_placeholder')}
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  input: {
    fontSize: typography.sizes.md,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  status: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textTransform: 'capitalize',
  },
  meta: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonText: {
    color: '#fff',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
});

export default AttendeesScreen;


