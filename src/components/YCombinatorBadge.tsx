
import React from 'react';

const YCombinatorBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mt-10">
      <div className="text-sm text-white/60">Backed by</div>
      <div className="flex items-center">
        <div className="h-6 w-6 bg-[#ff6600] flex items-center justify-center rounded-sm text-white font-bold">
          Y
        </div>
        <span className="ml-2 text-white font-medium">Combinator</span>
      </div>
    </div>
  );
};

export default YCombinatorBadge;
