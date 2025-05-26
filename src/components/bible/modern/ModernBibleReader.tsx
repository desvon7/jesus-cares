
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
        <p>No Bible version selected</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <BibleReaderProvider 
        selectedVersion={selectedVersion} 
        autoOpenGenesis={autoOpenGenesis}
      >
        <ModernBibleInterface onBack={onBack} />
      </BibleReaderProvider>
    </div>
  );
};

export default ModernBibleReader;
