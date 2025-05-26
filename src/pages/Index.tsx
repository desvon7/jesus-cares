
import React from 'react';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import ExploreTopics from '@/components/home/ExploreTopics';
import TestimonialSection from '@/components/home/TestimonialSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/home/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1D1D1F] dark:bg-[#000000] dark:text-[#F5F5F7]">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
