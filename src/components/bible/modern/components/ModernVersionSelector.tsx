
import React, { useState } from 'react';
import { X, Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BibleVersion } from '../../../../services/comprehensiveBibleService';

interface ModernVersionSelectorProps {
  versions: BibleVersion[];
  selectedVersion: BibleVersion | null;
  onSelect: (version: BibleVersion) => void;
  onClose: () => void;
}

export const ModernVersionSelector: React.FC<ModernVersionSelectorProps> = ({
  versions,
  selectedVersion,
  onSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // Get unique languages
  const languages = Array.from(
    new Map(versions.map(v => [v.language.id, v.language])).values()
  );

  // Filter versions
  const filteredVersions = versions.filter(version => {
    const matchesSearch = searchQuery === '' || 
      version.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = selectedLanguage === null || version.language.id === selectedLanguage;
    
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-3/4 rounded-t-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bible Versions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search versions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl"
            />
          </div>
        </div>

        {/* Language Filter */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Button
              variant={selectedLanguage === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedLanguage(null)}
              className="whitespace-nowrap rounded-full"
            >
              All Languages
            </Button>
            {languages.map((language) => (
              <Button
                key={language.id}
                variant={selectedLanguage === language.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedLanguage(language.id)}
                className="whitespace-nowrap rounded-full flex items-center space-x-1"
              >
                <Globe className="h-3 w-3" />
                <span>{language.nameLocal}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Versions List */}
        <div className="flex-1 overflow-y-auto">
          {filteredVersions.map((version) => (
            <button
              key={version.id}
              onClick={() => onSelect(version)}
              className={`w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                selectedVersion?.id === version.id 
                  ? 'bg-blue-50 dark:bg-blue-950 border-r-4 border-blue-500' 
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {version.abbreviation}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {version.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center space-x-1">
                    <Globe className="h-3 w-3" />
                    <span>{version.language.nameLocal}</span>
                  </div>
                </div>
                {selectedVersion?.id === version.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
