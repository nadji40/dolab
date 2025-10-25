import AsyncStorage from '@react-native-async-storage/async-storage';
import { saudiEvents, sampleAttendees, eventAnalytics, Organizer, OrganizerPost } from '../data/saudiEvents';
import eventsData from '../data/events.json';

// Types
export interface Event {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  date: string;
  time: string;
  venue: { ar: string; en: string };
  location: {
    city: { ar: string; en: string };
    address: { ar: string; en: string };
  };
  category: 'business' | 'cultural' | 'educational' | 'government' | 'entertainment';
  capacity: number;
  ticketsSold: number;
  revenue: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  image: string;
  organizer: {
    id: string;
    name: { ar: string; en: string };
    type: 'company' | 'government' | 'university' | 'individual';
    bio?: { ar: string; en: string };
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
    address?: { ar: string; en: string };
    establishedYear?: number;
    teamSize?: number;
    specialties?: { ar: string[]; en: string[] };
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
  name: { ar: string; en: string };
  price: number;
  available: number;
  sold: number;
  features: { ar: string[]; en: string[] };
}

export interface Attendee {
  id: string;
  name: { ar: string; en: string };
  email: string;
  phone: string;
  company?: { ar: string; en: string };
  position?: { ar: string; en: string };
  ticketType: string;
  eventId: string;
  registrationDate: string;
  checkInStatus: 'pending' | 'checked-in' | 'no-show';
  checkInTime?: string;
}

export interface PurchasedTicket {
  id: string;
  eventId: string;
  ticketTypeId: string;
  purchaseDate: string;
  qrCode: string;
  status: 'active' | 'used' | 'cancelled';
  attendeeInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface TeamMember {
  id: string;
  name: { ar: string; en: string };
  email: string;
  role: { ar: string; en: string };
  permissions: string[];
  avatar?: string;
  isActive: boolean;
}

export interface JobPosting {
  id: string;
  title: { ar: string; en: string };
  department: { ar: string; en: string };
  location: { ar: string; en: string };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: { ar: string; en: string };
  requirements: { ar: string[]; en: string[] };
  benefits: { ar: string[]; en: string[] };
  salary?: { min: number; max: number; currency: string };
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  organizer: {
    id: string;
    name: { ar: string; en: string };
    type: 'company' | 'government' | 'university' | 'individual';
    logo?: string;
    website?: string;
  };
}

// Simulate network latency
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Storage keys
const STORAGE_KEYS = {
  EVENTS: 'events_cache',
  ATTENDEES: 'attendees_cache',
  TICKETS: 'tickets_cache',
  TEAM: 'team_cache',
  JOBS: 'jobs_cache',
  ANALYTICS: 'analytics_cache',
  USER_SETTINGS: 'user_settings',
  LAST_SYNC: 'last_sync'
};

// Mock API class
export class MockApi {
  // Events API
  static async getEvents(): Promise<Event[]> {
    await delay();
    
    try {
      // Try to get from cache first
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Fallback to static data
      const events = [...saudiEvents, ...eventsData];
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return saudiEvents;
    }
  }

  static async getEvent(id: string): Promise<Event | null> {
    await delay();
    const events = await this.getEvents();
    return events.find(event => event.id === id) || null;
  }

  static async searchEvents(query: string, category?: string): Promise<Event[]> {
    await delay();
    const events = await this.getEvents();
    
    return events.filter(event => {
      const matchesQuery = !query || 
        event.name.en.toLowerCase().includes(query.toLowerCase()) ||
        event.name.ar.includes(query) ||
        event.description.en.toLowerCase().includes(query.toLowerCase()) ||
        event.description.ar.includes(query);
      
      const matchesCategory = !category || event.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  // Attendees API
  static async getAttendees(eventId?: string): Promise<Attendee[]> {
    await delay();
    
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.ATTENDEES);
      let attendees = cached ? JSON.parse(cached) : sampleAttendees;
      
      if (eventId) {
        attendees = attendees.filter((attendee: Attendee) => attendee.eventId === eventId);
      }
      
      return attendees;
    } catch (error) {
      console.error('Error fetching attendees:', error);
      return sampleAttendees;
    }
  }

  static async checkInAttendee(attendeeId: string): Promise<boolean> {
    await delay();
    
    try {
      const attendees = await this.getAttendees();
      const attendeeIndex = attendees.findIndex(a => a.id === attendeeId);
      
      if (attendeeIndex !== -1) {
        attendees[attendeeIndex].checkInStatus = 'checked-in';
        attendees[attendeeIndex].checkInTime = new Date().toISOString();
        await AsyncStorage.setItem(STORAGE_KEYS.ATTENDEES, JSON.stringify(attendees));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking in attendee:', error);
      return false;
    }
  }

  // Tickets API
  static async purchaseTicket(eventId: string, ticketTypeId: string, attendeeInfo: any): Promise<PurchasedTicket> {
    await delay(1000); // Simulate payment processing
    
    // Simulate random success/failure
    if (Math.random() < 0.1) {
      throw new Error('Payment failed. Please try again.');
    }
    
    const ticket: PurchasedTicket = {
      id: `ticket-${Date.now()}`,
      eventId,
      ticketTypeId,
      purchaseDate: new Date().toISOString(),
      qrCode: `QR-${eventId}-${ticketTypeId}-${Date.now()}`,
      status: 'active',
      attendeeInfo
    };
    
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.TICKETS);
      const tickets = cached ? JSON.parse(cached) : [];
      tickets.push(ticket);
      await AsyncStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving ticket:', error);
    }
    
    return ticket;
  }

  static async getUserTickets(): Promise<PurchasedTicket[]> {
    await delay();
    
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.TICKETS);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      return [];
    }
  }

  // Team API
  static async getTeamMembers(): Promise<TeamMember[]> {
    await delay();
    
    const mockTeam: TeamMember[] = [
      {
        id: 'team-001',
        name: { ar: 'أحمد محمد العلي', en: 'Ahmed Mohammed Al-Ali' },
        email: 'ahmed@eventdolab.com',
        role: { ar: 'مدير الفعاليات', en: 'Events Manager' },
        permissions: ['events.create', 'events.edit', 'attendees.view'],
        isActive: true
      },
      {
        id: 'team-002',
        name: { ar: 'فاطمة سالم النحاس', en: 'Fatima Salem Al-Nahhas' },
        email: 'fatima@eventdolab.com',
        role: { ar: 'منسقة التسويق', en: 'Marketing Coordinator' },
        permissions: ['events.view', 'marketing.manage'],
        isActive: true
      },
      {
        id: 'team-003',
        name: { ar: 'خالد عبدالله الشمري', en: 'Khalid Abdullah Al-Shammari' },
        email: 'khalid@eventdolab.com',
        role: { ar: 'مطور تطبيقات', en: 'App Developer' },
        permissions: ['system.admin', 'events.create', 'events.edit'],
        isActive: true
      }
    ];
    
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.TEAM);
      return cached ? JSON.parse(cached) : mockTeam;
    } catch (error) {
      console.error('Error fetching team:', error);
      return mockTeam;
    }
  }

  // Organizer API
  static async getOrganizer(organizerId: string): Promise<Organizer | null> {
    await delay();
    
    // Find organizer from events data
    const event = saudiEvents.find(e => e.organizer.id === organizerId);
    if (event) {
      return {
        id: event.organizer.id,
        name: event.organizer.name,
        type: event.organizer.type,
        bio: event.organizer.bio,
        logo: event.organizer.logo,
        website: event.organizer.website,
        email: event.organizer.email,
        phone: event.organizer.phone,
        socialLinks: event.organizer.socialLinks,
        address: event.organizer.address,
        establishedYear: event.organizer.establishedYear,
        teamSize: event.organizer.teamSize,
        specialties: event.organizer.specialties,
        stats: event.organizer.stats,
        posts: event.organizer.posts,
      };
    }
    
    return null;
  }

  static async getOrganizerEvents(organizerId: string): Promise<Event[]> {
    await delay();
    return saudiEvents.filter(event => event.organizer.id === organizerId);
  }

  // Jobs/HR API
  static async getJobPostings(): Promise<JobPosting[]> {
    await delay();
    
    const mockJobs: JobPosting[] = [
      {
        id: 'job-001',
        title: { ar: 'مطور تطبيقات الجوال', en: 'Mobile App Developer' },
        department: { ar: 'التكنولوجيا', en: 'Technology' },
        location: { ar: 'الرياض، السعودية', en: 'Riyadh, Saudi Arabia' },
        type: 'full-time',
        description: {
          ar: 'نبحث عن مطور تطبيقات جوال متمرس للانضمام إلى فريقنا المتنامي',
          en: 'We are looking for an experienced mobile app developer to join our growing team'
        },
        requirements: {
          ar: ['خبرة 3+ سنوات في React Native', 'معرفة بـ TypeScript', 'خبرة في تطبيقات الأحداث'],
          en: ['3+ years React Native experience', 'TypeScript knowledge', 'Event app experience']
        },
        benefits: {
          ar: ['راتب تنافسي', 'تأمين صحي', 'إجازات مرنة', 'فرص تطوير مهني'],
          en: ['Competitive salary', 'Health insurance', 'Flexible vacation', 'Professional development']
        },
        salary: { min: 8000, max: 15000, currency: 'SAR' },
        postedDate: '2024-10-15',
        deadline: '2024-12-15',
        status: 'active',
        organizer: {
          id: 'org-tech-001',
          name: { ar: 'شركة التقنيات المتقدمة', en: 'Advanced Tech Solutions' },
          type: 'company',
          logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
          website: 'https://advancedtech.sa'
        }
      },
      {
        id: 'job-002',
        title: { ar: 'مصمم تجربة المستخدم', en: 'UX/UI Designer' },
        department: { ar: 'التصميم', en: 'Design' },
        location: { ar: 'الرياض، السعودية', en: 'Riyadh, Saudi Arabia' },
        type: 'full-time',
        description: {
          ar: 'مصمم إبداعي لتطوير واجهات مستخدم جذابة وسهلة الاستخدام',
          en: 'Creative designer to develop attractive and user-friendly interfaces'
        },
        requirements: {
          ar: ['خبرة في Figma و Adobe Creative Suite', 'فهم مبادئ UX/UI', 'محفظة أعمال قوية'],
          en: ['Experience with Figma & Adobe Creative Suite', 'Understanding of UX/UI principles', 'Strong portfolio']
        },
        benefits: {
          ar: ['بيئة عمل إبداعية', 'أدوات تصميم حديثة', 'فرص التعلم المستمر'],
          en: ['Creative work environment', 'Modern design tools', 'Continuous learning opportunities']
        },
        salary: { min: 6000, max: 12000, currency: 'SAR' },
        postedDate: '2024-10-20',
        deadline: '2024-12-20',
        status: 'active'
      }
    ];
    
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.JOBS);
      return cached ? JSON.parse(cached) : mockJobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return mockJobs;
    }
  }

  static async applyForJob(jobId: string, applicationData: any): Promise<boolean> {
    await delay(1000);
    
    // Simulate application submission
    console.log('Job application submitted:', { jobId, applicationData });
    return Math.random() > 0.1; // 90% success rate
  }

  // Analytics API
  static async getAnalytics(): Promise<any> {
    await delay();
    
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS);
      return cached ? JSON.parse(cached) : eventAnalytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return eventAnalytics;
    }
  }

  // Settings API
  static async getUserSettings(): Promise<any> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return cached ? JSON.parse(cached) : {
        theme: 'dark',
        language: 'ar',
        notifications: true,
        autoSync: true
      };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { theme: 'dark', language: 'ar', notifications: true, autoSync: true };
    }
  }

  static async updateUserSettings(settings: any): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  }

  // Sync API
  static async syncData(): Promise<boolean> {
    await delay(2000);
    
    try {
      // Simulate data sync
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      return false;
    }
  }

  static async getLastSyncTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }
}

export default MockApi;

