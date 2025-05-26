
import React from 'react';
import { motion } from 'framer-motion';

interface SuggestedPromptProps {
  text: string;
  onClick: () => void;
}

const SuggestedPrompt: React.FC<SuggestedPromptProps> = ({ text, onClick }) => {
  return (
    <motion.button 
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="px-4 py-1.5 bg-[#F3F3F3] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#333333] rounded-full text-sm text-slate-700 dark:text-slate-300 hover:bg-[#EAEAEA] dark:hover:bg-[#222222] transition-colors whitespace-nowrap shadow-sm"
    >
      {text}
    </motion.button>
  );
};

export default SuggestedPrompt;
