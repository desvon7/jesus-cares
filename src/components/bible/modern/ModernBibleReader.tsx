
import React from 'react';
import { BibleVersion } from '../../../services/comprehensiveBibleService';
import { BibleReaderProvider } from '../providers/BibleReaderProvider';
import { ModernBibleInterface } from './ModernBibleInterface';

interface ModernBibleReaderProps {
  selectedVersion: BibleVersion;
  onBack: () => void;
  autoOpenGenesis?: boolean;
}

const ModernBibleReader: React.FC<ModernBibleReaderProps> = ({ 
  selectedVersion, 
  onBack, 
  autoOpenGenesis = false 
}) => {
  console.log('ModernBibleReader rendering with version:', selectedVersion);
  
  if (!selectedVersion) {
    console.error('ModernBibleReader: selectedVersion is required');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Bible Version Selected</h2>
          <p className="text-gray-600">Please select a Bible version to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <BibleReaderProvider 
        selectedVersion={selectedVersion} 
        autoOpenGenesis={autoOpenGenesis}
      >
        <React.Suspense fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Bible interface...</p>
            </div>
          </div>
        }>
          <ModernBibleInterface onBack={onBack} />
        </React.Suspense>
      </BibleReaderProvider>
    </div>
  );
};

export default ModernBibleReader;
