import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import { useTheme, useLanguage, useApp } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, typography, glassMorphism, shadow } from '../theme';

const { width, height } = Dimensions.get('window');

const CheckInScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { isRTL } = useLanguage();
  const { checkInAttendee } = useApp();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [manualEntry, setManualEntry] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'web') {
      // Web camera permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (error) {
        setHasPermission(false);
      }
    } else {
      // Mobile camera permission
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScannerActive(false);
    await processCheckIn(data);
  };

  const processCheckIn = async (ticketId: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Extract attendee ID from QR code (format: QR-eventId-ticketTypeId-timestamp)
      const parts = ticketId.split('-');
      if (parts.length >= 4) {
        // Mock attendee ID based on ticket data
        const attendeeId = `att-${parts[1]}-${parts[2]}`;
        
        const success = await checkInAttendee(attendeeId);
        
        if (success) {
          Alert.alert(
            t('checkin.success'),
            t('checkin.success'),
            [{ text: t('common.confirm'), onPress: resetScanner }]
          );
        } else {
          Alert.alert(
            t('checkin.failed'),
            t('checkin.already_checked'),
            [{ text: t('common.confirm'), onPress: resetScanner }]
          );
        }
      } else {
        Alert.alert(
          t('checkin.failed'),
          t('checkin.invalid_ticket'),
          [{ text: t('common.confirm'), onPress: resetScanner }]
        );
      }
    } catch (error) {
      Alert.alert(
        t('checkin.failed'),
        t('common.error'),
        [{ text: t('common.confirm'), onPress: resetScanner }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setManualEntry('');
  };

  const handleManualCheckIn = async () => {
    if (!manualEntry.trim()) return;
    await processCheckIn(manualEntry.trim());
  };

  const startScanning = () => {
    if (hasPermission) {
      setScannerActive(true);
      setScanned(false);
    } else {
      Alert.alert(
        t('checkin.camera_permission'),
        t('checkin.enable_camera'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.confirm'), onPress: requestCameraPermission },
        ]
      );
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.textPrimary }]}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>
          {t('checkin.camera_permission')}
        </Text>
        <Text style={[styles.permissionMessage, { color: colors.textMuted }]}>
          {t('checkin.enable_camera')}
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: colors.accent }]}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>
            {t('checkin.enable_camera')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {scannerActive ? (
        <View style={styles.scannerContainer}>
          {Platform.OS === 'web' ? (
            // Web QR Scanner (simplified)
            <View style={[styles.webScanner, { backgroundColor: colors.surface }]}>
              <Text style={[styles.scannerMessage, { color: colors.textPrimary }]}>
                {t('checkin.scan_qr')}
              </Text>
              <Text style={[styles.scannerSubMessage, { color: colors.textMuted }]}>
                Web QR scanning requires additional setup
              </Text>
            </View>
          ) : (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          
          {/* Scanner Overlay */}
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerHeader}>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.surface }]}
                onPress={() => setScannerActive(false)}
              >
                <Text style={[styles.closeButtonText, { color: colors.textPrimary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.scannerFrame}>
              <View style={[styles.scannerCorner, styles.topLeft, { borderColor: colors.accent }]} />
              <View style={[styles.scannerCorner, styles.topRight, { borderColor: colors.accent }]} />
              <View style={[styles.scannerCorner, styles.bottomLeft, { borderColor: colors.accent }]} />
              <View style={[styles.scannerCorner, styles.bottomRight, { borderColor: colors.accent }]} />
            </View>
            
            <View style={styles.scannerFooter}>
              <Text style={[styles.scannerInstructions, { color: colors.textPrimary }]}>
                {t('checkin.scan_qr')}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('checkin.title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Scan QR codes or enter ticket IDs manually
            </Text>
          </View>

          {/* QR Scanner Button */}
          <TouchableOpacity
            style={[
              styles.scanButton,
              {
                backgroundColor: Platform.OS === 'web' ? glassStyle.backgroundColor : colors.accent,
                borderColor: colors.accent,
                ...(Platform.OS === 'web' && {
                  backdropFilter: glassStyle.backdropFilter,
                  borderWidth: glassStyle.borderWidth,
                  borderColor: glassStyle.borderColor,
                }),
              },
              shadow.button,
            ]}
            onPress={startScanning}
            disabled={isProcessing}
          >
            <Text style={styles.scanButtonIcon}>📱</Text>
            <Text style={[styles.scanButtonText, { color: '#fff' }]}>
              {t('checkin.scan_qr')}
            </Text>
          </TouchableOpacity>

          {/* Manual Entry */}
          <View
            style={[
              styles.manualSection,
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
            <Text style={[styles.manualTitle, { color: colors.textPrimary }]}>
              {t('checkin.manual_entry')}
            </Text>
            
            <TextInput
              style={[
                styles.manualInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                }
              ]}
              placeholder={t('checkin.ticket_id')}
              placeholderTextColor={colors.textMuted}
              value={manualEntry}
              onChangeText={setManualEntry}
              textAlign={isRTL ? 'right' : 'left'}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity
              style={[
                styles.manualButton,
                {
                  backgroundColor: manualEntry.trim() ? colors.accent : colors.muted,
                }
              ]}
              onPress={handleManualCheckIn}
              disabled={!manualEntry.trim() || isProcessing}
            >
              <Text style={styles.manualButtonText}>
                {isProcessing ? t('common.loading') : t('checkin.title')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Check-ins */}
          <View
            style={[
              styles.recentSection,
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
            <Text style={[styles.recentTitle, { color: colors.textPrimary }]}>
              Recent Check-ins
            </Text>
            
            {/* Mock recent check-ins */}
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.recentItem}>
                <View style={[styles.recentDot, { backgroundColor: colors.success }]} />
                <View style={styles.recentContent}>
                  <Text style={[styles.recentName, { color: colors.textPrimary }]}>
                    Attendee #{item}
                  </Text>
                  <Text style={[styles.recentTime, { color: colors.textMuted }]}>
                    {new Date().toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.recentIcon}>✅</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed * typography.sizes.md,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 2,
  },
  scanButtonIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  scanButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  manualSection: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
  },
  manualTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  manualInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    marginBottom: spacing.md,
  },
  manualButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#fff',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  recentSection: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  recentTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  recentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  recentContent: {
    flex: 1,
  },
  recentName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  recentTime: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  recentIcon: {
    fontSize: 16,
  },
  scannerContainer: {
    flex: 1,
  },
  webScanner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scannerHeader: {
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannerFrame: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 3,
  },
  topLeft: {
    top: -100,
    left: -100,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -100,
    right: -100,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -100,
    left: -100,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -100,
    right: -100,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scannerFooter: {
    paddingBottom: 100,
    alignItems: 'center',
  },
  scannerInstructions: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
  scannerMessage: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  scannerSubMessage: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.sizes.lg,
    textAlign: 'center',
  },
  permissionIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  permissionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.md,
  },
  permissionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});

export default CheckInScreen;
