
import React from 'react';
import { motion } from 'framer-motion';
import TestimonyCard from '@/components/home/TestimonyCard';

const TestimonialSection: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-32"
    >
      <h2 className="text-2xl font-semibold mb-10">Finding Light in Scripture</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TestimonyCard 
          quote="I was struggling with anxiety and this app gave me exactly the verses I needed."
          author="Sarah K."
          topic="Anxiety"
        />
        <TestimonyCard 
          quote="The daily verse has become part of my morning routine. It's changed my perspective."
          author="Michael T."
          topic="Daily Inspiration"
        />
        <TestimonyCard 
          quote="When I felt lost, the guidance here helped me find direction through Scripture."
          author="Rebecca L."
          topic="Purpose"
        />
      </div>
    </motion.div>
  );
};

export default TestimonialSection;
