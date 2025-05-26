
import React, { useState, useEffect } from 'react';
import { BibleVersion } from '../../services/comprehensiveBibleService';
import BibleVersionSelector from './BibleVersionSelector';
import BibleReader from './BibleReader';

const BibleApp: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion | null>(null);

  useEffect(() => {
    // Check if there's a previously selected version in localStorage
    const savedVersion = localStorage.getItem('selected_bible_version');
    if (savedVersion) {
      try {
        setSelectedVersion(JSON.parse(savedVersion));
      } catch (error) {
        console.error('Error parsing saved version:', error);
      }
    }
  }, []);

  const handleVersionSelect = (version: BibleVersion) => {
    setSelectedVersion(version);
    localStorage.setItem('selected_bible_version', JSON.stringify(version));
  };

  const handleBackToVersions = () => {
    setSelectedVersion(null);
  };

  if (!selectedVersion) {
    return <BibleVersionSelector onVersionSelect={handleVersionSelect} />;
  }

  return (
    <BibleReader 
      selectedVersion={selectedVersion} 
      onBack={handleBackToVersions}
      autoOpenGenesis={true}
    />
  );
};

export default BibleApp;
