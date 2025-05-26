
import React from 'react';
import { BibleVersion } from '../../services/comprehensiveBibleService';
import { BibleReaderProvider } from './providers/BibleReaderProvider';
import { BibleReaderContent } from './components/BibleReaderContent';

interface BibleReaderProps {
  selectedVersion: BibleVersion;
  onBack: () => void;
  autoOpenGenesis?: boolean;
}

const BibleReader: React.FC<BibleReaderProps> = ({ 
  selectedVersion, 
  onBack, 
  autoOpenGenesis = false 
}) => {
  return (
    <BibleReaderProvider 
      selectedVersion={selectedVersion} 
      autoOpenGenesis={autoOpenGenesis}
    >
      <BibleReaderContent selectedVersion={selectedVersion} />
    </BibleReaderProvider>
  );
};

export default BibleReader;
