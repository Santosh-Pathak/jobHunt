// Static data for better UI presentation
export const jobCategories = [
  {
    id: 1,
    name: "Frontend Developer",
    icon: "💻",
    description: "Build beautiful user interfaces",
    count: 1250
  },
  {
    id: 2,
    name: "Backend Developer",
    icon: "⚙️",
    description: "Power the backend systems",
    count: 980
  },
  {
    id: 3,
    name: "Data Science",
    icon: "📊",
    description: "Extract insights from data",
    count: 750
  },
  {
    id: 4,
    name: "Graphic Designer",
    icon: "🎨",
    description: "Create stunning visuals",
    count: 650
  },
  {
    id: 5,
    name: "Full Stack Developer",
    icon: "🚀",
    description: "End-to-end development",
    count: 1100
  },
  {
    id: 6,
    name: "Mobile Developer",
    icon: "📱",
    description: "iOS & Android apps",
    count: 850
  },
  {
    id: 7,
    name: "DevOps Engineer",
    icon: "🔧",
    description: "Deploy & scale systems",
    count: 720
  },
  {
    id: 8,
    name: "UI/UX Designer",
    icon: "✨",
    description: "Design user experiences",
    count: 680
  },
  {
    id: 9,
    name: "Product Manager",
    icon: "📋",
    description: "Lead product strategy",
    count: 420
  },
  {
    id: 10,
    name: "Cybersecurity",
    icon: "🔒",
    description: "Protect digital assets",
    count: 580
  }
];

export const sampleJobs = [
  {
    _id: "job_1",
    title: "Senior Frontend Developer",
    company: {
      name: "TechCorp Solutions",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
    },
    location: "San Francisco, CA",
    salary: "120000-150000",
    position: 2,
    jobType: "Full-time",
    category: "Frontend Developer",
    description: "We're looking for a senior frontend developer to join our team and help build amazing user experiences.",
    requirements: ["React", "TypeScript", "CSS", "5+ years experience"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    featured: true,
    urgent: false
  },
  {
    _id: "job_2",
    title: "Backend Engineer",
    company: {
      name: "StartupXYZ",
      logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop"
    },
    location: "New York, NY",
    salary: "100000-130000",
    position: 1,
    jobType: "Full-time",
    category: "Backend Developer",
    description: "Join our fast-growing fintech startup and help build scalable backend systems.",
    requirements: ["Node.js", "Python", "AWS", "3+ years experience"],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    featured: true,
    urgent: true
  },
  {
    _id: "job_3",
    title: "Data Scientist",
    company: {
      name: "AI Innovations Lab",
      logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop"
    },
    location: "Boston, MA",
    salary: "110000-140000",
    position: 3,
    jobType: "Full-time",
    category: "Data Science",
    description: "Work on cutting-edge machine learning projects and help shape the future of AI.",
    requirements: ["Python", "Machine Learning", "TensorFlow", "PhD preferred"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    featured: false,
    urgent: false
  },
  {
    _id: "job_4",
    title: "UI/UX Designer",
    company: {
      name: "DesignStudio Pro",
      logo: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=100&h=100&fit=crop"
    },
    location: "Seattle, WA",
    salary: "80000-110000",
    position: 2,
    jobType: "Full-time",
    category: "UI/UX Designer",
    description: "Create beautiful and intuitive user interfaces for our digital products.",
    requirements: ["Figma", "Adobe Creative Suite", "User Research", "3+ years experience"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    featured: true,
    urgent: false
  },
  {
    _id: "job_5",
    title: "Full Stack Developer",
    company: {
      name: "CloudScale Technologies",
      logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop"
    },
    location: "Austin, TX",
    salary: "95000-125000",
    position: 1,
    jobType: "Full-time",
    category: "Full Stack Developer",
    description: "Build end-to-end web applications using modern technologies and best practices.",
    requirements: ["React", "Node.js", "MongoDB", "AWS", "4+ years experience"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    featured: false,
    urgent: false
  },
  {
    _id: "job_6",
    title: "Mobile App Developer",
    company: {
      name: "MobileFirst Inc",
      logo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100&h=100&fit=crop"
    },
    location: "Los Angeles, CA",
    salary: "90000-120000",
    position: 2,
    jobType: "Full-time",
    category: "Mobile Developer",
    description: "Develop cross-platform mobile applications using React Native and Flutter.",
    requirements: ["React Native", "Flutter", "iOS", "Android", "3+ years experience"],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    featured: true,
    urgent: false
  }
];

export const featuredCompanies = [
  {
    id: 1,
    name: "Google",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop",
    location: "Mountain View, CA",
    jobsCount: 250,
    rating: 4.8,
    description: "Leading technology company"
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=150&h=150&fit=crop",
    location: "Redmond, WA",
    jobsCount: 180,
    rating: 4.7,
    description: "Cloud and productivity solutions"
  },
  {
    id: 3,
    name: "Apple",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&h=150&fit=crop",
    location: "Cupertino, CA",
    jobsCount: 120,
    rating: 4.9,
    description: "Innovation in technology"
  },
  {
    id: 4,
    name: "Amazon",
    logo: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=150&h=150&fit=crop",
    location: "Seattle, WA",
    jobsCount: 300,
    rating: 4.6,
    description: "E-commerce and cloud services"
  },
  {
    id: 5,
    name: "Meta",
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&h=150&fit=crop",
    location: "Menlo Park, CA",
    jobsCount: 200,
    rating: 4.5,
    description: "Social media and VR technology"
  },
  {
    id: 6,
    name: "Netflix",
    logo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=150&h=150&fit=crop",
    location: "Los Gatos, CA",
    jobsCount: 80,
    rating: 4.7,
    description: "Streaming entertainment platform"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    content: "JobHunt helped me find my dream job at Google. The platform is intuitive and the job matching is spot-on!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Scientist",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "The AI-powered job recommendations are incredible. I found multiple relevant opportunities within days of signing up.",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UI/UX Designer",
    company: "Apple",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "As a designer, I love how JobHunt showcases company culture and values. It helped me find the perfect creative environment.",
    rating: 5
  }
];

export const statistics = {
  totalJobs: 12500,
  totalCompanies: 2500,
  totalUsers: 50000,
  successRate: 95
};

export const benefits = [
  {
    icon: "🎯",
    title: "Smart Matching",
    description: "AI-powered job matching based on your skills and preferences"
  },
  {
    icon: "⚡",
    title: "Quick Apply",
    description: "Apply to multiple jobs with just one click"
  },
  {
    icon: "📊",
    title: "Analytics",
    description: "Track your application progress and profile performance"
  },
  {
    icon: "🔔",
    title: "Job Alerts",
    description: "Get notified about new opportunities matching your criteria"
  },
  {
    icon: "💼",
    title: "Career Guidance",
    description: "Expert advice and resources to advance your career"
  },
  {
    icon: "🌐",
    title: "Global Opportunities",
    description: "Access to jobs from companies worldwide"
  }
];
