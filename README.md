# Dolab Event Manager - Mobile-First PWA

A comprehensive event management system built with React Native Web, designed for Saudi Arabia with full Arabic/English support and modern glass morphism UI.

## 🚀 Features

### Core Functionality
- **📱 Mobile-First PWA** - Optimized for mobile devices with offline support
- **🌐 Bilingual Support** - Arabic (RTL) and English (LTR) with i18next
- **🎨 Modern UI** - Glass morphism effects with dark/light themes
- **📊 Analytics Dashboard** - Real-time charts and statistics
- **🎫 Ticket Management** - QR code generation and scanning
- **👥 Attendee Management** - Check-in system with real-time updates
- **🏢 Team Management** - Role-based access control
- **💼 HR Integration** - Job postings and hiring workflow

### Technical Features
- **⚡ React Native Web** - Cross-platform compatibility
- **🔄 Offline-First** - AsyncStorage with background sync
- **📱 PWA Ready** - Service worker, manifest, installable
- **🎯 TypeScript** - Full type safety
- **🎨 Responsive Design** - Mobile, tablet, desktop optimized
- **🔐 Context State Management** - Centralized app state
- **📈 Charts & Analytics** - react-native-chart-kit integration

## 📁 Project Structure

```
dolab/
├── public/
│   ├── index.html          # PWA-ready HTML with meta tags
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker for offline support
├── src/
│   ├── App.tsx            # Main app component
│   ├── index.tsx          # Entry point
│   ├── theme.ts           # Design system & colors
│   ├── contexts/
│   │   └── AppContext.tsx # Global state management
│   ├── data/
│   │   ├── events.json    # Static event data
│   │   └── saudiEvents.ts # Sample Saudi events
│   ├── lib/
│   │   ├── i18n.ts        # Internationalization setup
│   │   └── mockApi.ts     # Mock API with offline support
│   ├── navigation/
│   │   └── AppNavigator.tsx # React Navigation setup
│   └── screens/
│       ├── HomeScreen.tsx        # Events listing
│       ├── DashboardScreen.tsx   # Analytics & charts
│       ├── CheckInScreen.tsx     # QR scanner
│       ├── SettingsScreen.tsx    # App settings
│       ├── EventDetailScreen.tsx # Event details
│       ├── CheckoutScreen.tsx    # Ticket purchase
│       ├── TicketScreen.tsx      # QR ticket view
│       ├── AttendeesScreen.tsx   # Attendee management
│       ├── TeamScreen.tsx        # Team management
│       ├── JobsScreen.tsx        # HR job listings
│       ├── JobDetailScreen.tsx   # Job details
│       └── auth/
│           ├── LoginScreen.tsx   # Authentication
│           └── RegisterScreen.tsx
├── package.json           # Dependencies & scripts
├── webpack.config.js      # Webpack configuration
├── tsconfig.json         # TypeScript configuration
└── vercel.json           # Deployment configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development URLs
- **Local**: http://localhost:5173
- **Network**: http://0.0.0.0:5173 (accessible on mobile devices)

## 🎨 Design System

### Colors
- **Primary**: `#d29d59` (Gold)
- **Secondary**: `#2d4054` (Navy)
- **Background Dark**: `#0a0a0a`
- **Background Light**: `#ffffff`
- **Glass Effects**: Backdrop blur with transparency

### Typography
- **Arabic**: Cairo font family
- **English**: Playfair Display
- **Responsive**: 12px-32px scale

### Components
- Glass morphism cards
- Responsive grid layouts
- Touch-friendly interactions (44px minimum)
- RTL/LTR adaptive layouts

## 🌐 Internationalization

### Supported Languages
- **Arabic (ar)** - Default, RTL layout
- **English (en)** - LTR layout

### Usage
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
const title = t('home.title'); // Returns localized string
```

### Adding Translations
Edit `src/lib/i18n.ts` to add new translation keys.

## 📱 PWA Features

### Offline Support
- Service worker caches static assets
- Background sync for check-ins and purchases
- AsyncStorage for data persistence

### Installation
- Installable on mobile devices
- Custom install prompts
- App shortcuts for quick actions

### Performance
- Code splitting
- Lazy loading
- Optimized bundle size

## 🔧 API Integration

### Mock API
The app includes a comprehensive mock API (`src/lib/mockApi.ts`) that simulates:
- Event management
- Ticket purchasing
- Attendee check-ins
- Analytics data
- Team management
- Job postings

### Real API Integration
To connect to a real backend:
1. Replace mock API calls in `mockApi.ts`
2. Update service worker cache patterns
3. Configure authentication endpoints

## 📊 Analytics & Charts

### Dashboard Features
- Event performance metrics
- Attendance trends
- Revenue analytics
- Category breakdowns

### Chart Types
- Line charts (sales trends)
- Bar charts (attendance)
- Pie charts (category distribution)

## 🎫 QR Code System

### Generation
- Unique QR codes for each ticket
- Format: `QR-{eventId}-{ticketTypeId}-{timestamp}`

### Scanning
- Camera-based QR scanner
- Manual entry fallback
- Offline check-in support

## 👥 User Management

### Roles & Permissions
- Event managers
- Marketing coordinators
- System administrators
- Check-in staff

### Features
- Team member management
- Permission-based access
- Activity tracking

## 💼 HR Integration

### Job Management
- Job posting creation
- Application tracking
- Candidate management
- Integration with Maharat logo

### Features
- Multi-language job descriptions
- Salary ranges in SAR
- Application deadlines
- Department categorization

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod
```

### Manual Deployment
```bash
# Build production bundle
npm run build

# Serve static files from dist/
```

### Environment Variables
```env
REACT_APP_API_URL=https://api.dolab.com
REACT_APP_ENVIRONMENT=production
```

## 🔒 Security

### Best Practices
- Input validation
- XSS protection
- CSRF tokens
- Secure authentication

### PWA Security
- HTTPS required
- Content Security Policy
- Secure service worker

## 📱 Mobile Optimization

### Performance
- Lazy loading
- Image optimization
- Minimal bundle size
- Fast initial load

### UX Features
- Touch gestures
- Pull-to-refresh
- Smooth animations
- Haptic feedback

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Testing
- Lighthouse audits
- Core Web Vitals
- Mobile performance

## 📈 Monitoring

### Analytics
- User engagement
- Performance metrics
- Error tracking
- Conversion rates

### Tools
- Google Analytics
- Sentry for error tracking
- Performance monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component documentation

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

### Documentation
- [React Native Web](https://necolas.github.io/react-native-web/)
- [React Navigation](https://reactnavigation.org/)
- [i18next](https://www.i18next.com/)

### Contact
- **Email**: support@dolab.com
- **Website**: https://dolab.com
- **GitHub**: https://github.com/dolab/event-manager

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core event management
- ✅ PWA implementation
- ✅ Bilingual support
- ✅ QR code system

### Phase 2 (Planned)
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Social media sharing

### Phase 3 (Future)
- [ ] AI-powered insights
- [ ] Video streaming
- [ ] Advanced reporting
- [ ] Multi-tenant support

---

**Made with ❤️ in Saudi Arabia**

*Dolab Event Manager - Professional event management made simple*
