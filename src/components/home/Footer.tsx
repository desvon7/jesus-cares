
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 px-6 border-t border-[#E7E7E8] dark:border-[#2C2C2E]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">J</span>
          </div>
          <span className="font-medium">Jesus Cares</span>
        </div>
        
        <div className="flex flex-wrap gap-8 justify-center">
          <Link to="/about" className="text-[#86868B] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white transition-colors">About</Link>
          <Link to="/privacy" className="text-[#86868B] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white transition-colors">Privacy</Link>
          <Link to="/terms" className="text-[#86868B] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white transition-colors">Terms</Link>
          <a href="#" className="text-[#86868B] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-white transition-colors">Contact</a>
        </div>
        
        <div className="mt-6 md:mt-0 text-sm text-[#86868B] dark:text-[#A1A1A6]">
          © 2025 Jesus Cares. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
