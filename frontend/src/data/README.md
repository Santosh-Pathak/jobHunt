# Static Data for JobHunt

This directory contains static data used throughout the JobHunt application to provide a better user experience when real data is not available.

## Files

### `staticData.js`

Contains all static data used across the application:

#### Job Categories
- Array of job categories with icons, descriptions, and job counts
- Used in CategoryCarousel component
- Includes categories like Frontend Developer, Backend Developer, Data Science, etc.

#### Sample Jobs
- Array of sample job postings with realistic data
- Used in LatestJobs and Browse components when no real jobs are available
- Includes job details like title, company, location, salary, requirements

#### Featured Companies
- Array of well-known companies with logos and basic information
- Used in FeaturedCompanies component
- Includes companies like Google, Microsoft, Apple, Amazon, etc.

#### Testimonials
- Array of user testimonials with ratings and user information
- Used in Testimonials component
- Includes user photos, names, roles, and company information

#### Statistics
- Platform statistics like total jobs, companies, users, and success rate
- Used in HeroSection component
- Provides credibility and social proof

#### Benefits
- Array of platform benefits with icons and descriptions
- Used in Benefits component
- Highlights key features like smart matching, quick apply, analytics, etc.

## Usage

Import the data you need in your components:

```javascript
import { jobCategories, sampleJobs, featuredCompanies } from '@/data/staticData';
```

## Data Structure

All data follows consistent patterns:
- Each item has a unique `id` or `_id`
- Images use Unsplash URLs for consistent styling
- Text content is realistic and professional
- Data includes all necessary fields for proper component rendering

## Customization

You can easily modify the static data to:
- Add more job categories
- Update company information
- Add new testimonials
- Modify statistics
- Add new benefits

The data is designed to be easily maintainable and extensible.
