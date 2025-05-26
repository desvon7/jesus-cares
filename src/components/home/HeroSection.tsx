
import React from 'react';
import { motion } from 'framer-motion';
import Bible3D from '@/components/Bible3D';
import ChatPrompt from '@/components/home/ChatPrompt';

const HeroSection: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full max-w-5xl mx-auto px-6 pt-16 pb-24 text-center"
    >
      <div className="mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-6 leading-tight tracking-tight">
          Find spiritual comfort through <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">Scripture</span>
        </h1>
        <p className="text-lg md:text-xl text-[#86868B] dark:text-[#A1A1A6] max-w-2xl mx-auto">
          Ask a question about life's challenges and receive compassionate answers grounded in Biblical wisdom.
        </p>
      </div>

      {/* 3D Bible Display */}
      <div className="w-full max-w-md mx-auto mb-12">
        <Bible3D size="md" />
      </div>

      {/* Main Chat Prompt */}
      <div className="w-full max-w-2xl mx-auto">
        <ChatPrompt />
      </div>
    </motion.section>
  );
};

export default HeroSection;
