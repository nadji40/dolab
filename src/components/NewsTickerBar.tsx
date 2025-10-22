import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { darkColors, lightColors } from '../theme';
import { useTheme, useLanguage, useSidebar } from '../contexts/AppContext';
import { HelpIcon, MenuIcon } from './Icons';
import { TechnicalDocumentationModal } from './TechnicalDocumentationModal';

const newsItems = {
  ar: [
    "🎯 مؤتمر رؤية السعودية 2030 يحقق نجاحاً باهراً بحضور 2000 مشارك",
    "🏛️ وزارة الثقافة تعلن عن إطلاق 15 فعالية ثقافية جديدة هذا الشهر",
    "🚀 قمة نيوم للتكنولوجيا تستقطب أكثر من 1500 خبير تقني عالمي",
    "📈 نمو قطاع الفعاليات السعودي بنسبة 25% مقارنة بالعام الماضي",
    "🎪 مهرجان الجنادرية يسجل أعلى معدل حضور في تاريخه",
    "💼 ملتقى ريادة الأعمال يحقق صفقات استثمارية بقيمة 500 مليون ريال",
    "📚 معرض الكتاب الدولي يستقبل أكثر من 10 آلاف زائر يومياً",
    "🎨 فعاليات موسم الرياض تحقق إقبالاً جماهيرياً كبيراً",
    "🏆 المملكة تحتل المرتبة الأولى خليجياً في تنظيم المؤتمرات الدولية",
    "🌟 إطلاق منصة دولاب المبدعين لإدارة الفعاليات بتقنيات متطورة"
  ],
  en: [
    "🎯 Saudi Vision 2030 Conference achieves remarkable success with 2000 participants",
    "🏛️ Ministry of Culture announces launch of 15 new cultural events this month",
    "🚀 NEOM Technology Summit attracts over 1500 global tech experts",
    "📈 Saudi events sector grows 25% compared to last year",
    "🎪 Janadriyah Festival records highest attendance in its history",
    "💼 Entrepreneurship Forum achieves investment deals worth 500 million SAR",
    "📚 International Book Fair receives over 10,000 visitors daily",
    "🎨 Riyadh Season events achieve massive public turnout",
    "🏆 Kingdom ranks first in the Gulf for organizing international conferences",
    "🌟 Launch of Dolab Al-Mubdi'een platform for event management with advanced technologies"
  ]
};

export const NewsTickerBar = () => {
  const { isDark } = useTheme();
  const { language, isRTL } = useLanguage();
  const { toggleSidebar } = useSidebar();
  const colors = isDark ? darkColors : lightColors;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDocumentation, setShowDocumentation] = useState(false);
  
  const currentNewsItems = newsItems[language];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentNewsItems.length);
    }, 6000); // Change news every 6 seconds for better readability

    return () => clearInterval(interval);
  }, [currentNewsItems.length]);

  return (
    <View style={{ position: 'relative' as any }}>
      <View style={{
        backgroundColor: isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(248, 249, 250, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        padding: 12,
        overflow: 'hidden' as any,
        position: 'relative' as any,
      }}>
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: 16,
        }}>
          {/* Mobile menu button */}
          <TouchableOpacity
            onPress={toggleSidebar}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              display: 'none'
            }}
            className="mobile-block"
          >
            <MenuIcon size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={{
            flex: 1,
            overflow: 'hidden' as any,
            height: 20,
            position: 'relative' as any,
          }}>
            <View style={{
              position: 'absolute' as any,
              top: 0,
              left: isRTL ? 'auto' : 0,
              right: isRTL ? 0 : 'auto',
              animation: isRTL ? 'slideLeftToRight 25s linear infinite' : 'slideRightToLeft 25s linear infinite',
            }}>
              <Text style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontFamily: language === 'ar' ? 'Cairo' : 'Playfair Display',
                fontWeight: '500',
                whiteSpace: 'nowrap' as any,
                direction: isRTL ? 'rtl' : 'ltr',
              }}>
                {currentNewsItems.join(' • ')}
              </Text>
            </View>
          </View>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <View style={{
              flexDirection: 'row',
              gap: 4,
            }} className="mobile-hidden">
              {currentNewsItems.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: index === currentIndex 
                      ? colors.accentGold 
                      : colors.textMuted,
                    opacity: index === currentIndex ? 1 : 0.3,
                  }}
                />
              ))}
            </View>
            
            <TouchableOpacity
              onPress={() => setShowDocumentation(!showDocumentation)}
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <HelpIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TechnicalDocumentationModal 
        isVisible={showDocumentation} 
        onClose={() => setShowDocumentation(false)} 
      />
    </View>
  );
};
