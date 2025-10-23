import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../contexts/AppContext';
import { darkColors, lightColors, spacing, borderRadius, glassMorphism } from '../theme';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import TicketScreen from '../screens/TicketScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AttendeesScreen from '../screens/AttendeesScreen';
import CheckInScreen from '../screens/CheckInScreen';
import TeamScreen from '../screens/TeamScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import JobsScreen from '../screens/JobsScreen';
import JobDetailScreen from '../screens/JobDetailScreen';

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  EventDetail: { eventId: string };
  Checkout: { eventId: string; ticketTypeId: string };
  Ticket: { ticketId: string };
  Attendees: { eventId?: string };
  JobDetail: { jobId: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  CheckIn: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Tab Bar Icon Component
const TabIcon = ({ name, focused, color }: { name: string; focused: boolean; color: string }) => {
  const size = 22;
  const iconByRoute: Record<string, { active: any; inactive: any }> = {
    Home: { active: 'home', inactive: 'home-outline' },
    Dashboard: { active: 'bar-chart', inactive: 'bar-chart-outline' },
    CheckIn: { active: 'qr-code', inactive: 'qr-code-outline' },
    Settings: { active: 'settings', inactive: 'settings-outline' },
  };
  const iconName = (iconByRoute[name] || iconByRoute.Home)[focused ? 'active' : 'inactive'];
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons name={iconName} size={size} color={color} />
    </View>
  );
};

// Auth Stack Navigator
const AuthNavigator = () => {
  const { isDark } = useTheme();
  const colors = isDark ? darkColors : lightColors;

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'register' }}
      />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const { isDark } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = isDark ? darkColors : lightColors;
  const glassStyle = isDark ? glassMorphism.dark : glassMorphism.light;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => (
          <TabIcon name={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: Platform.OS === 'web' ? glassStyle.backgroundColor : colors.surface,
            borderTopColor: colors.border,
            ...(Platform.OS === 'web' && {
              backdropFilter: glassStyle.backdropFilter,
              borderWidth: glassStyle.borderWidth,
              borderColor: glassStyle.borderColor,
            }),
          },
        ],
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -2,
        },
        headerStyle: {
          backgroundColor: Platform.OS === 'web' ? glassStyle.backgroundColor : colors.surface,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          ...(Platform.OS === 'web' && {
            backdropFilter: glassStyle.backdropFilter,
            borderWidth: glassStyle.borderWidth,
            borderColor: glassStyle.borderColor,
          }),
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          textAlign: isRTL ? 'right' : 'left',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: t('nav.home'),
          headerTitle: t('home.title'),
        }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ 
          title: t('nav.dashboard'),
          headerTitle: t('dashboard.title'),
        }}
      />
      <Tab.Screen 
        name="CheckIn" 
        component={CheckInScreen}
        options={{ 
          title: t('nav.checkin'),
          headerTitle: t('checkin.title'),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: t('nav.settings'),
          headerTitle: t('settings.title'),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const colors = isDark ? darkColors : lightColors;
  const [isAuthenticated, setIsAuthenticated] = React.useState(true); // Mock auth state

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.accent,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="EventDetail" 
              component={EventDetailScreen}
              options={{ 
                title: t('event.details'),
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="Checkout" 
              component={CheckoutScreen}
              options={{ 
                title: t('checkout.title'),
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="Ticket" 
              component={TicketScreen}
              options={{ 
                title: t('ticket.title'),
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="Attendees" 
              component={AttendeesScreen}
              options={{ title: t('attendees.title') }}
            />
            <Stack.Screen 
              name="JobDetail" 
              component={JobDetailScreen}
              options={{ 
                title: t('jobs.title'),
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabBar: {
    height: Platform.OS === 'ios' ? 85 : 60,
    paddingBottom: Platform.OS === 'ios' ? 25 : spacing.sm,
    paddingTop: spacing.sm,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: Platform.OS === 'ios' ? 0 : spacing.md,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default AppNavigator;

