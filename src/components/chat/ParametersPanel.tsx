
import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, max, onChange }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-white">{label}</span>
        <span className="text-sm text-white">{value}</span>
      </div>
      <div className="relative h-1 bg-gray-700 rounded-full">
        <div 
          className="absolute h-1 bg-adam-pink rounded-full"
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
        />
        <div 
          className="absolute w-3 h-3 bg-adam-pink rounded-full -mt-1"
          style={{ left: `calc(${(value / max) * 100}% - 6px)` }}
        ></div>
      </div>
    </div>
  );
};

const ParametersPanel: React.FC = () => {
  const [parameters, setParameters] = React.useState({
    length: 100,
    width: 20,
    height: 20,
    holeDiameter: 8,
    holeSpacing: 15,
    filletRadius: 2
  });

  const updateParameter = (key: keyof typeof parameters, value: number) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="w-72 bg-adam-darker border-l border-white/10 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12h8M12 8v8"></path>
          </svg>
          <span className="text-sm font-medium text-white">Parameters</span>
        </div>
        <button className="text-white/70 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <path d="M15 3v18M3 15h18M3 9h18M9 3v18"></path>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Slider label="Length" value={parameters.length} max={150} onChange={(v) => updateParameter('length', v)} />
        <Slider label="Width" value={parameters.width} max={50} onChange={(v) => updateParameter('width', v)} />
        <Slider label="Height" value={parameters.height} max={50} onChange={(v) => updateParameter('height', v)} />
        <Slider label="Hole Diameter" value={parameters.holeDiameter} max={20} onChange={(v) => updateParameter('holeDiameter', v)} />
        <Slider label="Hole Spacing" value={parameters.holeSpacing} max={30} onChange={(v) => updateParameter('holeSpacing', v)} />
        <Slider label="Fillet Radius" value={parameters.filletRadius} max={10} onChange={(v) => updateParameter('filletRadius', v)} />
      </div>

      <div className="mt-6">
        <div className="mb-4 rounded-lg overflow-hidden">
          <div className="relative w-full h-24 bg-gradient-to-b from-white to-transparent">
            <div 
              className="absolute right-2 top-2 w-6 h-6 rounded-full border-2 border-white"
              style={{ background: '#FF007C' }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex-1 h-10 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 relative">
              <div className="absolute right-0 top-0 w-4 h-4 rounded-full border-2 border-white transform translate-x-1/2 translate-y-1/2"></div>
            </div>
          </div>
        </div>
        <button className="w-full mt-4 py-2 bg-white/10 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>STL</span>
        </button>
      </div>
    </div>
  );
};

export default ParametersPanel;
