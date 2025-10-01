# 🚀 JobHunt Backend

A robust Node.js backend API for the JobHunt platform built with Express.js, MongoDB, and modern JavaScript features.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

4. **Access the API**
   - API Base URL: http://localhost:5000/api/v1
   - Health Check: http://localhost:5000/health

## 🛠️ Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time communication

### Authentication & Security
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting

### File Management
- **Multer** - File upload handling
- **Cloudinary** - Cloud image and file storage
- **PDFKit** - PDF generation

### Additional Libraries
- **Nodemailer** - Email notifications
- **Google Gemini AI** - AI-powered features
- **Date-fns** - Date manipulation utilities

## 📁 Project Structure

```
backend/
├── controllers/         # Route controllers
│   ├── admin.controller.js
│   ├── analytics.controller.js
│   ├── application.controller.js
│   ├── chatbot.controller.js
│   ├── company.controller.js
│   ├── interview.controller.js
│   ├── job.controller.js
│   ├── jobAlert.controller.js
│   ├── message.controller.js
│   ├── notification.controller.js
│   ├── resume.controller.js
│   ├── social.controller.js
│   └── user.controller.js
├── models/              # Database models
│   ├── analytics.model.js
│   ├── application.model.js
│   ├── company.model.js
│   ├── interview.model.js
│   ├── job.model.js
│   ├── jobAlert.model.js
│   ├── message.model.js
│   ├── notification.model.js
│   ├── review.model.js
│   ├── sharedJob.model.js
│   └── user.model.js
├── routes/              # API routes
│   ├── admin.route.js
│   ├── analytics.route.js
│   ├── application.route.js
│   ├── chatboatroutes.route.js
│   ├── company.route.js
│   ├── interview.route.js
│   ├── job.route.js
│   ├── jobAlert.route.js
│   ├── message.route.js
│   ├── notification.route.js
│   ├── resume.route.js
│   ├── social.route.js
│   └── user.route.js
├── middlewares/         # Custom middlewares
│   ├── isAuthenticated.js
│   ├── isAuthorized.js
│   └── multer.js
├── utils/               # Utility functions
│   ├── cloudinary.js
│   ├── datauri.js
│   └── db.js
├── dummy_data/          # Sample data
│   ├── companies.json
│   └── users.json
└── index.js            # Server entry point
```

## 🗄️ Database Models

### Core Models

#### User Model
```javascript
{
  fullName: String,
  email: String (unique),
  phoneNumber: Number,
  password: String (hashed),
  role: Enum ['student', 'recruiter', 'admin'],
  isVerified: Boolean,
  profile: {
    bio: String,
    skills: [String],
    experience: [Object],
    education: [Object],
    resume: String,
    resumeData: Object
  },
  analytics: {
    profileViews: Number,
    jobApplications: Number,
    profileCompleteness: Number
  }
}
```

#### Job Model
```javascript
{
  title: String,
  description: String,
  requirements: String,
  salary: Number,
  location: String,
  jobType: Enum ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
  experience: Number,
  position: Number,
  company: ObjectId (ref: Company),
  createdBy: ObjectId (ref: User),
  status: Enum ['active', 'closed', 'draft']
}
```

#### Application Model
```javascript
{
  user: ObjectId (ref: User),
  job: ObjectId (ref: Job),
  resume: String,
  coverLetter: String,
  status: Enum ['applied', 'reviewed', 'shortlisted', 'interview', 'hired', 'rejected'],
  appliedAt: Date
}
```

### Feature-Specific Models

#### Resume Model (Embedded in User)
```javascript
{
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    portfolio: String,
    summary: String
  },
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: String,
    description: String
  }],
  skills: [String],
  projects: [Object],
  certifications: [Object]
}
```

#### Interview Model
```javascript
{
  user: ObjectId (ref: User),
  job: ObjectId (ref: Job),
  application: ObjectId (ref: Application),
  date: Date,
  time: String,
  type: Enum ['video', 'phone', 'in-person'],
  meetingLink: String,
  location: String,
  notes: String,
  duration: Number,
  interviewerName: String,
  interviewerEmail: String,
  status: Enum ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
  feedback: Object
}
```

#### Review Model
```javascript
{
  user: ObjectId (ref: User),
  company: ObjectId (ref: Company),
  rating: Number (1-5),
  title: String,
  pros: String,
  cons: String,
  overallExperience: String,
  workLifeBalance: Number (1-5),
  salaryBenefits: Number (1-5),
  careerGrowth: Number (1-5),
  management: Number (1-5),
  culture: Number (1-5),
  recommend: Boolean,
  anonymous: Boolean,
  status: Enum ['pending', 'approved', 'rejected'],
  likes: [ObjectId],
  reports: [Object]
}
```

#### JobAlert Model
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  keywords: [String],
  location: String,
  jobType: Enum ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
  experienceLevel: Enum ['entry', 'mid', 'senior', 'lead'],
  salaryMin: Number,
  salaryMax: Number,
  companySize: Enum ['startup', 'small', 'medium', 'large'],
  industry: String,
  remoteWork: Boolean,
  frequency: Enum ['instant', 'daily', 'weekly', 'monthly'],
  emailNotifications: Boolean,
  pushNotifications: Boolean,
  isActive: Boolean,
  lastChecked: Date
}
```

## 🔌 API Endpoints

### Authentication Routes (`/api/v1/user`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /profile/update` - Update user profile

### Job Routes (`/api/v1/job`)
- `GET /get` - Get all jobs
- `POST /post` - Create job (recruiter/admin only)
- `GET /get/:id` - Get job by ID
- `GET /getadminjobs` - Get admin jobs

### Application Routes (`/api/v1/application`)
- `POST /` - Submit application
- `GET /` - Get user applications
- `GET /job/:jobId` - Get job applications

### Resume Routes (`/api/v1/resume`)
- `POST /save` - Save resume data
- `POST /generate-pdf` - Generate PDF resume
- `GET /data` - Get saved resume data
- `DELETE /delete` - Delete resume
- `GET /templates` - Get resume templates
- `POST /upload` - Upload resume file
- `POST /parse` - Parse resume file

### Interview Routes (`/api/v1/interviews`)
- `POST /schedule` - Schedule interview
- `GET /` - Get user interviews
- `GET /upcoming` - Get upcoming interviews
- `GET /stats` - Get interview statistics
- `GET /:id` - Get interview by ID
- `PATCH /:id/status` - Update interview status
- `PATCH /:id/reschedule` - Reschedule interview
- `DELETE /:id` - Cancel interview

### Social Routes (`/api/v1/social`)
- `POST /reviews` - Submit company review
- `GET /reviews` - Get reviews
- `GET /reviews/user` - Get user reviews
- `POST /reviews/:id/like` - Like review
- `POST /reviews/:id/report` - Report review
- `POST /share-job` - Share job
- `GET /shared-jobs` - Get shared jobs
- `GET /companies/:companyId/stats` - Get company statistics
- `GET /companies/trending` - Get trending companies

### Job Alert Routes (`/api/v1/job-alerts`)
- `POST /` - Create job alert
- `GET /` - Get user alerts
- `GET /:id` - Get alert by ID
- `PUT /:id` - Update alert
- `DELETE /:id` - Delete alert
- `PATCH /:id/toggle` - Toggle alert status
- `GET /:id/matches` - Get matching jobs
- `POST /process` - Process alerts (cron job)

### Message Routes (`/api/v1/messages`)
- `POST /send` - Send message
- `GET /conversations` - Get conversations
- `GET /conversation/:id/messages` - Get messages

### Notification Routes (`/api/v1/notifications`)
- `GET /` - Get notifications
- `GET /unread-count` - Get unread count
- `PATCH /:id/read` - Mark as read
- `PATCH /mark-all-read` - Mark all as read
- `DELETE /:id` - Delete notification

### Analytics Routes (`/api/v1/analytics`)
- `POST /track` - Track event
- `GET /dashboard` - Get dashboard stats

### Admin Routes (`/api/v1/admin`)
- `GET /dashboard` - Get admin dashboard
- `GET /users` - Get all users
- `GET /jobs` - Get all jobs
- `GET /companies` - Get all companies
- `PATCH /users/:id/status` - Update user status
- `DELETE /users/:id` - Delete user

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Role-Based Access** - Student, Recruiter, Admin roles
- **Session Management** - Token refresh and expiration
- **Protected Routes** - Middleware-based route protection

### Data Validation
- **Input Sanitization** - Prevent XSS attacks
- **Schema Validation** - Mongoose schema validation
- **File Upload Security** - Type and size validation
- **SQL Injection Prevention** - NoSQL injection protection

### Security Middleware
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Request Size Limits** - Prevent large payload attacks

## 📁 File Management

### Cloudinary Integration
- **Image Upload** - Profile pictures and company logos
- **File Storage** - Resume and document storage
- **Image Optimization** - Automatic resizing and compression
- **CDN Delivery** - Fast global content delivery

### File Types Supported
- **Images**: JPEG, PNG, WebP, GIF
- **Documents**: PDF, DOC, DOCX
- **Size Limits**: 5MB for documents, 2MB for images

### File Processing
- **Virus Scanning** - Security validation
- **Format Conversion** - Automatic format optimization
- **Metadata Extraction** - File information extraction

## 🤖 AI Integration

### Google Gemini AI
- **Job Recommendations** - AI-powered job matching
- **Resume Analysis** - Skills extraction and optimization
- **Content Generation** - Job descriptions and summaries
- **Chatbot Support** - AI-powered customer support

### AI Features
- **Smart Matching** - Skills-based job recommendations
- **Content Moderation** - AI-powered content filtering
- **Analytics Insights** - AI-generated insights and reports
- **Automated Responses** - Smart email and notification templates

## 📧 Email System

### Nodemailer Configuration
- **SMTP Support** - Gmail, Outlook, custom SMTP
- **Template Engine** - Dynamic email templates
- **Attachment Support** - File attachments
- **Delivery Tracking** - Email delivery status

### Email Types
- **Welcome Emails** - User registration confirmation
- **Job Alerts** - Matching job notifications
- **Interview Reminders** - Interview scheduling notifications
- **Application Updates** - Status change notifications
- **Password Reset** - Secure password reset links

## 🔄 Real-time Features

### Socket.io Integration
- **Real-time Chat** - Instant messaging between users
- **Live Notifications** - Push notifications
- **Online Status** - User presence tracking
- **Live Updates** - Real-time data synchronization

### WebSocket Events
- **Connection Management** - User connection/disconnection
- **Room Management** - Chat room creation and joining
- **Message Broadcasting** - Real-time message delivery
- **Status Updates** - Live status changes

## 📊 Analytics & Monitoring

### Data Collection
- **User Analytics** - Profile views, applications, searches
- **Job Analytics** - Views, applications, performance metrics
- **Platform Analytics** - User growth, engagement metrics
- **Performance Monitoring** - API response times, error rates

### Reporting Features
- **Dashboard Analytics** - Real-time dashboard metrics
- **Export Functionality** - CSV/PDF report generation
- **Custom Date Ranges** - Flexible reporting periods
- **Trend Analysis** - Historical data analysis

## 🧪 Testing

### Testing Strategy
- **Unit Tests** - Individual function testing
- **Integration Tests** - API endpoint testing
- **Database Tests** - Model and query testing
- **Security Tests** - Authentication and authorization testing

### Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- controllers/user.test.js
```

### Test Coverage
- **Controllers** - API endpoint testing
- **Models** - Database model testing
- **Middlewares** - Authentication and validation testing
- **Utils** - Utility function testing

## 🚀 Performance Optimization

### Database Optimization
- **Indexing** - Strategic database indexes
- **Query Optimization** - Efficient MongoDB queries
- **Connection Pooling** - Database connection management
- **Aggregation Pipelines** - Complex data processing

### Caching Strategy
- **Memory Caching** - In-memory data caching
- **Query Caching** - Database query results caching
- **Session Caching** - User session data caching
- **Static Asset Caching** - File and image caching

### API Optimization
- **Response Compression** - Gzip compression
- **Pagination** - Large dataset pagination
- **Rate Limiting** - API usage throttling
- **Request Validation** - Early request validation

## 🔧 Configuration

### Environment Variables
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

### Database Configuration
- **Connection String** - MongoDB connection configuration
- **Index Creation** - Automatic index creation
- **Schema Validation** - Data validation rules
- **Connection Options** - Connection pool settings

## 🚀 Deployment

### Production Setup
- **Environment Variables** - Production configuration
- **Database Migration** - Schema updates
- **SSL Configuration** - HTTPS setup
- **Process Management** - PM2 process management

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Deployment Options
- **Heroku** - Easy deployment platform
- **AWS EC2** - Scalable cloud hosting
- **DigitalOcean** - Simple VPS hosting
- **Docker** - Containerized deployment

## 🔧 Development Tools

### Code Quality
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality checks
- **JSDoc** - API documentation

### Development Workflow
- **Hot Reload** - Automatic server restart
- **Debug Mode** - Enhanced error logging
- **API Testing** - Postman/Insomnia integration
- **Database GUI** - MongoDB Compass integration

## 📚 API Documentation

### Request/Response Format
```javascript
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Authentication Headers
```javascript
// JWT Token in Cookie
Cookie: token=jwt_token_here

// Or Authorization Header
Authorization: Bearer jwt_token_here
```

### Pagination
```javascript
// Query Parameters
?page=1&limit=10&sortBy=createdAt&sortOrder=desc

// Response Format
{
  "data": [...],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

## 🆘 Troubleshooting

### Common Issues
- **Database Connection** - Check MongoDB URI and network
- **Authentication Errors** - Verify JWT secret and token validity
- **File Upload Issues** - Check Cloudinary configuration
- **Email Delivery** - Verify SMTP settings and credentials

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Specific debug categories
DEBUG=app:*,mongoose:* npm run dev
```

### Logging
- **Console Logging** - Development logging
- **File Logging** - Production log files
- **Error Tracking** - Centralized error monitoring
- **Performance Monitoring** - Response time tracking

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Install dependencies
4. Make your changes
5. Add tests
6. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Write comprehensive tests
- Add JSDoc comments
- Update documentation
- Ensure security best practices

### API Guidelines
- Use RESTful conventions
- Implement proper error handling
- Add input validation
- Include response pagination
- Follow security practices

## 📚 Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Socket.io Documentation](https://socket.io/docs/)

### Learning Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB University](https://university.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

**Made with ❤️ by the JobHunt Team**
