
import React from 'react';

interface ExampleChipProps {
  text: string;
}

const ExampleChip: React.FC<ExampleChipProps> = ({ text }) => {
  return (
    <div className="example-chips bg-adam-gray/50 text-white text-sm px-4 py-3 rounded-md">
      {text}
    </div>
  );
};

export default ExampleChip;
