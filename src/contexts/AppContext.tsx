import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Combined Context Provider
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
