import React, { useState } from 'react';
import { Search, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBibleVersions } from '../../hooks/useComprehensiveBibleData';
import { BibleVersion } from '../../services/comprehensiveBibleService';

interface BibleVersionSelectorProps {
  onVersionSelect: (version: BibleVersion) => void;
  title?: string;
  subtitle?: string;
}

const BibleVersionSelector: React.FC<BibleVersionSelectorProps> = ({ 
  onVersionSelect, 
  title = "Choose Your Bible Version",
  subtitle = "Select from comprehensive translations in multiple languages"
}) => {
  const { versions, loading, error } = useBibleVersions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const filteredVersions = versions.filter(version => {
    const matchesSearch = version.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.language.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLanguage = !selectedLanguage || version.language.id === selectedLanguage;
    
    return matchesSearch && matchesLanguage;
  });

  // Get unique languages for filter
  const languages = Array.from(new Set(versions.map(v => v.language.id)))
    .map(langId => versions.find(v => v.language.id === langId)?.language)
    .filter(Boolean)
    .sort((a, b) => a!.name.localeCompare(b!.name));

  // Group versions by language for better organization
  const versionsByLanguage = filteredVersions.reduce((acc, version) => {
    const langName = version.language.name;
    if (!acc[langName]) {
      acc[langName] = [];
    }
    acc[langName].push(version);
    return acc;
  }, {} as Record<string, BibleVersion[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Bible versions...</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
            Loading {versions.length > 0 ? `${versions.length}+ translations` : 'comprehensive database'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111] p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-2">
              {title}
            </CardTitle>
            <div className="text-center mb-4">
              <p className="text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
                <Globe className="h-4 w-4" />
                {subtitle}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                {versions.length} translations in {languages.length} languages
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search versions, languages, abbreviations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedLanguage === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage('')}
                >
                  All Languages
                </Button>
                {languages.slice(0, 8).map((language) => (
                  <Button
                    key={language!.id}
                    variant={selectedLanguage === language!.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLanguage(
                      selectedLanguage === language!.id ? '' : language!.id
                    )}
                  >
                    {language!.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto space-y-6">
              {Object.keys(versionsByLanguage).length === 0 && searchTerm && (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No versions found matching "{searchTerm}"
                </p>
              )}
              
              {Object.entries(versionsByLanguage).map(([languageName, languageVersions]) => (
                <div key={languageName}>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {languageName} ({languageVersions.length})
                  </h3>
                  <div className="grid gap-3">
                    {languageVersions.map((version) => (
                      <Card 
                        key={version.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700"
                        onClick={() => onVersionSelect(version)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                  {version.abbreviation} - {version.name}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {version.source === 'static' ? 'Built-in' : 'API'}
                                </Badge>
                              </div>
                              {version.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                  {version.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BibleVersionSelector;
