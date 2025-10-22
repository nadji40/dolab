import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MockApi, Event, Attendee, PurchasedTicket, TeamMember, JobPosting } from '../lib/mockApi';

// Theme types
export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

// Language types
export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

// Sidebar types
interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

// Loading types
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Language Context
const translations = {
  ar: {
    // Navigation
    'nav.navigation': 'التنقل',
    'nav.overview': 'نظرة عامة',
    'nav.events': 'الفعاليات',
    'nav.tickets': 'التذاكر',
    'nav.attendees': 'الحضور',
    'nav.analytics': 'التحليلات',
    'nav.staff': 'الموظفون',
    'nav.venues': 'الأماكن',
    
    // Account
    'account.messages': 'الرسائل',
    'account.settings': 'الإعدادات',
    'account.help': 'المساعدة',
    'account.profile': 'الملف الشخصي',
    
    // Dashboard
    'dashboard.total_events': 'إجمالي الفعاليات',
    'dashboard.active_events': 'الفعاليات النشطة',
    'dashboard.total_attendees': 'إجمالي الحضور',
    'dashboard.revenue': 'الإيرادات',
    'dashboard.upcoming_events': 'الفعاليات القادمة',
    'dashboard.recent_registrations': 'التسجيلات الحديثة',
    'dashboard.event_performance': 'أداء الفعاليات',
    'dashboard.attendance_trends': 'اتجاهات الحضور',
    'dashboard.revenue_breakdown': 'تفصيل الإيرادات',
    
    // Events
    'events.create_event': 'إنشاء فعالية',
    'events.event_name': 'اسم الفعالية',
    'events.event_date': 'تاريخ الفعالية',
    'events.venue': 'المكان',
    'events.capacity': 'السعة',
    'events.ticket_price': 'سعر التذكرة',
    'events.description': 'الوصف',
    'events.category': 'الفئة',
    
    // Tickets
    'tickets.total_sold': 'إجمالي المبيعات',
    'tickets.available': 'متاح',
    'tickets.vip': 'كبار الشخصيات',
    'tickets.regular': 'عادي',
    'tickets.student': 'طلابي',
    'tickets.early_bird': 'الطائر المبكر',
    
    // Other
    'currency.sar': 'ريال سعودي',
    'dark_mode': 'الوضع المظلم',
    'light_mode': 'الوضع المضيء',
    'welcome': 'مرحباً',
    'system_name': 'دولاب المبدعين',
  },
  en: {
    // Navigation
    'nav.navigation': 'NAVIGATION',
    'nav.overview': 'OVERVIEW',
    'nav.events': 'Events',
    'nav.tickets': 'Tickets',
    'nav.attendees': 'Attendees',
    'nav.analytics': 'Analytics',
    'nav.staff': 'Staff',
    'nav.venues': 'Venues',
    
    // Account
    'account.messages': 'Messages',
    'account.settings': 'Settings',
    'account.help': 'Help',
    'account.profile': 'Profile',
    
    // Dashboard
    'dashboard.total_events': 'Total Events',
    'dashboard.active_events': 'Active Events',
    'dashboard.total_attendees': 'Total Attendees',
    'dashboard.revenue': 'Revenue',
    'dashboard.upcoming_events': 'Upcoming Events',
    'dashboard.recent_registrations': 'Recent Registrations',
    'dashboard.event_performance': 'Event Performance',
    'dashboard.attendance_trends': 'Attendance Trends',
    'dashboard.revenue_breakdown': 'Revenue Breakdown',
    
    // Events
    'events.create_event': 'Create Event',
    'events.event_name': 'Event Name',
    'events.event_date': 'Event Date',
    'events.venue': 'Venue',
    'events.capacity': 'Capacity',
    'events.ticket_price': 'Ticket Price',
    'events.description': 'Description',
    'events.category': 'Category',
    
    // Tickets
    'tickets.total_sold': 'Total Sold',
    'tickets.available': 'Available',
    'tickets.vip': 'VIP',
    'tickets.regular': 'Regular',
    'tickets.student': 'Student',
    'tickets.early_bird': 'Early Bird',
    
    // Other
    'currency.sar': 'SAR',
    'dark_mode': 'Dark Mode',
    'light_mode': 'Light Mode',
    'welcome': 'Welcome',
    'system_name': 'Dolab Al-Mubdi\'een',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  const isRTL = language === 'ar';

  // Update document direction when language changes
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Sidebar Context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Loading Context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// App State Context
interface AppState {
  events: Event[];
  attendees: Attendee[];
  userTickets: PurchasedTicket[];
  teamMembers: TeamMember[];
  jobPostings: JobPosting[];
  analytics: any;
  isOnline: boolean;
  lastSync: string | null;
}

interface AppContextType {
  state: AppState;
  refreshEvents: () => Promise<void>;
  refreshAttendees: (eventId?: string) => Promise<void>;
  refreshUserTickets: () => Promise<void>;
  refreshTeam: () => Promise<void>;
  refreshJobs: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  purchaseTicket: (eventId: string, ticketTypeId: string, attendeeInfo: any) => Promise<PurchasedTicket>;
  checkInAttendee: (attendeeId: string) => Promise<boolean>;
  applyForJob: (jobId: string, applicationData: any) => Promise<boolean>;
  syncData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    events: [],
    attendees: [],
    userTickets: [],
    teamMembers: [],
    jobPostings: [],
    analytics: null,
    isOnline: true,
    lastSync: null,
  });

  // Initialize data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const [events, userTickets, teamMembers, jobPostings, analytics, lastSync] = await Promise.all([
        MockApi.getEvents(),
        MockApi.getUserTickets(),
        MockApi.getTeamMembers(),
        MockApi.getJobPostings(),
        MockApi.getAnalytics(),
        MockApi.getLastSyncTime(),
      ]);

      setState(prev => ({
        ...prev,
        events,
        userTickets,
        teamMembers,
        jobPostings,
        analytics,
        lastSync,
      }));
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  const refreshEvents = async () => {
    try {
      const events = await MockApi.getEvents();
      setState(prev => ({ ...prev, events }));
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  };

  const refreshAttendees = async (eventId?: string) => {
    try {
      const attendees = await MockApi.getAttendees(eventId);
      setState(prev => ({ ...prev, attendees }));
    } catch (error) {
      console.error('Error refreshing attendees:', error);
    }
  };

  const refreshUserTickets = async () => {
    try {
      const userTickets = await MockApi.getUserTickets();
      setState(prev => ({ ...prev, userTickets }));
    } catch (error) {
      console.error('Error refreshing user tickets:', error);
    }
  };

  const refreshTeam = async () => {
    try {
      const teamMembers = await MockApi.getTeamMembers();
      setState(prev => ({ ...prev, teamMembers }));
    } catch (error) {
      console.error('Error refreshing team:', error);
    }
  };

  const refreshJobs = async () => {
    try {
      const jobPostings = await MockApi.getJobPostings();
      setState(prev => ({ ...prev, jobPostings }));
    } catch (error) {
      console.error('Error refreshing jobs:', error);
    }
  };

  const refreshAnalytics = async () => {
    try {
      const analytics = await MockApi.getAnalytics();
      setState(prev => ({ ...prev, analytics }));
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    }
  };

  const purchaseTicket = async (eventId: string, ticketTypeId: string, attendeeInfo: any) => {
    const ticket = await MockApi.purchaseTicket(eventId, ticketTypeId, attendeeInfo);
    await refreshUserTickets();
    await refreshEvents(); // Update sold count
    return ticket;
  };

  const checkInAttendee = async (attendeeId: string) => {
    const success = await MockApi.checkInAttendee(attendeeId);
    if (success) {
      await refreshAttendees();
    }
    return success;
  };

  const applyForJob = async (jobId: string, applicationData: any) => {
    return await MockApi.applyForJob(jobId, applicationData);
  };

  const syncData = async () => {
    try {
      const success = await MockApi.syncData();
      if (success) {
        const lastSync = await MockApi.getLastSyncTime();
        setState(prev => ({ ...prev, lastSync }));
        await initializeApp(); // Refresh all data
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  const contextValue: AppContextType = {
    state,
    refreshEvents,
    refreshAttendees,
    refreshUserTickets,
    refreshTeam,
    refreshJobs,
    refreshAnalytics,
    purchaseTicket,
    checkInAttendee,
    applyForJob,
    syncData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Combined Context Provider
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <LoadingProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </LoadingProvider>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
