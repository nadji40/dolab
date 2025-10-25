// Saudi Event Management Static Data

export interface Event {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  date: string;
  time: string;
  venue: {
    ar: string;
    en: string;
  };
  location: {
    city: {
      ar: string;
      en: string;
    };
    address: {
      ar: string;
      en: string;
    };
  };
  category: 'business' | 'cultural' | 'educational' | 'government' | 'entertainment';
  capacity: number;
  ticketsSold: number;
  revenue: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  image: string;
  organizer: {
    id: string;
    name: {
      ar: string;
      en: string;
    };
    type: 'company' | 'government' | 'university' | 'individual';
    bio?: {
      ar: string;
      en: string;
    };
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      facebook?: string;
    };
    address?: {
      ar: string;
      en: string;
    };
    establishedYear?: number;
    teamSize?: number;
    specialties?: {
      ar: string[];
      en: string[];
    };
    stats?: {
      totalEvents: number;
      totalAttendees: number;
      averageRating: number;
      yearsActive: number;
    };
  };
  tickets: TicketType[];
}

export interface TicketType {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  price: number;
  available: number;
  sold: number;
  features: {
    ar: string[];
    en: string[];
  };
}

export interface Organizer {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  type: 'company' | 'government' | 'university' | 'individual';
  bio?: {
    ar: string;
    en: string;
  };
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  address?: {
    ar: string;
    en: string;
  };
  establishedYear?: number;
  teamSize?: number;
  specialties?: {
    ar: string[];
    en: string[];
  };
  stats?: {
    totalEvents: number;
    totalAttendees: number;
    averageRating: number;
    yearsActive: number;
  };
  posts?: OrganizerPost[];
}

export interface OrganizerPost {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  content: {
    ar: string;
    en: string;
  };
  image?: string;
  publishedDate: string;
  tags?: string[];
}

export interface Attendee {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  email: string;
  phone: string;
  company?: {
    ar: string;
    en: string;
  };
  position?: {
    ar: string;
    en: string;
  };
  ticketType: string;
  eventId: string;
  registrationDate: string;
  checkInStatus: 'pending' | 'checked-in' | 'no-show';
  checkInTime?: string;
}

// Sample Saudi Events Data
export const saudiEvents: Event[] = [
  {
    id: 'evt-001',
    name: {
      ar: 'مؤتمر رؤية السعودية 2030',
      en: 'Saudi Vision 2030 Conference'
    },
    description: {
      ar: 'مؤتمر استراتيجي يناقش مستقبل المملكة العربية السعودية وخطط التنمية المستدامة',
      en: 'Strategic conference discussing the future of Saudi Arabia and sustainable development plans'
    },
    date: '2024-12-15',
    time: '09:00',
    venue: {
      ar: 'مركز الملك عبدالعزيز للمؤتمرات',
      en: 'King Abdulaziz Conference Center'
    },
    location: {
      city: {
        ar: 'الرياض',
        en: 'Riyadh'
      },
      address: {
        ar: 'حي الملز، الرياض 12211',
        en: 'Al Malaz District, Riyadh 12211'
      }
    },
    category: 'business',
    capacity: 2000,
    ticketsSold: 1750,
    revenue: 875000,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    organizer: {
      id: 'org-001',
      name: {
        ar: 'وزارة الاقتصاد والتخطيط',
        en: 'Ministry of Economy and Planning'
      },
      type: 'government',
      bio: {
        ar: 'وزارة الاقتصاد والتخطيط هي الجهة المسؤولة عن وضع السياسات الاقتصادية والتنموية في المملكة العربية السعودية',
        en: 'The Ministry of Economy and Planning is responsible for setting economic and development policies in Saudi Arabia'
      },
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      website: 'https://mep.gov.sa',
      email: 'info@mep.gov.sa',
      phone: '+966-11-4014444',
      socialLinks: {
        twitter: 'https://twitter.com/mep_saudi',
        linkedin: 'https://linkedin.com/company/mep-saudi'
      },
      address: {
        ar: 'الرياض، المملكة العربية السعودية',
        en: 'Riyadh, Saudi Arabia'
      },
      establishedYear: 1975,
      teamSize: 500,
      specialties: {
        ar: ['التخطيط الاقتصادي', 'السياسات التنموية', 'رؤية 2030'],
        en: ['Economic Planning', 'Development Policies', 'Vision 2030']
      },
      stats: {
        totalEvents: 45,
        totalAttendees: 25000,
        averageRating: 4.8,
        yearsActive: 48
      },
      posts: [
        {
          id: 'post-001',
          title: {
            ar: 'إطلاق مبادرة جديدة لدعم الشركات الناشئة',
            en: 'Launching New Initiative to Support Startups'
          },
          content: {
            ar: 'أعلنت وزارة الاقتصاد والتخطيط عن إطلاق مبادرة جديدة لدعم الشركات الناشئة في إطار رؤية 2030',
            en: 'The Ministry of Economy and Planning announced the launch of a new initiative to support startups as part of Vision 2030'
          },
          image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
          publishedDate: '2024-10-20',
          tags: ['startups', 'vision2030', 'economy']
        }
      ]
    },
    tickets: [
      {
        id: 'tkt-001-vip',
        name: {
          ar: 'تذكرة كبار الشخصيات',
          en: 'VIP Ticket'
        },
        price: 1500,
        available: 50,
        sold: 45,
        features: {
          ar: ['مقاعد مميزة', 'وجبة غداء فاخرة', 'لقاء مع المتحدثين', 'هدايا تذكارية'],
          en: ['Premium seating', 'Luxury lunch', 'Meet & greet with speakers', 'Commemorative gifts']
        }
      },
      {
        id: 'tkt-001-regular',
        name: {
          ar: 'تذكرة عادية',
          en: 'Regular Ticket'
        },
        price: 500,
        available: 1500,
        sold: 1200,
        features: {
          ar: ['مقعد عادي', 'استراحة قهوة', 'مواد المؤتمر'],
          en: ['Standard seating', 'Coffee break', 'Conference materials']
        }
      },
      {
        id: 'tkt-001-student',
        name: {
          ar: 'تذكرة طلابية',
          en: 'Student Ticket'
        },
        price: 200,
        available: 450,
        sold: 350,
        features: {
          ar: ['مقعد عادي', 'استراحة قهوة', 'شهادة حضور'],
          en: ['Standard seating', 'Coffee break', 'Attendance certificate']
        }
      }
    ]
  },
  {
    id: 'evt-002',
    name: {
      ar: 'مهرجان الجنادرية الثقافي',
      en: 'Janadriyah Cultural Festival'
    },
    description: {
      ar: 'مهرجان ثقافي سنوي يحتفي بالتراث السعودي والثقافة العربية الأصيلة',
      en: 'Annual cultural festival celebrating Saudi heritage and authentic Arab culture'
    },
    date: '2024-11-20',
    time: '16:00',
    venue: {
      ar: 'قرية الجنادرية التراثية',
      en: 'Janadriyah Heritage Village'
    },
    location: {
      city: {
        ar: 'الرياض',
        en: 'Riyadh'
      },
      address: {
        ar: 'شمال شرق الرياض، طريق الملك خالد',
        en: 'Northeast Riyadh, King Khalid Road'
      }
    },
    category: 'cultural',
    capacity: 5000,
    ticketsSold: 4200,
    revenue: 630000,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    organizer: {
      name: {
        ar: 'وزارة الثقافة',
        en: 'Ministry of Culture'
      },
      type: 'government'
    },
    tickets: [
      {
        id: 'tkt-002-family',
        name: {
          ar: 'تذكرة عائلية',
          en: 'Family Ticket'
        },
        price: 300,
        available: 2000,
        sold: 1800,
        features: {
          ar: ['دخول لـ 4 أشخاص', 'أنشطة للأطفال', 'وجبات تراثية'],
          en: ['Entry for 4 people', 'Children activities', 'Traditional meals']
        }
      },
      {
        id: 'tkt-002-individual',
        name: {
          ar: 'تذكرة فردية',
          en: 'Individual Ticket'
        },
        price: 100,
        available: 3000,
        sold: 2400,
        features: {
          ar: ['دخول فردي', 'جولة إرشادية', 'عروض فولكلورية'],
          en: ['Individual entry', 'Guided tour', 'Folklore shows']
        }
      }
    ]
  },
  {
    id: 'evt-003',
    name: {
      ar: 'قمة نيوم للتكنولوجيا',
      en: 'NEOM Technology Summit'
    },
    description: {
      ar: 'قمة تقنية عالمية تستكشف مستقبل التكنولوجيا والابتكار في مدينة نيوم',
      en: 'Global technology summit exploring the future of technology and innovation in NEOM city'
    },
    date: '2024-12-05',
    time: '10:00',
    venue: {
      ar: 'مركز نيوم للمؤتمرات',
      en: 'NEOM Conference Center'
    },
    location: {
      city: {
        ar: 'نيوم',
        en: 'NEOM'
      },
      address: {
        ar: 'منطقة تبوك، شمال غرب السعودية',
        en: 'Tabuk Province, Northwest Saudi Arabia'
      }
    },
    category: 'business',
    capacity: 1500,
    ticketsSold: 1200,
    revenue: 1800000,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    organizer: {
      name: {
        ar: 'شركة نيوم',
        en: 'NEOM Company'
      },
      type: 'company'
    },
    tickets: [
      {
        id: 'tkt-003-premium',
        name: {
          ar: 'تذكرة بريميوم',
          en: 'Premium Ticket'
        },
        price: 2000,
        available: 300,
        sold: 250,
        features: {
          ar: ['ورش عمل حصرية', 'لقاءات شخصية', 'جولة في نيوم', 'إقامة فندقية'],
          en: ['Exclusive workshops', 'Personal meetings', 'NEOM tour', 'Hotel accommodation']
        }
      },
      {
        id: 'tkt-003-standard',
        name: {
          ar: 'تذكرة قياسية',
          en: 'Standard Ticket'
        },
        price: 1000,
        available: 1200,
        sold: 950,
        features: {
          ar: ['حضور الجلسات الرئيسية', 'معرض التكنولوجيا', 'وجبات خفيفة'],
          en: ['Main sessions access', 'Technology exhibition', 'Light refreshments']
        }
      }
    ]
  },
  {
    id: 'evt-004',
    name: {
      ar: 'ملتقى ريادة الأعمال السعودي',
      en: 'Saudi Entrepreneurship Forum'
    },
    description: {
      ar: 'ملتقى سنوي يجمع رواد الأعمال والمستثمرين لمناقشة فرص الاستثمار والابتكار',
      en: 'Annual forum bringing together entrepreneurs and investors to discuss investment and innovation opportunities'
    },
    date: '2024-11-30',
    time: '08:30',
    venue: {
      ar: 'مركز الرياض الدولي للمؤتمرات والمعارض',
      en: 'Riyadh International Convention & Exhibition Center'
    },
    location: {
      city: {
        ar: 'الرياض',
        en: 'Riyadh'
      },
      address: {
        ar: 'طريق الملك عبدالعزيز، حي المعذر',
        en: 'King Abdulaziz Road, Al Maather District'
      }
    },
    category: 'business',
    capacity: 3000,
    ticketsSold: 2500,
    revenue: 1250000,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    organizer: {
      name: {
        ar: 'الهيئة العامة للمنشآت الصغيرة والمتوسطة',
        en: 'Small and Medium Enterprises General Authority'
      },
      type: 'government'
    },
    tickets: [
      {
        id: 'tkt-004-investor',
        name: {
          ar: 'تذكرة المستثمرين',
          en: 'Investor Ticket'
        },
        price: 800,
        available: 500,
        sold: 400,
        features: {
          ar: ['جلسات حصرية للمستثمرين', 'لقاءات B2B', 'تقارير السوق'],
          en: ['Exclusive investor sessions', 'B2B meetings', 'Market reports']
        }
      },
      {
        id: 'tkt-004-entrepreneur',
        name: {
          ar: 'تذكرة رواد الأعمال',
          en: 'Entrepreneur Ticket'
        },
        price: 400,
        available: 2000,
        sold: 1700,
        features: {
          ar: ['ورش عمل تدريبية', 'جلسات الإرشاد', 'معرض الشركات الناشئة'],
          en: ['Training workshops', 'Mentoring sessions', 'Startup exhibition']
        }
      },
      {
        id: 'tkt-004-student',
        name: {
          ar: 'تذكرة طلابية',
          en: 'Student Ticket'
        },
        price: 150,
        available: 500,
        sold: 400,
        features: {
          ar: ['حضور المحاضرات', 'مسابقات الابتكار', 'شهادة مشاركة'],
          en: ['Lecture attendance', 'Innovation competitions', 'Participation certificate']
        }
      }
    ]
  },
  {
    id: 'evt-005',
    name: {
      ar: 'معرض الكتاب الدولي بالرياض',
      en: 'Riyadh International Book Fair'
    },
    description: {
      ar: 'معرض سنوي للكتب يضم دور نشر عربية وعالمية مع فعاليات ثقافية متنوعة',
      en: 'Annual book fair featuring Arab and international publishers with diverse cultural activities'
    },
    date: '2024-12-10',
    time: '10:00',
    venue: {
      ar: 'مركز الرياض للمعارض',
      en: 'Riyadh Exhibition Center'
    },
    location: {
      city: {
        ar: 'الرياض',
        en: 'Riyadh'
      },
      address: {
        ar: 'طريق خريص، حي المعذر الشمالي',
        en: 'Khurais Road, North Al Maather District'
      }
    },
    category: 'cultural',
    capacity: 10000,
    ticketsSold: 8500,
    revenue: 425000,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    organizer: {
      name: {
        ar: 'وزارة الثقافة',
        en: 'Ministry of Culture'
      },
      type: 'government'
    },
    tickets: [
      {
        id: 'tkt-005-daily',
        name: {
          ar: 'تذكرة يومية',
          en: 'Daily Ticket'
        },
        price: 50,
        available: 8000,
        sold: 6500,
        features: {
          ar: ['دخول ليوم واحد', 'فعاليات ثقافية', 'خصومات على الكتب'],
          en: ['One day entry', 'Cultural activities', 'Book discounts']
        }
      },
      {
        id: 'tkt-005-season',
        name: {
          ar: 'تذكرة موسمية',
          en: 'Season Ticket'
        },
        price: 200,
        available: 2000,
        sold: 1800,
        features: {
          ar: ['دخول لكامل المعرض', 'أمسيات شعرية', 'لقاءات مع المؤلفين', 'خصومات إضافية'],
          en: ['Full fair access', 'Poetry evenings', 'Author meetings', 'Additional discounts']
        }
      },
      {
        id: 'tkt-005-student',
        name: {
          ar: 'تذكرة طلابية',
          en: 'Student Ticket'
        },
        price: 25,
        available: 1000,
        sold: 800,
        features: {
          ar: ['دخول مخفض', 'ورش كتابة', 'مسابقات أدبية'],
          en: ['Discounted entry', 'Writing workshops', 'Literary competitions']
        }
      }
    ]
  }
];

// Sample Attendees Data
export const sampleAttendees: Attendee[] = [
  {
    id: 'att-001',
    name: {
      ar: 'أحمد محمد العلي',
      en: 'Ahmed Mohammed Al-Ali'
    },
    email: 'ahmed.alali@email.com',
    phone: '+966501234567',
    company: {
      ar: 'شركة الرياض للتطوير',
      en: 'Riyadh Development Company'
    },
    position: {
      ar: 'مدير التطوير',
      en: 'Development Manager'
    },
    ticketType: 'tkt-001-vip',
    eventId: 'evt-001',
    registrationDate: '2024-10-15',
    checkInStatus: 'pending'
  },
  {
    id: 'att-002',
    name: {
      ar: 'فاطمة سالم النحاس',
      en: 'Fatima Salem Al-Nahhas'
    },
    email: 'fatima.nahhas@email.com',
    phone: '+966502345678',
    company: {
      ar: 'جامعة الملك سعود',
      en: 'King Saud University'
    },
    position: {
      ar: 'أستاذة مساعدة',
      en: 'Assistant Professor'
    },
    ticketType: 'tkt-001-regular',
    eventId: 'evt-001',
    registrationDate: '2024-10-20',
    checkInStatus: 'pending'
  },
  {
    id: 'att-003',
    name: {
      ar: 'خالد عبدالله الشمري',
      en: 'Khalid Abdullah Al-Shammari'
    },
    email: 'khalid.shammari@email.com',
    phone: '+966503456789',
    ticketType: 'tkt-002-family',
    eventId: 'evt-002',
    registrationDate: '2024-10-25',
    checkInStatus: 'checked-in',
    checkInTime: '2024-11-20T16:30:00Z'
  }
];

// Analytics Data
export const eventAnalytics = {
  totalEvents: saudiEvents.length,
  activeEvents: saudiEvents.filter(e => e.status === 'active').length,
  upcomingEvents: saudiEvents.filter(e => e.status === 'upcoming').length,
  completedEvents: saudiEvents.filter(e => e.status === 'completed').length,
  totalRevenue: saudiEvents.reduce((sum, event) => sum + event.revenue, 0),
  totalAttendees: saudiEvents.reduce((sum, event) => sum + event.ticketsSold, 0),
  averageAttendanceRate: saudiEvents.reduce((sum, event) => sum + (event.ticketsSold / event.capacity), 0) / saudiEvents.length * 100,
  categoryBreakdown: {
    business: saudiEvents.filter(e => e.category === 'business').length,
    cultural: saudiEvents.filter(e => e.category === 'cultural').length,
    educational: saudiEvents.filter(e => e.category === 'educational').length,
    government: saudiEvents.filter(e => e.category === 'government').length,
    entertainment: saudiEvents.filter(e => e.category === 'entertainment').length,
  }
};
