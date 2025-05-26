
import React from 'react';

export const VersesLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading Scripture...</p>
      </div>
    </div>
  );
};
