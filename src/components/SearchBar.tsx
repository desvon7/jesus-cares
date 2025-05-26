
import React from 'react';
import { ArrowRight } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-12">
      <div className="relative flex items-center bg-adam-light-gray rounded-full p-1 pl-4 pr-1 glow-pink">
        <div className="flex items-center text-white/60 mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Start building with Adam..." 
          className="flex-grow bg-transparent text-white py-3 focus:outline-none"
        />
        <button className="bg-adam-pink rounded-full p-3 transition-all duration-300 hover:bg-opacity-80">
          <ArrowRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
