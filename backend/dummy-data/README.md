# JobHunt Dummy Data Collection

This directory contains comprehensive dummy data for the JobHunt application, designed to showcase a fully functional demo with interconnected data across all collections.

## 📁 Data Structure

### Collections Overview

| Collection | File | Records | Description |
|------------|------|---------|-------------|
| **Users** | `users.json` | 12 | Recruiters and job seekers with complete profiles |
| **Companies** | `companies.json` | 9 | Tech companies with detailed information |
| **Jobs** | `jobs.json` | 18 | Job postings across various roles and companies |
| **Applications** | `applications.json` | 11 | Job applications with status tracking |
| **Reviews** | `reviews.json` | 10 | Company reviews from employees |
| **Notifications** | `notifications.json` | 12 | User notifications and alerts |
| **JobAlerts** | `jobAlerts.json` | 10 | Personalized job alert configurations |
| **Interviews** | `interviews.json` | 11 | Interview scheduling and management |

## 🔗 Data Relationships

### User Types
- **Recruiters (2)**: Sarah Johnson (TechCorp), Michael Chen (InnovateAI)
- **Job Seekers (10)**: Diverse profiles with different skills and experience levels

### Company Profiles
- **TechCorp Solutions**: Enterprise software, 1000-5000 employees
- **InnovateAI**: AI/ML company, 100-500 employees
- **DesignStudio Pro**: Creative agency, 50-100 employees
- **CloudTech Solutions**: Cloud infrastructure, 200-500 employees
- **MobileFirst Inc**: Mobile development, 50-200 employees
- **ProductLab**: Product management consultancy, 20-50 employees
- **SecureTech Corp**: Cybersecurity, 100-300 employees
- **BackendPro Inc**: Backend development, 75-150 employees
- **FrontendStudio**: Frontend development, 30-75 employees
- **DataInsights Corp**: Data science, 150-400 employees

### Job Categories
- **Full Stack Development**: React, Node.js, JavaScript
- **Data Science**: Python, Machine Learning, Analytics
- **UI/UX Design**: Figma, Adobe Creative Suite, User Research
- **DevOps**: AWS, Docker, Kubernetes, CI/CD
- **Mobile Development**: React Native, Flutter, iOS, Android
- **Product Management**: Agile, User Research, Data Analysis
- **Cybersecurity**: Penetration Testing, Security Analysis
- **Backend Development**: Java, Spring Boot, Microservices
- **Frontend Development**: React, Vue.js, TypeScript, CSS

## 🎯 Demo Scenarios

### 1. Job Seeker Journey
- **Alex Rodriguez**: Full Stack Developer looking for senior positions
- **Priya Sharma**: Data Scientist with ML expertise
- **David Kim**: UI/UX Designer with creative portfolio
- **Emily Watson**: DevOps Engineer with cloud experience

### 2. Recruiter Workflow
- **Sarah Johnson**: TechCorp recruiter managing full-stack positions
- **Michael Chen**: InnovateAI recruiter focused on AI/ML roles

### 3. Application Flow
- Applications in various stages: Applied, Under Review, Interview Scheduled
- Interview scheduling with different types: Technical, Behavioral, Design
- Status updates and notifications

### 4. Company Reviews
- Authentic employee reviews with ratings
- Detailed pros and cons for each company
- Work-life balance, culture, compensation ratings

## 📊 Key Features Demonstrated

### User Profiles
- Complete profile information with skills, education, experience
- Portfolio links and certifications
- Job preferences and location preferences
- Analytics tracking (profile views, applications, completeness)

### Job Postings
- Detailed job descriptions with requirements
- Salary ranges and benefits
- Company information and culture
- Application tracking and analytics

### Application Management
- Cover letters and resume attachments
- Application status tracking
- Interview scheduling and feedback
- Notes and recommendations

### Notifications System
- Job match notifications
- Application status updates
- Interview scheduling alerts
- Profile view notifications

### Job Alerts
- Personalized alert configurations
- Keyword and location-based filtering
- Salary range and experience level filters
- Frequency settings (daily, weekly)

## 🚀 How to Use

### 1. Import Data
```bash
# Import users
mongoimport --db jobhunt --collection users --file users.json --jsonArray

# Import companies
mongoimport --db jobhunt --collection companies --file companies.json --jsonArray

# Import jobs
mongoimport --db jobhunt --collection jobs --file jobs.json --jsonArray

# Import applications
mongoimport --db jobhunt --collection applications --file applications.json --jsonArray

# Import reviews
mongoimport --db jobhunt --collection reviews --file reviews.json --jsonArray

# Import notifications
mongoimport --db jobhunt --collection notifications --file notifications.json --jsonArray

# Import job alerts
mongoimport --db jobhunt --collection jobalerts --file jobAlerts.json --jsonArray

# Import interviews
mongoimport --db jobhunt --collection interviews --file interviews.json --jsonArray
```

### 2. Test Scenarios

#### Job Seeker Login
- **Email**: alex.rodriguez@gmail.com
- **Role**: student
- **Saved Jobs**: 2 jobs saved
- **Applications**: 2 applications submitted

#### Recruiter Login
- **Email**: sarah.johnson@techcorp.com
- **Role**: recruiter
- **Company**: TechCorp Solutions
- **Posted Jobs**: 2 active positions

### 3. Demo Features

#### Search and Filter
- Search by job title, company, skills
- Filter by location, job type, experience level
- Salary range filtering
- Remote work options

#### Application Tracking
- View application status
- Track interview progress
- Receive status updates
- Manage saved jobs

#### Company Reviews
- Read authentic employee reviews
- Compare company ratings
- View detailed pros and cons
- Check work-life balance scores

## 📈 Analytics Data

### User Analytics
- Profile views and completeness scores
- Job application counts
- Saved jobs tracking
- Search history

### Job Analytics
- View counts and application rates
- Save counts and popularity metrics
- Company performance tracking
- Industry trends

### Company Analytics
- Total jobs posted and active positions
- Application volumes and success rates
- Average ratings and review counts
- Recruiter activity tracking

## 🔧 Customization

### Adding New Data
1. Follow the existing schema patterns
2. Maintain referential integrity with ObjectIds
3. Include realistic timestamps and status values
4. Ensure data consistency across collections

### Modifying Existing Data
1. Update related records when changing IDs
2. Maintain data relationships
3. Update timestamps appropriately
4. Validate data integrity

## 📝 Notes

- All ObjectIds are consistent across collections
- Timestamps are realistic and recent
- Data includes both active and completed states
- Reviews and ratings are authentic and varied
- Notifications include different types and priorities
- Job alerts cover various skill sets and locations

This dummy data provides a comprehensive foundation for demonstrating all features of the JobHunt application with realistic, interconnected information that showcases the platform's capabilities effectively.
