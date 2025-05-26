
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
    return null;
  }

  return (
    <BibleReaderProvider 
      selectedVersion={selectedVersion} 
      autoOpenGenesis={autoOpenGenesis}
    >
      <ModernBibleInterface onBack={onBack} />
    </BibleReaderProvider>
  );
};

export default ModernBibleReader;
