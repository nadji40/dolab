import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { darkColors, lightColors } from './theme';
import { MetricCard } from './components/MetricCard';
import { Section } from './components/Section';
import { ChartCard } from './components/ChartCard';
import { Sidebar } from './components/Sidebar';
import { NewsTickerBar } from './components/NewsTickerBar';
import { AppProviders, useTheme, useLanguage, useSidebar, useLoading } from './contexts/AppContext';
import { SkeletonChart, SkeletonMetric, SkeletonList } from './components/SkeletonLoader';
import { saudiEvents, eventAnalytics } from './data/saudiEvents';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Event registration trends data
const registrationTrends = [
  { month: 'يناير', registrations: 320, revenue: 450000, events: 12 },
  { month: 'فبراير', registrations: 280, revenue: 380000, events: 10 },
  { month: 'مارس', registrations: 450, revenue: 620000, events: 15 },
  { month: 'أبريل', registrations: 380, revenue: 520000, events: 13 },
  { month: 'مايو', registrations: 520, revenue: 720000, events: 18 },
  { month: 'يونيو', registrations: 410, revenue: 580000, events: 14 },
  { month: 'يوليو', registrations: 480, revenue: 650000, events: 16 },
  { month: 'أغسطس', registrations: 350, revenue: 480000, events: 12 },
  { month: 'سبتمبر', registrations: 420, revenue: 590000, events: 15 },
  { month: 'أكتوبر', registrations: 550, revenue: 780000, events: 19 },
  { month: 'نوفمبر', registrations: 680, revenue: 920000, events: 22 },
  { month: 'ديسمبر', registrations: 490, revenue: 680000, events: 17 },
];

// Event categories distribution
const eventCategories = [
  { name: 'أعمال', nameEn: 'Business', value: 35, color: '#d29d59' },
  { name: 'ثقافي', nameEn: 'Cultural', value: 25, color: '#2d4054' },
  { name: 'تعليمي', nameEn: 'Educational', value: 20, color: '#4a9eff' },
  { name: 'حكومي', nameEn: 'Government', value: 15, color: '#00d4aa' },
  { name: 'ترفيهي', nameEn: 'Entertainment', value: 5, color: '#8b5cf6' },
];

// Attendance by city
const attendanceByCity = [
  { name: 'الرياض', nameEn: 'Riyadh', value: 45 },
  { name: 'جدة', nameEn: 'Jeddah', value: 25 },
  { name: 'الدمام', nameEn: 'Dammam', value: 15 },
  { name: 'مكة', nameEn: 'Makkah', value: 10 },
  { name: 'أخرى', nameEn: 'Others', value: 5 },
];

function Dashboard() {
  const { isDark } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const { isCollapsed } = useSidebar();
  const { isLoading } = useLoading();
  const colors = isDark ? darkColors : lightColors;

  // Apply theme class to body for scrollbar styling
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = isDark ? '' : 'light-theme';
    }
  }, [isDark]);

  const COLORS = [colors.chartColors.gold, colors.chartColors.navy, colors.chartColors.blue, colors.chartColors.green, colors.chartColors.purple];

  // Recent registrations
  const recentRegistrations = [
    { 
      name: language === 'ar' ? 'مؤتمر رؤية السعودية 2030' : 'Saudi Vision 2030 Conference', 
      change: '+125', 
      color: colors.success 
    },
    { 
      name: language === 'ar' ? 'قمة نيوم للتكنولوجيا' : 'NEOM Technology Summit', 
      change: '+89', 
      color: colors.success 
    },
    { 
      name: language === 'ar' ? 'ملتقى ريادة الأعمال' : 'Entrepreneurship Forum', 
      change: '+67', 
      color: colors.success 
    },
  ];

  // Top performing events
  const topEvents = [
    { 
      name: language === 'ar' ? 'مهرجان الجنادرية الثقافي' : 'Janadriyah Cultural Festival', 
      performance: '84%', 
      positive: true 
    },
    { 
      name: language === 'ar' ? 'معرض الكتاب الدولي' : 'International Book Fair', 
      performance: '85%', 
      positive: true 
    },
  ];

  if (isLoading) {
    return (
      <View style={{ backgroundColor: colors.background, minHeight: '100vh', flexDirection: 'column' }}>
        <NewsTickerBar />
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Sidebar />
          <View style={{ 
            flex: 1, 
            marginLeft: isCollapsed ? 80 : 280,
            padding: 20,
            height: 'calc(100vh - 49px)',
            overflow: 'auto' as any
          }}>
            <View style={{ gap: 20 }}>
              <SkeletonChart />
              <View style={{ flexDirection: 'row', gap: 24 }}>
                <View style={{ flex: 2, gap: 20 }}>
                  <SkeletonChart />
                  <View style={{ flexDirection: 'row', gap: 20, minHeight: 320 }}>
                    <SkeletonChart />
                    <SkeletonChart />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1, gap: 16 }}>
                      <SkeletonMetric />
                      <SkeletonMetric />
                      <SkeletonMetric />
                    </View>
                    <View style={{ flex: 1, gap: 16 }}>
                      <SkeletonMetric />
                      <SkeletonMetric />
                      <SkeletonMetric />
                    </View>
                    <SkeletonChart />
                  </View>
                </View>
                <View style={{ flex: 1, gap: 20 }}>
                  <SkeletonList items={3} />
                  <SkeletonList items={2} />
                  <SkeletonList items={3} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.background, minHeight: '100vh', flexDirection: 'column' }}>
      <NewsTickerBar />
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Sidebar />
        <View style={{ 
          flex: 1, 
          marginLeft: isRTL ? 0 : (isCollapsed ? 80 : 280),
          marginRight: isRTL ? (isCollapsed ? 80 : 280) : 0,
          padding: 20,
          height: 'calc(100vh - 49px)',
          overflow: 'auto' as any
        }} className="mobile-full-width mobile-padding">
          <ScrollView style={{ flex: 1, height: '100%' }} contentContainerStyle={{ gap: 20 }}>
          {/* Header */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 20,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <View style={{ 
              flexDirection: isRTL ? 'row-reverse' : 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 16 }}>
                <img 
                  src="https://eventdolab.com/assets/images/logo_maharat.png" 
                  alt="دولاب المبدعين" 
                  style={{ 
                    width: 48, 
                    height: 48, 
                    filter: isDark ? 'brightness(1)' : 'brightness(0.8)' 
                  }} 
                />
                <View>
                  <Text style={{ 
                    color: colors.textPrimary, 
                    fontSize: 28, 
                    fontWeight: '800', 
                    fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}>
                    {t('system_name')}
                  </Text>
                  <Text style={{ 
                    color: colors.textSecondary, 
                    fontSize: 14, 
                    fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}>
                    {language === 'ar' ? 'نظام إدارة الفعاليات والمؤتمرات' : 'Event & Conference Management System'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 20, 
                  backgroundColor: colors.accentGold, 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Text style={{ 
                    color: colors.background, 
                    fontSize: 16, 
                    fontWeight: '700', 
                    fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display' 
                  }}>
                    {language === 'ar' ? 'أ.م' : 'AM'}
                  </Text>
                </View>
                <View style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                  <Text style={{ 
                    color: colors.textPrimary, 
                    fontSize: 14, 
                    fontWeight: '600', 
                    fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display' 
                  }}>
                    {language === 'ar' ? 'أحمد محمد العلي' : 'Ahmed Mohammed Al-Ali'}
                  </Text>
                  <Text style={{ 
                    color: colors.textSecondary, 
                    fontSize: 12, 
                    fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display' 
                  }}>
                    {language === 'ar' ? 'مدير الفعاليات' : 'Event Manager'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Event Analytics Dashboard */}
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 24 }} className="mobile-stack">
            <View style={{ flex: 2, gap: 20 }}>
              <Section 
                title={language === 'ar' ? `إجمالي الإيرادات: ${(eventAnalytics.totalRevenue / 1000000).toFixed(1)} مليون ريال` : `Total Revenue: ${(eventAnalytics.totalRevenue / 1000000).toFixed(1)}M SAR`} 
                right={
                  <Text style={{ 
                    color: colors.accentGold, 
                    fontSize: 16, 
                    fontWeight: '600', 
                    fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}>
                    {language === 'ar' ? `+${eventAnalytics.totalAttendees.toLocaleString()} مشارك هذا الشهر` : `+${eventAnalytics.totalAttendees.toLocaleString()} Attendees This Month`}
                  </Text>
                }
              >
                <ChartCard>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={registrationTrends} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                      <XAxis 
                        dataKey="month" 
                        stroke={colors.muted} 
                        tick={{ 
                          fill: colors.textSecondary, 
                          fontSize: 12,
                          fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display'
                        }} 
                      />
                      <YAxis stroke={colors.muted} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: colors.surfaceCard, 
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                          fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display'
                        }} 
                        labelStyle={{ color: colors.textPrimary, fontWeight: '600' }}
                        itemStyle={{ color: colors.textSecondary }}
                      />
                      <Legend wrapperStyle={{ color: colors.textSecondary }} />
                      <Line 
                        type="monotone" 
                        dataKey="registrations" 
                        stroke={colors.chartColors.gold} 
                        dot={false} 
                        strokeWidth={3} 
                        name={language === 'ar' ? 'التسجيلات' : 'Registrations'} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="events" 
                        stroke={colors.chartColors.navy} 
                        dot={false} 
                        strokeWidth={3} 
                        name={language === 'ar' ? 'الفعاليات' : 'Events'} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 20 }} className="mobile-stack">
                  <ChartCard title={language === 'ar' ? 'فئات الفعاليات' : 'Event Categories'}>
                    <ResponsiveContainer width="100%" height={260} className="mobile-chart-height">
                      <PieChart>
                        <Pie 
                          dataKey="value" 
                          data={eventCategories} 
                          cx="50%" 
                          cy="50%" 
                          outerRadius={80} 
                          label={({ value }) => `${value}%`}
                          labelStyle={{ 
                            fontSize: '12px', 
                            fill: colors.textPrimary, 
                            fontWeight: '600',
                            fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display'
                          }}
                        >
                          {eventCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: colors.surfaceCard, 
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display'
                          }}
                          labelStyle={{ color: colors.textPrimary }}
                          formatter={(value, name) => [
                            `${value}%`, 
                            language === 'ar' ? eventCategories.find(c => c.nameEn === name)?.name : name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                  <ChartCard title={language === 'ar' ? 'الحضور حسب المدينة' : 'Attendance by City'}>
                    <ResponsiveContainer width="100%" height={260} className="mobile-chart-height">
                      <PieChart>
                        <Pie 
                          dataKey="value" 
                          data={attendanceByCity} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={50} 
                          outerRadius={90} 
                          label={({ value }) => `${value}%`}
                          labelStyle={{ 
                            fontSize: '14px', 
                            fill: colors.textPrimary, 
                            fontWeight: '600',
                            fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display'
                          }}
                        >
                          {attendanceByCity.map((entry, index) => (
                            <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: colors.surfaceCard, 
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display'
                          }}
                          labelStyle={{ color: colors.textPrimary }}
                          formatter={(value, name) => [
                            `${value}%`, 
                            language === 'ar' ? attendanceByCity.find(c => c.nameEn === name)?.name : name
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </View>

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 16 }} className="mobile-stack">
                  <View style={{ flex: 1, gap: 16 }}>
                    <MetricCard 
                      label={language === 'ar' ? 'إجمالي الفعاليات' : 'Total Events'} 
                      value={eventAnalytics.totalEvents.toString()} 
                    />
                    <MetricCard 
                      label={language === 'ar' ? 'الفعاليات النشطة' : 'Active Events'} 
                      value={eventAnalytics.activeEvents.toString()} 
                      tone="positive"
                    />
                    <MetricCard 
                      label={language === 'ar' ? 'معدل الحضور' : 'Attendance Rate'} 
                      value={`${eventAnalytics.averageAttendanceRate.toFixed(1)}%`} 
                      tone="positive"
                    />
                  </View>
                  <View style={{ flex: 1, gap: 16 }}>
                    <MetricCard 
                      label={language === 'ar' ? 'إجمالي المشاركين' : 'Total Attendees'} 
                      value={eventAnalytics.totalAttendees.toLocaleString()} 
                    />
                    <MetricCard 
                      label={language === 'ar' ? 'الفعاليات القادمة' : 'Upcoming Events'} 
                      value={eventAnalytics.upcomingEvents.toString()} 
                      tone="neutral"
                    />
                    <MetricCard 
                      label={language === 'ar' ? 'الإيرادات (مليون ريال)' : 'Revenue (M SAR)'} 
                      value={(eventAnalytics.totalRevenue / 1000000).toFixed(1)} 
                      tone="positive"
                    />
                  </View>
                  <ChartCard title={language === 'ar' ? 'أداء الفعاليات الشهري' : 'Monthly Event Performance'}>
                    <ResponsiveContainer width="100%" height={260} className="mobile-chart-height">
                      <PieChart>
                        <Pie 
                          dataKey="value" 
                          data={[
                            { name: language === 'ar' ? 'مكتملة' : 'Completed', value: eventAnalytics.completedEvents || 8 },
                            { name: language === 'ar' ? 'نشطة' : 'Active', value: eventAnalytics.activeEvents },
                            { name: language === 'ar' ? 'قادمة' : 'Upcoming', value: eventAnalytics.upcomingEvents }
                          ]} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={50} 
                          outerRadius={90} 
                          label={({ value }) => `${value}`}
                          labelStyle={{ 
                            fontSize: '14px', 
                            fill: colors.textPrimary, 
                            fontWeight: '600',
                            fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display'
                          }}
                        >
                          {[0, 1, 2].map((index) => (
                            <Cell key={`c-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: colors.surfaceCard, 
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                            fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display'
                          }}
                          labelStyle={{ color: colors.textPrimary }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </View>
              </Section>
            </View>

            {/* Right sidebar */}
            <View style={{ flex: 1, gap: 20 }}>
              <Section title={language === 'ar' ? 'الفعاليات القادمة' : 'Upcoming Events'}>
                <View style={{ gap: 12 }}>
                  {saudiEvents.filter(e => e.status === 'upcoming').slice(0, 3).map((event) => (
                    <View
                      key={event.id}
                      style={{
                        backgroundColor: colors.surfaceCard,
                        borderColor: colors.border,
                        borderWidth: 1,
                        borderRadius: 16,
                        padding: 16,
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                    >
                      <View style={{ 
                        flexDirection: isRTL ? 'row-reverse' : 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: 8
                      }}>
                        <Text style={{ 
                          color: colors.textPrimary, 
                          fontWeight: '600',
                          fontSize: 14,
                          fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
                          direction: isRTL ? 'rtl' : 'ltr',
                          flex: 1
                        }}>
                          {language === 'ar' ? event.name.ar : event.name.en}
                        </Text>
                        <Text style={{ 
                          color: colors.accentGold, 
                          fontWeight: '700', 
                          fontSize: 12,
                          fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display' 
                        }}>
                          {new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </Text>
                      </View>
                      <Text style={{ 
                        color: colors.textSecondary, 
                        fontSize: 12,
                        fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
                        direction: isRTL ? 'rtl' : 'ltr'
                      }}>
                        {language === 'ar' ? event.venue.ar : event.venue.en}
                      </Text>
                      <View style={{ 
                        flexDirection: isRTL ? 'row-reverse' : 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginTop: 8
                      }}>
                        <Text style={{ 
                          color: colors.textMuted, 
                          fontSize: 11,
                          fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display' 
                        }}>
                          {language === 'ar' ? `${event.ticketsSold}/${event.capacity} مشارك` : `${event.ticketsSold}/${event.capacity} attendees`}
                        </Text>
                        <Text style={{ 
                          color: colors.success, 
                          fontWeight: '600', 
                          fontSize: 11,
                          fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display' 
                        }}>
                          {((event.ticketsSold / event.capacity) * 100).toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Section>

              <Section title={language === 'ar' ? 'أفضل الفعاليات أداءً' : 'Top Performing Events'}>
                <View style={{ gap: 12 }}>
                  {topEvents.map((row) => (
                    <View
                      key={row.name}
                      style={{
                        backgroundColor: colors.surfaceCard,
                        borderColor: colors.border,
                        borderWidth: 1,
                        borderRadius: 16,
                        padding: 16,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                    >
                      <Text style={{ 
                        color: colors.textPrimary, 
                        fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
                        direction: isRTL ? 'rtl' : 'ltr',
                        flex: 1,
                        fontSize: 13
                      }}>
                        {row.name}
                      </Text>
                      <Text style={{ 
                        color: row.positive ? colors.success : colors.danger, 
                        fontWeight: '700', 
                        fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display' 
                      }}>
                        {row.performance}
                      </Text>
                    </View>
                  ))}
                </View>
              </Section>

              <Section title={language === 'ar' ? 'التسجيلات الحديثة' : 'Recent Registrations'}>
                <View style={{ gap: 12 }}>
                  {recentRegistrations.map((row) => (
                    <View
                      key={row.name}
                      style={{
                        backgroundColor: colors.surfaceCard,
                        borderColor: colors.border,
                        borderWidth: 1,
                        borderRadius: 16,
                        padding: 16,
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                    >
                      <Text style={{ 
                        color: colors.textPrimary, 
                        fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
                        direction: isRTL ? 'rtl' : 'ltr',
                        flex: 1,
                        fontSize: 13
                      }}>
                        {row.name}
                      </Text>
                      <Text style={{ 
                        color: row.color, 
                        fontWeight: '700', 
                        fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display' 
                      }}>
                        {row.change}
                      </Text>
                    </View>
                  ))}
                </View>
              </Section>
            </View>
          </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export function App() {
  return (
    <AppProviders>
      <Dashboard />
    </AppProviders>
  );
}