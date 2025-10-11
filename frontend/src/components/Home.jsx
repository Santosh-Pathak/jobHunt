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
  const { isDark } = useTheme();

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen transition-all duration-500 bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Static navbar */}
      <Navbar />

      {/* Main content with proper spacing and sections */}
      <div className="relative">
        {/* Hero Section */}
        <motion.div variants={sectionVariants}>
          <HeroSection />
        </motion.div>

        {/* Popular Job Categories */}
        <motion.div variants={sectionVariants}>
          <CategoryCarousel />
        </motion.div>

        {/* Latest Jobs */}
        <motion.div variants={sectionVariants}>
          <LatestJobs />
        </motion.div>

        {/* Featured Companies */}
        <motion.div variants={sectionVariants}>
          <FeaturedCompanies />
        </motion.div>

        {/* Benefits Section */}
        <motion.div variants={sectionVariants}>
          <Benefits />
        </motion.div>

        {/* Testimonials */}
        <motion.div variants={sectionVariants}>
          <Testimonials />
        </motion.div>

        {/* Footer */}
        <motion.div variants={sectionVariants}>
          <Footer />
        </motion.div>
      </div>

      {/* Chat Boat */}
      <ChatBoat />
    </motion.div>
  );
};

export default Home;
