import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import './App.css'
import UpdateJobs from './components/admin/UpdateJobs'
import AdminDashboard from './components/admin/AdminDashboard'
import SkipLinks from './components/shared/SkipLinks'
import ScreenReaderAnnouncement from './components/shared/ScreenReaderAnnouncement'
import AccessibilitySettings from './components/shared/AccessibilitySettings'
import LinkedInImport from './components/LinkedInImport'
import EnhancedJobSearch from './components/EnhancedJobSearch'
import ApplicationDraft from './components/ApplicationDraft'
import ResumeBuilder from './components/ResumeBuilder'
import InterviewScheduler from './components/InterviewScheduler'
import JobAlerts from './components/JobAlerts'
import SocialFeatures from './components/SocialFeatures'
import ChatSystem from './components/ChatSystem'
import JobSeekerDashboard from './components/JobSeekerDashboard'
import AdvancedATS from './components/admin/AdvancedATS'
import BulkOperations from './components/admin/BulkOperations'
import ContentModeration from './components/admin/ContentModeration'
import SystemMonitoring from './components/admin/SystemMonitoring'
import useKeyboardNavigation from './hooks/useKeyboardNavigation'
import { ThemeProvider } from './contexts/ThemeContext'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/admin/dashboard",
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
  },
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id/edit",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/update",
    element: <ProtectedRoute><UpdateJobs /></ProtectedRoute>
  },
  {
    path: "/accessibility",
    element: <AccessibilitySettings />
  },
  {
    path: "/linkedin-import",
    element: <LinkedInImport />
  },
  {
    path: "/enhanced-search",
    element: <EnhancedJobSearch />
  },
  {
    path: "/application-draft",
    element: <ApplicationDraft />
  },
  {
    path: "/resume-builder",
    element: <ResumeBuilder />
  },
  {
    path: "/interview-scheduler",
    element: <InterviewScheduler />
  },
  {
    path: "/job-alerts",
    element: <JobAlerts />
  },
  {
    path: "/social-features",
    element: <SocialFeatures />
  },
  {
    path: "/chat-system",
    element: <ChatSystem />
  },
  {
    path: "/dashboard",
    element: <JobSeekerDashboard />
  },
  {
    path: "/admin/advanced-ats",
    element: <ProtectedRoute><AdvancedATS /></ProtectedRoute>
  },
  {
    path: "/admin/bulk-operations",
    element: <ProtectedRoute><BulkOperations /></ProtectedRoute>
  },
  {
    path: "/admin/content-moderation",
    element: <ProtectedRoute><ContentModeration /></ProtectedRoute>
  },
  {
    path: "/admin/system-monitoring",
    element: <ProtectedRoute><SystemMonitoring /></ProtectedRoute>
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

])
function App() {
  // Global keyboard shortcuts
  useKeyboardNavigation({
    'ctrl+t': () => {
      // Toggle theme - handled by ThemeContext
      const event = new CustomEvent('toggleTheme');
      window.dispatchEvent(event);
    },
    'ctrl+k': () => {
      // Focus search
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]');
      if (searchInput) {
        searchInput.focus();
      }
    },
    'escape': () => {
      // Close any open modals or dialogs
      const modals = document.querySelectorAll('[role="dialog"]');
      modals.forEach(modal => {
        if (modal.style.display !== 'none') {
          const closeButton = modal.querySelector('button[aria-label*="close" i], button[aria-label*="cancel" i]');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    }
  });

  return (
    <ThemeProvider>
      <div className='app'>
        <SkipLinks />
        <ScreenReaderAnnouncement message="" />
        <RouterProvider router={ appRouter } />
      </div>
    </ThemeProvider>
  )
}

export default App
