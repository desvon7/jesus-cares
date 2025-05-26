
import React from 'react';
import Bible3D from '../Bible3D';

const ModelViewer: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-[#EDE9FE]/50 to-[#A5F3FC]/50">
      <div className="w-full max-w-2xl p-8">
        <Bible3D 
          size="lg" 
          interactive={true} 
          showControls={true} 
          className="glow-divine" 
          autoRotate={true} 
        />
      </div>
    </div>
  );
};

export default ModelViewer;
