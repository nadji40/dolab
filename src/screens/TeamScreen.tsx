import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, typography } from '../theme';

const TeamScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        {t('team.coming_soon')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  text: {
    fontSize: typography.sizes.lg,
    textAlign: 'center',
  },
});

export default TeamScreen;


