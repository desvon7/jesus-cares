
import React from 'react';
import { motion } from 'framer-motion';
import TopicGrid from '@/components/home/TopicGrid';

const ExploreTopics: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-32"
    >
      <h2 className="text-2xl font-semibold mb-10">Explore by Topic</h2>
      <TopicGrid />
    </motion.div>
  );
};

export default ExploreTopics;
