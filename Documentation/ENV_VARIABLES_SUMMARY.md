# 🌍 JobHunt Platform - Environment Variables Summary

## 📋 **QUICK REFERENCE**

This document provides a structured overview of all environment variables needed for the JobHunt platform, organized by category and priority.

---

## 🚀 **ESSENTIAL VARIABLES (Required for Basic Functionality)**

### **Backend (.env)**
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/jobhunt

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend Connection
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### **Frontend (.env)**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Application Info
VITE_APP_NAME=JobHunt
VITE_APP_VERSION=1.0.0
```

---

## 📊 **CATEGORIZED ENVIRONMENT VARIABLES**

### **🌐 SERVER CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | ✅ | `development` |
| `PORT` | Server port | ✅ | `5000` |
| `HOST` | Server host | ❌ | `localhost` |
| `ENVIRONMENT` | Environment identifier | ❌ | `development` |

### **🗄️ DATABASE CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | ✅ | - |
| `MONGODB_TEST_URI` | Test database URI | ❌ | - |
| `DB_CONNECTION_TIMEOUT` | Connection timeout | ❌ | `30000` |
| `DB_MAX_POOL_SIZE` | Max connection pool size | ❌ | `10` |
| `DB_MIN_POOL_SIZE` | Min connection pool size | ❌ | `5` |

### **🔐 AUTHENTICATION & SECURITY**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `JWT_SECRET` | JWT signing secret | ✅ | - |
| `JWT_EXPIRES_IN` | JWT expiration time | ✅ | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | ❌ | - |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | ❌ | `30d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | ❌ | `12` |
| `SESSION_SECRET` | Session secret key | ❌ | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | ❌ | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | ❌ | `100` |

### **📧 EMAIL CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SMTP_HOST` | SMTP server host | ✅ | - |
| `SMTP_PORT` | SMTP server port | ✅ | `587` |
| `SMTP_USER` | SMTP username | ✅ | - |
| `SMTP_PASS` | SMTP password | ✅ | - |
| `SMTP_SECURE` | Use SSL/TLS | ❌ | `false` |
| `EMAIL_FROM_NAME` | Sender name | ❌ | `JobHunt Platform` |
| `EMAIL_FROM_ADDRESS` | Sender email | ❌ | `noreply@jobhunt.com` |

### **☁️ FILE STORAGE & UPLOADS**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ | - |
| `MAX_FILE_SIZE` | Max file upload size | ❌ | `10485760` |
| `ALLOWED_FILE_TYPES` | Allowed file extensions | ❌ | `pdf,doc,docx,jpg,jpeg,png,gif,webp` |

### **🔗 EXTERNAL API INTEGRATIONS**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | ❌ | - |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth secret | ❌ | - |
| `LINKEDIN_REDIRECT_URI` | LinkedIn callback URL | ❌ | - |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ | - |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ❌ | - |
| `OPENAI_API_KEY` | OpenAI API key | ❌ | - |
| `GEMINI_API_KEY` | Google Gemini API key | ❌ | - |

### **🌐 FRONTEND CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `FRONTEND_URL` | Frontend application URL | ✅ | `http://localhost:5173` |
| `CORS_ORIGIN` | CORS allowed origin | ✅ | `http://localhost:5173` |
| `CORS_CREDENTIALS` | Allow credentials in CORS | ❌ | `true` |
| `ALLOWED_ORIGINS` | Multiple allowed origins | ❌ | - |

### **🔍 SEARCH & INDEXING**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REDIS_URL` | Redis connection URL | ❌ | `redis://localhost:6379` |
| `CACHE_TTL` | Cache time-to-live | ❌ | `3600` |
| `ELASTICSEARCH_URL` | Elasticsearch URL | ❌ | - |
| `ELASTICSEARCH_INDEX_NAME` | Elasticsearch index | ❌ | - |

### **🔔 NOTIFICATION SERVICES**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `FCM_SERVER_KEY` | Firebase Cloud Messaging key | ❌ | - |
| `FCM_PROJECT_ID` | Firebase project ID | ❌ | - |
| `PUSH_NOTIFICATION_ENABLED` | Enable push notifications | ❌ | `true` |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | ❌ | - |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | ❌ | - |

### **📊 ANALYTICS & MONITORING**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_ANALYTICS_ID` | Google Analytics ID | ❌ | - |
| `SENTRY_DSN` | Sentry error tracking DSN | ❌ | - |
| `LOG_LEVEL` | Logging level | ❌ | `info` |
| `METRICS_ENABLED` | Enable metrics collection | ❌ | `true` |
| `HEALTH_CHECK_ENDPOINT` | Health check endpoint | ❌ | `/health` |

### **🎯 FEATURE TOGGLES**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ENABLE_CHAT` | Enable chat functionality | ❌ | `true` |
| `ENABLE_ANALYTICS` | Enable analytics | ❌ | `true` |
| `ENABLE_SOCIAL_FEATURES` | Enable social features | ❌ | `true` |
| `ENABLE_AI_RECOMMENDATIONS` | Enable AI recommendations | ❌ | `true` |
| `FEATURE_REGISTRATION` | Enable user registration | ❌ | `true` |
| `FEATURE_SOCIAL_LOGIN` | Enable social login | ❌ | `true` |
| `FEATURE_EMAIL_VERIFICATION` | Enable email verification | ❌ | `true` |
| `FEATURE_TWO_FACTOR_AUTH` | Enable 2FA | ❌ | `false` |

### **🛡️ SECURITY CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `HELMET_CSP_ENABLED` | Enable Content Security Policy | ❌ | `true` |
| `HELMET_HSTS_ENABLED` | Enable HTTP Strict Transport Security | ❌ | `true` |
| `API_KEY_HEADER` | API key header name | ❌ | `x-api-key` |
| `ENCRYPTION_KEY` | Data encryption key | ❌ | - |
| `ENCRYPTION_ALGORITHM` | Encryption algorithm | ❌ | `aes-256-gcm` |

### **🧪 TESTING CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `TEST_DB_URI` | Test database URI | ❌ | - |
| `TEST_EMAIL` | Test email address | ❌ | - |
| `TEST_JWT_SECRET` | Test JWT secret | ❌ | - |
| `TEST_CLOUDINARY_CLOUD_NAME` | Test Cloudinary cloud | ❌ | - |

### **📱 MOBILE APP CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MOBILE_APP_VERSION` | Mobile app version | ❌ | `1.0.0` |
| `MOBILE_API_VERSION` | Mobile API version | ❌ | `v1` |
| `PWA_ENABLED` | Enable Progressive Web App | ❌ | `true` |
| `OFFLINE_SUPPORT` | Enable offline support | ❌ | `true` |

### **🌍 INTERNATIONALIZATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DEFAULT_LANGUAGE` | Default language | ❌ | `en` |
| `SUPPORTED_LANGUAGES` | Supported languages | ❌ | `en,es,fr,de,it,pt,ru,zh,ja,ko` |
| `DEFAULT_TIMEZONE` | Default timezone | ❌ | `UTC` |

### **💰 BUSINESS CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `FREE_PLAN_JOB_LIMIT` | Free plan job limit | ❌ | `5` |
| `PREMIUM_PLAN_JOB_LIMIT` | Premium plan job limit | ❌ | `50` |
| `ENTERPRISE_PLAN_JOB_LIMIT` | Enterprise plan job limit | ❌ | `unlimited` |

### **🔧 MAINTENANCE MODE**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MAINTENANCE_MODE` | Enable maintenance mode | ❌ | `false` |
| `MAINTENANCE_MESSAGE` | Maintenance message | ❌ | - |
| `MAINTENANCE_ALLOWED_IPS` | Allowed IPs during maintenance | ❌ | - |

### **📞 SUPPORT & CONTACT**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SUPPORT_EMAIL` | Support email address | ❌ | `support@jobhunt.com` |
| `SUPPORT_PHONE` | Support phone number | ❌ | - |
| `CONTACT_EMAIL` | Contact email address | ❌ | `contact@jobhunt.com` |
| `SUPPORT_CHAT_ENABLED` | Enable support chat | ❌ | `true` |

### **📋 COMPLIANCE & LEGAL**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GDPR_COMPLIANCE` | Enable GDPR compliance | ❌ | `true` |
| `COOKIE_CONSENT_REQUIRED` | Require cookie consent | ❌ | `true` |
| `DATA_RETENTION_DAYS` | Data retention period | ❌ | `2555` |
| `TERMS_OF_SERVICE_URL` | Terms of service URL | ❌ | - |
| `PRIVACY_POLICY_URL` | Privacy policy URL | ❌ | - |

### **🎨 UI/UX CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DEFAULT_THEME` | Default theme | ❌ | `light` |
| `THEME_PERSISTENCE` | Persist theme selection | ❌ | `true` |
| `ANIMATIONS_ENABLED` | Enable animations | ❌ | `true` |
| `DARK_MODE_ENABLED` | Enable dark mode | ❌ | `true` |
| `ACCESSIBILITY_ENHANCED` | Enhanced accessibility | ❌ | `true` |

### **📊 PERFORMANCE CONFIGURATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REQUEST_TIMEOUT` | Request timeout | ❌ | `30000` |
| `UPLOAD_TIMEOUT` | Upload timeout | ❌ | `300000` |
| `DB_POOL_SIZE` | Database pool size | ❌ | `10` |
| `DB_POOL_MIN` | Min database connections | ❌ | `2` |
| `DB_POOL_MAX` | Max database connections | ❌ | `20` |

### **🚨 ALERTING & NOTIFICATIONS**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ALERT_EMAIL` | Alert email address | ❌ | - |
| `ALERT_SLACK_WEBHOOK` | Slack webhook URL | ❌ | - |
| `ERROR_REPORTING_ENABLED` | Enable error reporting | ❌ | `true` |
| `ERROR_REPORTING_EMAIL` | Error reporting email | ❌ | - |

### **📝 DOCUMENTATION**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `API_DOCS_ENABLED` | Enable API documentation | ❌ | `true` |
| `API_DOCS_URL` | API documentation URL | ❌ | - |
| `SWAGGER_ENABLED` | Enable Swagger UI | ❌ | `true` |

### **📋 BACKUP & RECOVERY**
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `BACKUP_ENABLED` | Enable backups | ❌ | `true` |
| `BACKUP_SCHEDULE` | Backup schedule (cron) | ❌ | `0 2 * * *` |
| `BACKUP_RETENTION_DAYS` | Backup retention period | ❌ | `30` |
| `RECOVERY_EMAIL` | Recovery email address | ❌ | - |

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
FRONTEND_URL=http://localhost:5173
```

### **🧪 Staging Environment**
```env
NODE_ENV=staging
PORT=5000
MONGODB_URI=mongodb://staging-server:27017/jobhunt_staging
DEBUG_MODE=false
CORS_ORIGIN=https://staging.jobhunt.com
FRONTEND_URL=https://staging.jobhunt.com
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

## ⚠️ **SECURITY CHECKLIST**

### **🔐 Critical Security Variables**
- ✅ `JWT_SECRET` - Use strong, unique secret
- ✅ `JWT_REFRESH_SECRET` - Different from JWT_SECRET
- ✅ `SESSION_SECRET` - Unique session secret
- ✅ `ENCRYPTION_KEY` - 32-character encryption key
- ✅ `BCRYPT_ROUNDS` - Minimum 12 rounds

### **🛡️ Security Best Practices**
- ✅ Never commit `.env` files to version control
- ✅ Use strong, unique secrets for production
- ✅ Regularly rotate API keys and secrets
- ✅ Use different values for each environment
- ✅ Keep sensitive information encrypted
- ✅ Monitor access to environment variables
- ✅ Use environment-specific configuration files

---

## 📋 **SETUP INSTRUCTIONS**

### **1. Backend Setup**
```bash
# Navigate to backend directory
cd jobHunt/jobHunt/backend

# Create .env file
touch .env

# Copy essential variables
echo "NODE_ENV=development" >> .env
echo "PORT=5000" >> .env
echo "MONGODB_URI=mongodb://localhost:27017/jobhunt" >> .env
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" >> .env
echo "FRONTEND_URL=http://localhost:5173" >> .env
echo "CORS_ORIGIN=http://localhost:5173" >> .env
```

### **2. Frontend Setup**
```bash
# Navigate to frontend directory
cd jobHunt/jobHunt/frontend

# Create .env file
touch .env

# Copy essential variables
echo "VITE_API_BASE_URL=http://localhost:5000/api/v1" >> .env
echo "VITE_APP_NAME=JobHunt" >> .env
echo "VITE_APP_VERSION=1.0.0" >> .env
```

### **3. External Services Setup**
```bash
# Set up MongoDB
# Update MONGODB_URI in .env file

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

### **Minimal Backend .env**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobhunt
JWT_SECRET=dev-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

### **Minimal Frontend .env**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=JobHunt
VITE_APP_VERSION=1.0.0
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
