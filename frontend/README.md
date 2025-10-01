# 🎨 JobHunt Frontend

A modern, responsive React frontend for the JobHunt platform built with React 18, Vite, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Admin Dashboard: http://localhost:5173/admin/dashboard

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth transitions

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form handling and validation
- **Sonner** - Toast notifications
- **Chart.js** - Data visualization

### State Management
- **Redux Toolkit** - Predictable state management
- **React Context** - Theme and global state

### Additional Libraries
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **Date-fns** - Date manipulation utilities
- **React Router** - Client-side routing

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   ├── shared/          # Shared components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── redux/               # Redux store and slices
├── utils/               # Helper functions
└── main.jsx            # Application entry point
```

## 🎨 Component Architecture

### Core Components

#### Authentication Components
- **Login.jsx** - User login form with validation
- **Signup.jsx** - User registration with role selection
- **ProtectedRoute.jsx** - Route protection based on authentication

#### Job Seeker Components
- **JobSeekerDashboard.jsx** - Main dashboard with analytics
- **Profile.jsx** - User profile management
- **ResumeBuilder.jsx** - Resume creation and editing
- **InterviewScheduler.jsx** - Interview management
- **JobAlerts.jsx** - Job alert configuration
- **SocialFeatures.jsx** - Reviews and job sharing

#### Admin/Recruiter Components
- **AdminDashboard.jsx** - Comprehensive admin dashboard
- **AdminJobs.jsx** - Job management interface
- **Applicants.jsx** - Applicant tracking system
- **Companies.jsx** - Company management
- **PostJob.jsx** - Job posting form

#### Shared Components
- **Navbar.jsx** - Main navigation
- **Footer.jsx** - Site footer
- **HeroSection.jsx** - Landing page hero
- **JobCard.jsx** - Job display component
- **FilterCard.jsx** - Search filters

### UI Components

#### Form Components
- **Button.jsx** - Customizable button component
- **Input.jsx** - Text input with validation
- **Textarea.jsx** - Multi-line text input
- **Select.jsx** - Dropdown selection
- **Dialog.jsx** - Modal dialogs
- **Tabs.jsx** - Tab navigation

#### Data Display
- **Card.jsx** - Content containers
- **Table.jsx** - Data tables
- **Badge.jsx** - Status indicators
- **Avatar.jsx** - User avatars
- **Progress.jsx** - Progress bars

#### Feedback Components
- **Toast.jsx** - Notification system
- **Alert.jsx** - Alert messages
- **Loading.jsx** - Loading states

## 🎯 Key Features

### Resume Builder
- **Multi-template Support** - Choose from professional templates
- **Real-time Preview** - See changes as you type
- **PDF Generation** - Download resumes in PDF format
- **Auto-save** - Never lose your progress
- **Skills Management** - Add and organize skills
- **Experience Tracking** - Detailed work history

### Interview Scheduler
- **Calendar Integration** - Schedule interviews with calendar apps
- **Multiple Types** - Video, phone, and in-person interviews
- **Reminder System** - Email and push notifications
- **Status Tracking** - Track interview progress
- **Rescheduling** - Easy interview rescheduling

### Social Features
- **Company Reviews** - Rate and review companies
- **Job Sharing** - Share jobs on social media
- **Community Stats** - Track platform engagement
- **Review Moderation** - Content moderation system

### Job Alerts
- **Smart Matching** - AI-powered job matching
- **Multiple Channels** - Email and push notifications
- **Customizable Frequency** - Instant, daily, weekly, monthly
- **Advanced Filters** - Location, salary, experience level
- **Match Tracking** - See how many jobs match your criteria

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Background**: Light Gray (#F9FAFB)
- **Dark Mode**: Dark Gray (#111827)

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: JetBrains Mono

### Spacing
- **Base Unit**: 4px (0.25rem)
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Breakpoints
- **Mobile**: 640px
- **Tablet**: 768px
- **Desktop**: 1024px
- **Large**: 1280px

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_MISTRAL_API_KEY=your_mistral_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_key
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Extended color palette
- Custom font families
- Additional spacing utilities
- Dark mode support

### Vite Configuration
- React plugin for JSX support
- Path aliases for cleaner imports
- Environment variable handling
- Development server configuration

## 📱 Responsive Design

### Mobile First Approach
- All components are mobile-first
- Progressive enhancement for larger screens
- Touch-friendly interface elements
- Optimized for small screens

### Breakpoint Strategy
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Component Responsiveness
- **Grid Systems**: CSS Grid and Flexbox
- **Navigation**: Collapsible mobile menu
- **Tables**: Horizontal scroll on mobile
- **Forms**: Stacked layout on mobile

## 🎭 Animations

### Framer Motion Integration
- **Page Transitions** - Smooth page changes
- **Component Animations** - Entrance and exit animations
- **Hover Effects** - Interactive feedback
- **Loading States** - Skeleton screens and spinners

### Animation Principles
- **Performance** - GPU-accelerated animations
- **Accessibility** - Respects reduced motion preferences
- **Consistency** - Unified animation language
- **Purpose** - Animations enhance UX, don't distract

## 🔒 Security Features

### Authentication
- **JWT Tokens** - Secure authentication
- **Protected Routes** - Role-based access control
- **Session Management** - Automatic token refresh
- **Logout Security** - Clear sensitive data

### Data Protection
- **Input Validation** - Client-side validation
- **XSS Prevention** - Sanitized user input
- **CSRF Protection** - Cross-site request forgery prevention
- **Secure Headers** - Security headers configuration

## 🧪 Testing

### Testing Strategy
- **Unit Tests** - Component testing with React Testing Library
- **Integration Tests** - API integration testing
- **E2E Tests** - End-to-end testing with Playwright
- **Visual Regression** - Screenshot testing

### Test Commands
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 🚀 Performance Optimization

### Code Splitting
- **Route-based Splitting** - Lazy load routes
- **Component Splitting** - Dynamic imports for heavy components
- **Bundle Analysis** - Monitor bundle size

### Image Optimization
- **Lazy Loading** - Images load when needed
- **WebP Format** - Modern image format support
- **Responsive Images** - Different sizes for different screens
- **CDN Integration** - Cloudinary for image delivery

### Caching Strategy
- **Service Worker** - Offline functionality
- **API Caching** - Reduce redundant requests
- **Component Memoization** - React.memo for expensive components
- **Bundle Caching** - Long-term caching for static assets

## 🔧 Development Workflow

### Code Quality
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks
- **TypeScript** - Type checking

### Development Tools
- **React DevTools** - Component debugging
- **Redux DevTools** - State management debugging
- **Vite DevTools** - Build tool debugging
- **Browser DevTools** - Performance profiling

### Git Workflow
- **Feature Branches** - Isolated feature development
- **Pull Requests** - Code review process
- **Automated Testing** - CI/CD pipeline
- **Deployment** - Automated deployment

## 📦 Build & Deployment

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options
- **Vercel** - Recommended for React apps
- **Netlify** - Static site hosting
- **AWS S3** - Scalable hosting
- **Docker** - Containerized deployment

### Build Optimization
- **Tree Shaking** - Remove unused code
- **Minification** - Compress JavaScript and CSS
- **Asset Optimization** - Optimize images and fonts
- **Bundle Splitting** - Separate vendor and app code

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow the existing code style
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure all tests pass
- Update documentation as needed

### Component Guidelines
- Use functional components with hooks
- Implement proper error boundaries
- Add loading states for async operations
- Ensure accessibility compliance
- Write comprehensive tests

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### Learning Resources
- [React Patterns](https://reactpatterns.com/)
- [Modern React Development](https://react.dev/learn)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🆘 Support

### Common Issues
- **Build Errors** - Check Node.js version and dependencies
- **Styling Issues** - Verify Tailwind CSS configuration
- **API Errors** - Check backend server and environment variables
- **Performance Issues** - Use React DevTools Profiler

### Getting Help
- Check the documentation
- Search existing issues
- Create a new issue with detailed information
- Join the community discussions

---

**Made with ❤️ by the JobHunt Team**