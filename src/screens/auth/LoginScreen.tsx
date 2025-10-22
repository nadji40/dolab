import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage } from '../../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism } from '../../theme';

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  const handleLogin = () => {
    // Mock login - in real app, this would authenticate with backend
    console.log('Login attempted with:', email, password);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://eventdolab.com/assets/images/logo_maharat.png' }}
            style={[styles.logo, { tintColor: colors.textPrimary }]}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: colors.textPrimary }]}>
            {t('system.name')}
          </Text>
          <Text style={[styles.tagline, { color: colors.textMuted }]}>
            {t('system.tagline')}
          </Text>
        </View>

        {/* Form */}
        <View
          style={[
            styles.form,
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
          <Text style={[styles.welcomeText, { color: colors.textPrimary }]}>
            {t('auth.welcome_back')}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              }
            ]}
            placeholder={t('auth.email')}
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textAlign={isRTL ? 'right' : 'left'}
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              }
            ]}
            placeholder={t('auth.password')}
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textAlign={isRTL ? 'right' : 'left'}
          />

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.accent }]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>
              {t('auth.sign_in')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.accent }]}>
              {t('auth.forgot_password')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            {t('auth.dont_have_account')}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.signUpText, { color: colors.accent }]}>
              {t('auth.sign_up')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  form: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  welcomeText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    marginBottom: spacing.md,
  },
  loginButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: typography.sizes.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.md,
    marginRight: spacing.sm,
  },
  signUpText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});

export default LoginScreen;
