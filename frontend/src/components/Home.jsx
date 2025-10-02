import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import FeaturedCompanies from './FeaturedCompanies';
import Benefits from './Benefits';
import Testimonials from './Testimonials';
import Footer from './shared/Footer';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatBoat from './ChatBoat';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  return (
    <motion.div
      className={`min-h-screen transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900' 
          : 'bg-gradient-to-br from-white via-blue-50 to-emerald-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Static navbar */}
      <Navbar />

      {/* Main content */}
      <div className="relative">
        <HeroSection />
        <CategoryCarousel />
        <LatestJobs />
        <FeaturedCompanies />
        <Benefits />
        <Testimonials />
        <Footer />
      </div>
      <ChatBoat />
    </motion.div>
  );
};

export default Home;
