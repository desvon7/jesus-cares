
import React, { useState } from 'react';
import { BibleVersionSelector } from './BibleVersionSelector';
import ModernBibleReader from './modern/ModernBibleReader';
import { BibleVersion } from '../../services/comprehensiveBibleService';

const BibleApp: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion | null>(null);

  if (!selectedVersion) {
    return (
      <BibleVersionSelector 
        onVersionSelect={setSelectedVersion}
        title="Choose a Bible Version"
        subtitle="Select from over 60 translations in multiple languages"
      />
    );
  }

  return (
    <ModernBibleReader
      selectedVersion={selectedVersion}
      onBack={() => setSelectedVersion(null)}
      autoOpenGenesis={true}
    />
  );
};

export default BibleApp;
