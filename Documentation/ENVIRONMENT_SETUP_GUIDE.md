# 🚀 COMPLETE ENVIRONMENT SETUP GUIDE

## 📋 **REQUIRED ENVIRONMENT VARIABLES**

### **Backend (.env) - Create in `jobHunt/jobHunt/backend/.env`**

```env
# ===========================================
# CORE APPLICATION SETTINGS
# ===========================================
NODE_ENV=development
PORT=5000

# ===========================================
# JWT AUTHENTICATION
# ===========================================
SECRET_KEY=your_super_secret_jwt_key_here_make_it_long_and_random_123456789abcdefghijklmnopqrstuvwxyz

# ===========================================
# DATABASE CONNECTION
# ===========================================
MONGO_URI=mongodb+srv://jobHunt:ql6h6WMQsNZCONUl@cluster0.bachoqr.mongodb.net/jobHunt?retryWrites=true&w=majority&appName=Cluster0

# Alternative MongoDB Atlas (if you want to use your own):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobhunt?retryWrites=true&w=majority

# ===========================================
# CLOUDINARY (Image/File Storage)
# ===========================================
# Get these from: https://cloudinary.com/
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# ===========================================
# GOOGLE GEMINI AI (Chatbot)
# ===========================================
# Get this from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# ===========================================
# EMAIL SERVICE (Nodemailer)
# ===========================================
# For Gmail SMTP:
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Alternative SMTP settings:
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_SECURE=false

# ===========================================
# LINKEDIN INTEGRATION
# ===========================================
# Get these from: https://www.linkedin.com/developers/
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:5173/linkedin-import

# ===========================================
# FRONTEND URL (for CORS)
# ===========================================
FRONTEND_URL=http://localhost:5173

# ===========================================
# OPTIONAL: TESTING
# ===========================================
MONGODB_TEST_URI=mongodb://localhost:27017/jobhunt_test
JWT_SECRET=test-jwt-secret
JWT_EXPIRES_IN=1h
```

---

## 🔧 **STEP-BY-STEP SETUP INSTRUCTIONS**

### **1. MongoDB Setup**
```bash
# Option A: Use existing MongoDB Atlas (Recommended)
# The project already has a working MongoDB Atlas connection
# No setup needed - just use the provided MONGO_URI

# Option B: Create your own MongoDB Atlas
# 1. Go to https://www.mongodb.com/atlas
# 2. Create a free account
# 3. Create a new cluster
# 4. Get connection string
# 5. Replace MONGO_URI in .env
```

### **2. Cloudinary Setup**
```bash
# 1. Go to https://cloudinary.com/
# 2. Sign up for free account
# 3. Go to Dashboard
# 4. Copy Cloud Name, API Key, API Secret
# 5. Add to .env file
```

### **3. Google Gemini AI Setup**
```bash
# 1. Go to https://makersuite.google.com/app/apikey
# 2. Sign in with Google account
# 3. Create new API key
# 4. Copy the API key
# 5. Add to .env file as GEMINI_API_KEY
```

### **4. Email Service Setup (Gmail)**
```bash
# 1. Enable 2-Factor Authentication on Gmail
# 2. Generate App Password:
#    - Go to Google Account settings
#    - Security > 2-Step Verification > App passwords
#    - Generate password for "Mail"
# 3. Use your Gmail address and app password in .env
```

### **5. LinkedIn Integration Setup**
```bash
# 1. Go to https://www.linkedin.com/developers/
# 2. Create new app
# 3. Add redirect URL: http://localhost:5173/linkedin-import
# 4. Copy Client ID and Client Secret
# 5. Add to .env file
```

---

## 🚀 **QUICK START COMMANDS**

### **Backend Setup**
```bash
cd jobHunt/jobHunt/backend
npm install
# Create .env file with the variables above
npm run dev
```

### **Frontend Setup**
```bash
cd jobHunt/jobHunt/frontend
npm install
npm run dev
```

---

## 🔍 **FEATURE-SPECIFIC REQUIREMENTS**

### **✅ Features that work WITHOUT external APIs:**
- User Authentication
- Job Posting & Management
- Company Management
- Basic Search & Filtering
- Profile Management
- Admin Dashboard
- Application Management

### **⚠️ Features that need external APIs:**

#### **Chatbot (ChatBoat)**
- **Requires**: `GEMINI_API_KEY`
- **Fallback**: Shows "AI service unavailable" message

#### **File Uploads (Resume, Profile Photos)**
- **Requires**: Cloudinary credentials
- **Fallback**: Local file storage (limited functionality)

#### **Email Notifications**
- **Requires**: Email credentials
- **Fallback**: Console logging only

#### **LinkedIn Import**
- **Requires**: LinkedIn API credentials
- **Fallback**: Manual profile entry

---

## 🎯 **MINIMAL WORKING SETUP**

If you want to get started quickly with minimal setup:

```env
# Minimal .env for basic functionality
NODE_ENV=development
PORT=5000
SECRET_KEY=your_super_secret_jwt_key_here_make_it_long_and_random_123456789
MONGO_URI=mongodb+srv://jobHunt:ql6h6WMQsNZCONUl@cluster0.bachoqr.mongodb.net/jobHunt?retryWrites=true&w=majority&appName=Cluster0
FRONTEND_URL=http://localhost:5173
```

This will give you:
- ✅ User authentication
- ✅ Job posting & management
- ✅ Company management
- ✅ Basic search functionality
- ✅ Profile management
- ✅ Admin dashboard
- ❌ Chatbot (will show error)
- ❌ File uploads (will fail)
- ❌ Email notifications (will log to console)
- ❌ LinkedIn import (will show error)

---

## 🔧 **TROUBLESHOOTING**

### **Common Issues:**

1. **"Cannot connect to MongoDB"**
   - Check MONGO_URI is correct
   - Ensure MongoDB Atlas cluster is running
   - Check IP whitelist in MongoDB Atlas

2. **"Cloudinary upload failed"**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure CLOUD_NAME, API_KEY, API_SECRET are correct

3. **"Gemini API error"**
   - Check GEMINI_API_KEY is valid
   - Ensure API key has proper permissions
   - Check API quota limits

4. **"Email sending failed"**
   - Verify EMAIL_USER and EMAIL_PASS
   - Check Gmail app password is correct
   - Ensure 2FA is enabled

5. **"LinkedIn import failed"**
   - Check LinkedIn app credentials
   - Verify redirect URI matches
   - Ensure app is approved for production

---

## 📊 **API ENDPOINTS OVERVIEW**

### **Authentication**
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/logout` - User logout

### **Jobs**
- `GET /api/v1/job` - Get all jobs
- `POST /api/v1/job` - Create job
- `GET /api/v1/job/:id` - Get job by ID
- `PUT /api/v1/job/:id` - Update job
- `DELETE /api/v1/job/:id` - Delete job

### **Applications**
- `POST /api/v1/application` - Submit application
- `GET /api/v1/application` - Get user applications
- `GET /api/v1/application/job/:jobId` - Get job applications

### **Resume Builder**
- `POST /api/v1/resume/save` - Save resume data
- `POST /api/v1/resume/generate-pdf` - Generate PDF resume
- `GET /api/v1/resume/data` - Get saved resume data

### **Chat System**
- `POST /api/v1/chatboat` - Send message to AI chatbot
- `GET /api/v1/messages` - Get chat messages
- `POST /api/v1/messages` - Send message

### **Admin Features**
- `GET /api/v1/admin/dashboard` - Admin dashboard data
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/analytics` - Platform analytics
- `POST /api/v1/bulk-operations` - Bulk operations

---

## 🎨 **UI ENHANCEMENTS IMPLEMENTED**

### **✅ Completed:**
- ✅ Added all missing routes to App.jsx
- ✅ Enhanced Navbar with comprehensive navigation
- ✅ Added feature icons and better organization
- ✅ Improved user profile dropdown with all features
- ✅ Role-based navigation (Student vs Recruiter)
- ✅ Modern gradient design matching Coding Unstop style

### **🎯 Features Now Accessible:**
- **Job Seekers**: Dashboard, Resume Builder, Interview Scheduler, Job Alerts, Chat System, Social Features
- **Recruiters**: Advanced ATS, Bulk Operations, Content Moderation, System Monitoring
- **All Users**: Enhanced Search, LinkedIn Import, Application Drafts

---

## 🚀 **NEXT STEPS**

1. **Create the .env file** with your credentials
2. **Start the backend**: `npm run dev` in backend folder
3. **Start the frontend**: `npm run dev` in frontend folder
4. **Access the application**: http://localhost:5173
5. **Test all features** using the enhanced navigation

---

## 📞 **SUPPORT**

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB Atlas connection
5. Verify API credentials are valid

**Happy Coding! 🎉**
