# 🚀 JobHunt - Advanced Job Hunt Platform

A comprehensive, modern job seeking and recruitment platform built with React, Node.js, and MongoDB. Features AI-powered recommendations, real-time chat, advanced analytics, and much more.

## 🎯 Current Status: **PRODUCTION READY** ✅

**Last Updated**: December 2024  
**Status**: All core features implemented and tested  
**Authentication**: Fully functional with role-based access  
**Database**: MongoDB Atlas connected and optimized  
**Deployment**: Ready for production deployment

## ✨ Features

### 👤 Job Seekers
- **Advanced Profile Management**: Complete profiles with education, experience, portfolio, and certifications
- **AI-Powered Job Recommendations**: Smart matching based on skills and preferences
- **Advanced Search & Filters**: Search by location, salary, company size, remote work, and more
- **Real-Time Chat**: Direct communication with recruiters
- **Analytics Dashboard**: Track applications, profile views, and job search progress
- **Job Alerts**: Email notifications for matching job opportunities
- **Resume Builder**: Create, edit, and download professional resumes with multiple templates
- **Interview Scheduler**: Schedule, manage, and track interview appointments
- **Social Features**: Job sharing, company reviews, and ratings

### 💼 Recruiters (Admin Access)
- **Admin Dashboard**: Full access to platform analytics and management tools
- **Company Management**: Create, edit, and manage company profiles
- **Advanced Job Posting**: Rich job descriptions with validation and error handling
- **Applicant Management**: Track and manage applications with detailed insights
- **Real-Time Chat**: Communicate directly with candidates
- **Analytics & Reporting**: Detailed insights on job performance and applicant metrics
- **Bulk Operations**: Manage multiple jobs and applications efficiently with bulk status updates, email campaigns, and interview scheduling
- **Advanced ATS**: Comprehensive applicant tracking system with candidate scoring, notes, ratings, and analytics
- **Brand Management**: Customize company profiles and job postings
- **Role-Based Access**: Recruiters have admin-level access to dashboard and stats

### 🔧 Admin Features
- **Platform Management**: Comprehensive admin dashboard with real-time metrics
- **User Management**: Manage users, companies, and job postings with role-based access
- **Analytics**: Platform-wide analytics and insights with detailed reporting
- **Content Moderation**: Advanced content review system with automated flagging and manual review
- **System Monitoring**: Real-time health checks, performance monitoring, and alert management
- **Bulk Operations**: Efficient management of multiple applications and jobs
- **Advanced ATS**: Comprehensive applicant tracking with scoring and analytics

### 🚀 Enhanced Features
- **LinkedIn Import**: Import LinkedIn profiles with API integration and manual entry options
- **Enhanced Search**: Advanced search with debouncing, caching, suggestions, and history
- **Application Drafts**: Save and manage application drafts with auto-save functionality
- **Advanced Accessibility**: Comprehensive accessibility settings with WCAG 2.1 AA compliance

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Responsive Design**: Works perfectly on all devices with mobile-first approach
- **Smooth Animations**: Framer Motion powered animations with reduced motion support
- **Modern Components**: Built with Radix UI and Tailwind CSS
- **Advanced Accessibility**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **Accessibility Settings**: Customizable accessibility options including high contrast, large text, keyboard navigation
- **Screen Reader Support**: Full screen reader compatibility with ARIA labels and announcements
- **Keyboard Navigation**: Complete keyboard navigation with focus management and shortcuts
- **Focus Management**: Focus traps for modals and skip links for efficient navigation

## 🔧 Recent Fixes & Improvements

### ✅ Authentication & Security
- **Fixed 401 Unauthorized Errors**: Resolved token authentication issues across all endpoints
- **Role-Based Access Control**: Implemented proper authorization middleware
- **Secure Cookie Handling**: Fixed logout functionality with proper cookie management
- **JWT Token Validation**: Enhanced token verification and user authentication

### ✅ Job Application System
- **Resume Upload**: Fixed resume upload functionality with PDF support
- **Job Applications**: Resolved 404 errors and made resume optional for applications
- **File Validation**: Added proper file type and size validation (5MB limit)
- **Application Management**: Streamlined application process with better error handling

### ✅ Admin Dashboard
- **Recruiter Access**: Recruiters now have full admin dashboard access
- **Role-Based UI**: Dynamic interface based on user role (recruiter vs admin)
- **Missing Components**: Created custom tabs component for dashboard navigation
- **Route Configuration**: Fixed 404 errors by adding missing admin routes

### ✅ User Experience
- **Custom 404 Page**: Beautiful error page instead of generic React errors
- **Loading States**: Added proper loading indicators throughout the app
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Navigation**: Enhanced navbar with role-based navigation links

### ✅ Data Management
- **API Consistency**: Migrated all API calls to use centralized `apiClient`
- **State Management**: Improved Redux state management with proper actions
- **Form Validation**: Enhanced client-side and server-side validation
- **Database Optimization**: Improved MongoDB queries and data handling

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Chart.js** - Data visualization
- **React Hook Form** - Form handling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **Google Gemini AI** - AI-powered features
- **Nodemailer** - Email notifications
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting

### Additional Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 5+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jobhunt.git
   cd jobhunt
   ```

2. **Run the automated setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   *This script will automatically install dependencies, create environment files, and set up the project*

3. **Configure environment variables**
   ```bash
   # Edit backend/.env with your actual values
   nano backend/.env
   ```
   **Required Environment Variables:**
   - `MONGO_URI`: MongoDB connection string
   - `SECRET_KEY`: JWT secret key
   - `CLOUDINARY_CLOUD_NAME`: For file uploads
   - `CLOUDINARY_API_KEY`: Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Cloudinary API secret

4. **Start the development servers**
   ```bash
   # Option 1: Use the startup script
   ./start-dev.sh
   
   # Option 2: Manual start
   cd backend && npm run dev &
   cd frontend && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:5173/admin/dashboard (recruiter/admin only)

### Manual Installation

If you prefer manual installation:

1. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

3. **Create environment file**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your values
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Start backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start frontend server**
   ```bash
   cd frontend
   npm run dev
   ```

## 🧪 Testing & Current Functionality

### ✅ Tested Features

**Authentication System:**
- ✅ User registration (Job Seekers & Recruiters)
- ✅ User login with role-based navigation
- ✅ Secure logout with cookie clearing
- ✅ JWT token validation and refresh
- ✅ Protected routes with proper authorization

**Job Management:**
- ✅ Job posting with comprehensive validation
- ✅ Job search and filtering
- ✅ Job application system (with/without resume)
- ✅ Job status management
- ✅ Company-job associations

**User Management:**
- ✅ Profile creation and updates
- ✅ Resume upload (PDF/Image support)
- ✅ Skills and experience management
- ✅ Profile photo uploads

**Admin Dashboard:**
- ✅ Recruiter access to admin features
- ✅ Platform statistics and analytics
- ✅ Job and company management
- ✅ Application tracking
- ✅ User management (admin only)

**File Management:**
- ✅ Resume uploads with validation
- ✅ File type checking (PDF, images)
- ✅ File size limits (5MB)
- ✅ Cloudinary integration for storage


## 📁 Project Structure

```
jobhunt/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middlewares/         # Custom middlewares
│   ├── utils/               # Utility functions
│   └── index.js            # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── redux/           # State management
│   │   ├── utils/           # Utility functions
│   │   └── main.jsx        # App entry point
│   └── public/              # Static assets
├── setup.sh                 # Setup script
├── start-dev.sh            # Development startup
├── start-prod.sh           # Production startup
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/jobhunt

# JWT Configuration
SECRET_KEY=your_super_secret_jwt_key

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `jobhunt`
3. Update the `MONGO_URI` in your `.env` file

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Update the Cloudinary variables in your `.env` file

### Google Gemini AI Setup

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update the `GEMINI_API_KEY` in your `.env` file

## 🎯 Key Features Explained

### AI-Powered Job Recommendations
- Analyzes user skills, experience, and preferences
- Matches jobs based on compatibility scores
- Learns from user behavior and feedback

### Real-Time Chat System
- WebSocket-based communication
- File sharing capabilities
- Message status indicators
- Conversation management

### Advanced Analytics
- User engagement tracking
- Job performance metrics
- Application success rates
- Profile optimization suggestions

### Modern UI Components
- Responsive design for all devices
- Dark/light mode support
- Smooth animations and transitions
- Accessible components

## 📊 API Endpoints

### Authentication
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

### Jobs
- `GET /api/v1/job` - Get all jobs
- `POST /api/v1/job` - Create job
- `GET /api/v1/job/:id` - Get job by ID
- `PUT /api/v1/job/:id` - Update job
- `DELETE /api/v1/job/:id` - Delete job

### Applications
- `POST /api/v1/application` - Submit application
- `GET /api/v1/application` - Get user applications
- `GET /api/v1/application/job/:jobId` - Get job applications

### Resume Builder
- `POST /api/v1/resume/save` - Save resume data
- `POST /api/v1/resume/generate-pdf` - Generate PDF resume
- `GET /api/v1/resume/data` - Get saved resume data
- `DELETE /api/v1/resume/delete` - Delete resume
- `GET /api/v1/resume/templates` - Get resume templates
- `POST /api/v1/resume/upload` - Upload resume file
- `POST /api/v1/resume/parse` - Parse resume file

### Interview Scheduler
- `POST /api/v1/interviews/schedule` - Schedule interview
- `GET /api/v1/interviews` - Get user interviews
- `GET /api/v1/interviews/upcoming` - Get upcoming interviews
- `GET /api/v1/interviews/stats` - Get interview statistics
- `GET /api/v1/interviews/:id` - Get interview by ID
- `PATCH /api/v1/interviews/:id/status` - Update interview status
- `PATCH /api/v1/interviews/:id/reschedule` - Reschedule interview
- `DELETE /api/v1/interviews/:id` - Cancel interview

### Social Features
- `POST /api/v1/social/reviews` - Submit company review
- `GET /api/v1/social/reviews` - Get reviews
- `GET /api/v1/social/reviews/user` - Get user reviews
- `POST /api/v1/social/reviews/:id/like` - Like review
- `POST /api/v1/social/reviews/:id/report` - Report review
- `POST /api/v1/social/share-job` - Share job
- `GET /api/v1/social/shared-jobs` - Get shared jobs
- `GET /api/v1/social/companies/:companyId/stats` - Get company statistics
- `GET /api/v1/social/companies/trending` - Get trending companies

### Job Alerts
- `POST /api/v1/job-alerts` - Create job alert
- `GET /api/v1/job-alerts` - Get user alerts
- `GET /api/v1/job-alerts/:id` - Get alert by ID
- `PUT /api/v1/job-alerts/:id` - Update alert
- `DELETE /api/v1/job-alerts/:id` - Delete alert
- `PATCH /api/v1/job-alerts/:id/toggle` - Toggle alert status
- `GET /api/v1/job-alerts/:id/matches` - Get matching jobs
- `POST /api/v1/job-alerts/process` - Process alerts (cron job)

### Bulk Operations
- `GET /api/v1/bulk-operations/applications` - Get applications for bulk operations
- `POST /api/v1/bulk-operations/applications/status` - Bulk update application status
- `POST /api/v1/bulk-operations/applications/email` - Bulk send email to candidates
- `POST /api/v1/bulk-operations/applications/interviews` - Bulk schedule interviews
- `POST /api/v1/bulk-operations/applications/export` - Bulk export applications
- `POST /api/v1/bulk-operations/jobs/close` - Bulk close jobs

### Advanced ATS
- `GET /api/v1/ats/applications` - Get applications with advanced filtering
- `GET /api/v1/ats/analytics` - Get ATS analytics
- `GET /api/v1/ats/stats` - Get application statistics
- `PUT /api/v1/ats/applications/:id/status` - Update application status
- `POST /api/v1/ats/applications/:id/notes` - Add note to application
- `POST /api/v1/ats/applications/:id/rating` - Rate candidate

### Content Moderation
- `GET /api/v1/admin/moderation/queue` - Get moderation queue
- `GET /api/v1/admin/moderation/reports` - Get reported content
- `GET /api/v1/admin/moderation/flagged-users` - Get flagged users
- `GET /api/v1/admin/moderation/stats` - Get moderation statistics
- `POST /api/v1/admin/moderation/approve` - Approve content
- `POST /api/v1/admin/moderation/reject` - Reject content
- `POST /api/v1/admin/moderation/flag` - Flag content
- `POST /api/v1/admin/moderation/bulk-approve` - Bulk approve content
- `POST /api/v1/admin/moderation/bulk-reject` - Bulk reject content
- `POST /api/v1/admin/moderation/bulk-flag` - Bulk flag content
- `POST /api/v1/admin/moderation/users/suspend` - Suspend user
- `POST /api/v1/admin/moderation/users/warn` - Warn user
- `POST /api/v1/admin/moderation/users/unflag` - Unflag user
- `POST /api/v1/admin/moderation/users/ban` - Ban user

### System Monitoring
- `GET /api/v1/admin/system/health` - Get system health status
- `GET /api/v1/admin/system/metrics` - Get performance metrics
- `GET /api/v1/admin/system/alerts` - Get system alerts
- `GET /api/v1/admin/system/logs` - Get system logs
- `GET /api/v1/admin/system/stats` - Get system statistics
- `POST /api/v1/admin/system/alerts/:alertId/:action` - Handle alert action
- `POST /api/v1/admin/system/alerts` - Create system alert
- `POST /api/v1/admin/system/logs` - Log system event

### LinkedIn Import
- `POST /api/v1/linkedin/auth-url` - Get LinkedIn OAuth URL
- `GET /api/v1/linkedin/callback` - Handle LinkedIn OAuth callback
- `POST /api/v1/linkedin/import` - Import LinkedIn profile data
- `POST /api/v1/linkedin/save` - Save imported profile data
- `GET /api/v1/linkedin/status/:userId` - Get LinkedIn import status
- `POST /api/v1/linkedin/refresh` - Refresh LinkedIn data

### Application Drafts
- `POST /api/v1/application-drafts/drafts` - Create or update draft
- `GET /api/v1/application-drafts/drafts` - Get user's drafts
- `GET /api/v1/application-drafts/drafts/:draftId` - Get specific draft
- `DELETE /api/v1/application-drafts/drafts/:draftId` - Delete draft
- `POST /api/v1/application-drafts/drafts/:draftId/submit` - Submit draft as application
- `POST /api/v1/application-drafts/upload-resume` - Upload resume for draft
- `GET /api/v1/application-drafts/drafts/stats` - Get draft statistics
- `DELETE /api/v1/application-drafts/drafts/cleanup` - Cleanup old drafts

### Chat
- `POST /api/v1/messages/send` - Send message
- `GET /api/v1/messages/conversations` - Get conversations
- `GET /api/v1/messages/conversation/:id/messages` - Get messages

### Analytics
- `POST /api/v1/analytics/track` - Track event
- `GET /api/v1/analytics/dashboard` - Get dashboard stats

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `GET /api/v1/notifications/unread-count` - Get unread count
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/mark-all-read` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification

## 🚀 Deployment

### Production Ready ✅

The application is **production-ready** and can be deployed immediately. All core features are implemented and tested.

### Quick Production Build

1. **Build frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start production server**
   ```bash
   ./start-prod.sh
   ```

### Production Checklist ✅

- ✅ **Authentication**: JWT-based auth with secure cookies
- ✅ **Database**: MongoDB Atlas ready with optimized queries
- ✅ **File Uploads**: Cloudinary integration for resume uploads
- ✅ **Security**: CORS, rate limiting, and input validation
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Performance**: Optimized queries and caching
- ✅ **Monitoring**: Health checks and performance monitoring
- ✅ **Documentation**: Complete API documentation

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/ .
COPY frontend/dist ./public

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS settings
4. Set up SSL certificates
5. Configure reverse proxy (nginx)

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Redis for session and data caching
- **CDN**: Cloudinary for asset delivery
- **Database Indexing**: Optimized MongoDB queries
- **Bundle Optimization**: Tree shaking and minification

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt for password security
- **Rate Limiting**: API rate limiting
- **CORS Configuration**: Proper cross-origin settings
- **Input Validation**: Server-side validation
- **Helmet**: Security headers
- **File Upload Security**: Type and size validation

## 📋 Current Status & Future Improvements

### ✅ Completed Features
- **Core Authentication**: Login, registration, logout with role-based access
- **Job Management**: Posting, searching, applying, and managing jobs
- **User Profiles**: Complete profile management with resume uploads
- **Admin Dashboard**: Full recruiter/admin access with analytics
- **File Management**: Resume uploads with validation and storage
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: JWT authentication, input validation, and secure file uploads

### ✅ Recently Implemented
- **Resume Builder**: Complete resume creation system with PDF generation
- **Interview Scheduler**: Full interview management with calendar integration
- **Social Features**: Company reviews, job sharing, and community features
- **Job Alerts**: Advanced job alert system with multiple notification channels
- **Real-time Chat**: Socket.io integration for recruiter-candidate communication
- **Advanced Analytics**: Detailed platform analytics and reporting
- **Email Notifications**: Job alerts and application status updates

### 🚀 Future Enhancements
- **AI-Powered Matching**: Enhanced smart job recommendations based on ML algorithms
- **Video Interviews**: Integrated video calling for interviews
- **Mobile App**: React Native mobile application
- **Advanced Search**: Elasticsearch integration for better search
- **Payment Integration**: Premium features and subscription plans
- **Multi-language Support**: Internationalization support
- **Advanced Reporting**: Detailed analytics and insights

### 🐛 Known Issues
- None currently identified - all major issues have been resolved

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions
- **Email**: support@jobhunt.com

## 🎉 Acknowledgments

- React team for the amazing framework
- MongoDB for the database
- Tailwind CSS for the styling
- All contributors and users

---

**Made with ❤️ by the Santosh**
