
import React from 'react';

interface VersesErrorStateProps {
  error: string;
}

export const VersesErrorState: React.FC<VersesErrorStateProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-md mx-auto p-6">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-600 dark:text-red-400 text-xl">!</span>
        </div>
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Try selecting a different version like KJV, NIV, or ESV</p>
      </div>
    </div>
  );
};
