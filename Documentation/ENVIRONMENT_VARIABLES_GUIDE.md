# 🌍 JobHunt Platform - Environment Variables Guide

## 📋 Complete Environment Variables Structure

This guide provides a comprehensive list of all environment variables needed for the JobHunt platform. Copy the variables below to your `.env` file and fill in your actual values.

---

## 🔧 **QUICK SETUP**

### **1. Create .env file:**
```bash
# Copy this file to .env in your backend root directory
cp ENVIRONMENT_VARIABLES_GUIDE.md .env
```

### **2. Essential Variables (Minimum Required):**
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/jobhunt

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

---

## 📝 **COMPLETE ENVIRONMENT VARIABLES**

### **🌐 SERVER CONFIGURATION**
```env
# Basic Server Settings
NODE_ENV=development
PORT=5000
HOST=localhost

# Environment
ENVIRONMENT=development
DEBUG_MODE=true
VERBOSE_LOGGING=true
```

### **🗄️ DATABASE CONFIGURATION**
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/jobhunt
MONGODB_TEST_URI=mongodb://localhost:27017/jobhunt_test

# Database Options
DB_CONNECTION_TIMEOUT=30000
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=5
DB_POOL_SIZE=10
DB_POOL_MIN=2
DB_POOL_MAX=20
```

### **🔐 AUTHENTICATION & SECURITY**
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_REFRESH_EXPIRES_IN=30d

# Password Hashing
BCRYPT_ROUNDS=12

# Session Configuration
SESSION_SECRET=your-session-secret-key
SESSION_COOKIE_MAX_AGE=604800000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
API_RATE_LIMIT_PER_MINUTE=60

# Security Headers
HELMET_CSP_ENABLED=true
HELMET_HSTS_ENABLED=true
API_KEY_HEADER=x-api-key
```

### **📧 EMAIL CONFIGURATION**
```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Templates
EMAIL_FROM_NAME=JobHunt Platform
EMAIL_FROM_ADDRESS=noreply@jobhunt.com
EMAIL_REPLY_TO=support@jobhunt.com

# Alternative Email Services
SENDGRID_API_KEY=your-sendgrid-api-key
AWS_SES_ACCESS_KEY_ID=your-aws-access-key
AWS_SES_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_SES_REGION=us-east-1
```

### **☁️ FILE STORAGE & UPLOADS**
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# AWS S3 Configuration (Alternative)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=jobhunt-uploads

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,jpg,jpeg,png,gif,webp
UPLOAD_TIMEOUT=300000
```

### **🔗 EXTERNAL API INTEGRATIONS**
```env
# LinkedIn API
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/v1/linkedin/callback

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/v1/auth/google/callback

# AI/ML Services
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-google-gemini-api-key

# Payment Gateway
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

### **📊 ANALYTICS & MONITORING**
```env
# Google Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Monitoring Services
NEW_RELIC_LICENSE_KEY=your-new-relic-license-key
SENTRY_DSN=your-sentry-dsn-url

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log

# Application Metrics
METRICS_ENABLED=true
METRICS_PORT=9090
HEALTH_CHECK_ENDPOINT=/health
```

### **🔔 NOTIFICATION SERVICES**
```env
# Push Notifications
FCM_SERVER_KEY=your-firebase-server-key
FCM_PROJECT_ID=your-firebase-project-id
PUSH_NOTIFICATION_ENABLED=true
PUSH_NOTIFICATION_SOUND=default

# SMS Services
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### **🌐 FRONTEND CONFIGURATION**
```env
# Frontend URL
FRONTEND_URL=http://localhost:5173
FRONTEND_DOMAIN=localhost:5173

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://jobhunt.com
```

### **🔍 SEARCH & INDEXING**
```env
# Elasticsearch (if used)
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INDEX_NAME=jobhunt-jobs

# Redis (for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password
CACHE_TTL=3600
CACHE_MAX_SIZE=1000
```

### **📅 SCHEDULING & QUEUES**
```env
# Background Jobs
QUEUE_REDIS_URL=redis://localhost:6379
QUEUE_CONCURRENCY=5

# Cron Jobs
CRON_TIMEZONE=UTC
```

### **🧪 TESTING CONFIGURATION**
```env
# Test Database
TEST_DB_URI=mongodb://localhost:27017/jobhunt_test
TEST_EMAIL=test@example.com
TEST_JWT_SECRET=test-jwt-secret-key
TEST_CLOUDINARY_CLOUD_NAME=test-cloud
```

### **📱 MOBILE APP CONFIGURATION**
```env
# Mobile App Settings
MOBILE_APP_VERSION=1.0.0
MOBILE_API_VERSION=v1
```

### **🌍 INTERNATIONALIZATION**
```env
# Default Language
DEFAULT_LANGUAGE=en
SUPPORTED_LANGUAGES=en,es,fr,de,it,pt,ru,zh,ja,ko
DEFAULT_TIMEZONE=UTC
```

### **💰 BUSINESS CONFIGURATION**
```env
# Subscription Plans
FREE_PLAN_JOB_LIMIT=5
PREMIUM_PLAN_JOB_LIMIT=50
ENTERPRISE_PLAN_JOB_LIMIT=unlimited

# Feature Flags
ENABLE_CHAT=true
ENABLE_ANALYTICS=true
ENABLE_SOCIAL_FEATURES=true
ENABLE_AI_RECOMMENDATIONS=true
FEATURE_REGISTRATION=true
FEATURE_SOCIAL_LOGIN=true
FEATURE_EMAIL_VERIFICATION=true
FEATURE_TWO_FACTOR_AUTH=false
FEATURE_ADVANCED_SEARCH=true
FEATURE_REAL_TIME_CHAT=true
FEATURE_MOBILE_APP=true
```

### **🔐 ENCRYPTION KEYS**
```env
# Data Encryption
ENCRYPTION_KEY=your-32-character-encryption-key
ENCRYPTION_ALGORITHM=aes-256-gcm
FILE_ENCRYPTION_KEY=your-file-encryption-key
```

### **📊 PERFORMANCE CONFIGURATION**
```env
# Request Timeout
REQUEST_TIMEOUT=30000

# Performance Monitoring
PERFORMANCE_MONITORING=true
SLOW_QUERY_THRESHOLD=1000
MEMORY_USAGE_THRESHOLD=80
```

### **🚨 ALERTING & NOTIFICATIONS**
```env
# System Alerts
ALERT_EMAIL=alerts@jobhunt.com
ALERT_SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
ALERT_DISCORD_WEBHOOK=https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK

# Error Reporting
ERROR_REPORTING_ENABLED=true
ERROR_REPORTING_EMAIL=errors@jobhunt.com
```

### **📝 DOCUMENTATION**
```env
# API Documentation
API_DOCS_ENABLED=true
API_DOCS_URL=http://localhost:5000/api-docs
SWAGGER_ENABLED=true
```

### **📞 SUPPORT & CONTACT**
```env
# Support Configuration
SUPPORT_EMAIL=support@jobhunt.com
SUPPORT_PHONE=+1-800-JOBHUNT
SUPPORT_CHAT_ENABLED=true

# Contact Information
CONTACT_EMAIL=contact@jobhunt.com
CONTACT_ADDRESS=123 Job Street, Career City, CC 12345
```

### **📋 COMPLIANCE & LEGAL**
```env
# Privacy & Compliance
GDPR_COMPLIANCE=true
COOKIE_CONSENT_REQUIRED=true
DATA_RETENTION_DAYS=2555

# Terms & Privacy
TERMS_OF_SERVICE_URL=https://jobhunt.com/terms
PRIVACY_POLICY_URL=https://jobhunt.com/privacy
COOKIE_POLICY_URL=https://jobhunt.com/cookies
```

### **🎨 UI/UX CONFIGURATION**
```env
# Theme Configuration
DEFAULT_THEME=light
THEME_PERSISTENCE=true

# UI Features
ANIMATIONS_ENABLED=true
DARK_MODE_ENABLED=true
ACCESSIBILITY_ENHANCED=true
```

### **🔧 MAINTENANCE MODE**
```env
# Maintenance Settings
MAINTENANCE_MODE=false
MAINTENANCE_MESSAGE=We're currently performing scheduled maintenance. Please check back soon.
MAINTENANCE_ALLOWED_IPS=127.0.0.1,::1
```

### **📊 BUSINESS INTELLIGENCE**
```env
# Analytics
ANALYTICS_ENABLED=true
USER_TRACKING_ENABLED=true

# Reporting
REPORT_GENERATION_ENABLED=true
REPORT_EXPORT_FORMATS=pdf,csv,xlsx
```

### **🌐 CDN & ASSETS**
```env
# CDN Configuration
CDN_URL=https://cdn.jobhunt.com
CDN_ENABLED=false

# Asset Optimization
ASSET_COMPRESSION=true
IMAGE_OPTIMIZATION=true
CSS_MINIFICATION=true
JS_MINIFICATION=true
```

### **📱 SOCIAL MEDIA INTEGRATION**
```env
# Social Media APIs
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
```

### **🔍 SEO & METADATA**
```env
# SEO Configuration
SITE_TITLE=JobHunt - Find Your Dream Job
SITE_DESCRIPTION=Connect with top employers and find your perfect job opportunity
SITE_KEYWORDS=jobs,careers,employment,recruitment,hiring
SITE_URL=https://jobhunt.com

# Social Media Meta Tags
OG_IMAGE_URL=https://jobhunt.com/images/og-image.jpg
TWITTER_CARD_TYPE=summary_large_image
```

### **📋 BACKUP & RECOVERY**
```env
# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30

# Recovery Settings
RECOVERY_EMAIL=admin@jobhunt.com
RECOVERY_PHONE=+1234567890
```

---

## 🚀 **ENVIRONMENT-SPECIFIC CONFIGURATIONS**

### **🔧 Development Environment**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobhunt_dev
DEBUG_MODE=true
VERBOSE_LOGGING=true
CORS_ORIGIN=http://localhost:5173
```

### **🧪 Staging Environment**
```env
NODE_ENV=staging
PORT=5000
MONGODB_URI=mongodb://staging-server:27017/jobhunt_staging
DEBUG_MODE=false
CORS_ORIGIN=https://staging.jobhunt.com
```

### **🚀 Production Environment**
```env
NODE_ENV=production
PORT=80
MONGODB_URI=mongodb://production-server:27017/jobhunt_prod
JWT_SECRET=super-secure-production-jwt-secret
CORS_ORIGIN=https://jobhunt.com
FRONTEND_URL=https://jobhunt.com
DEBUG_MODE=false
VERBOSE_LOGGING=false
```

---

## ⚠️ **SECURITY BEST PRACTICES**

### **🔐 Critical Security Variables**
```env
# NEVER use default values in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret-key
SESSION_SECRET=your-session-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key
```

### **🛡️ Security Checklist**
- ✅ Use strong, unique secrets for production
- ✅ Never commit `.env` files to version control
- ✅ Regularly rotate API keys and secrets
- ✅ Use different values for each environment
- ✅ Keep sensitive information encrypted
- ✅ Monitor access to environment variables
- ✅ Use environment-specific configuration files

---

## 📋 **SETUP INSTRUCTIONS**

### **1. Backend Setup:**
```bash
# Navigate to backend directory
cd jobHunt/jobHunt/backend

# Create .env file
touch .env

# Copy variables from this guide
# Fill in your actual values
```

### **2. Frontend Setup:**
```bash
# Navigate to frontend directory
cd jobHunt/jobHunt/frontend

# Create .env file
touch .env

# Add frontend-specific variables
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=JobHunt
VITE_APP_VERSION=1.0.0
```

### **3. Database Setup:**
```bash
# Install MongoDB
# Update MONGODB_URI in .env file
# Create database and collections
```

### **4. External Services:**
```bash
# Set up Cloudinary account
# Get API keys and update CLOUDINARY_* variables

# Set up email service (Gmail/SendGrid)
# Update SMTP_* or SENDGRID_API_KEY

# Set up LinkedIn API
# Get client ID and secret
# Update LINKEDIN_* variables
```

---

## 🎯 **QUICK START TEMPLATE**

### **Minimal .env for Development:**
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/jobhunt

# Authentication
JWT_SECRET=dev-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Email (Optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Storage (Optional for development)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

---

## 📞 **SUPPORT**

If you need help with environment variables:

1. **Check the documentation** for each service
2. **Verify API keys** are correct and active
3. **Test connections** to external services
4. **Check logs** for specific error messages
5. **Contact support** if issues persist

---

*This guide covers all environment variables needed for the JobHunt platform. Customize based on your specific requirements and deployment environment.*
