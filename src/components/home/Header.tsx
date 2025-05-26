
import React from 'react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
          <span className="text-lg font-medium text-white">J</span>
        </div>
        <h1 className="text-xl font-medium">Jesus Cares</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-[#1D1D1F] dark:text-[#F5F5F7] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full px-4">
          Sign In
        </Button>
        <Button size="sm" className="bg-[#1D1D1F] text-white dark:bg-white dark:text-[#1D1D1F] hover:bg-black dark:hover:bg-[#F5F5F7] rounded-full px-4">
          Sign Up
        </Button>
      </div>
    </header>
  );
};

export default Header;
