
import React, { useState } from 'react';
import { Type, Palette, Moon, Sun, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReadingSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'dyslexic';
  theme: 'light' | 'dark' | 'sepia';
  lineSpacing: number;
  showVerseNumbers: boolean;
  showChapterNumbers: boolean;
  paragraphMode: boolean;
}

interface ReadingSettingsPanelProps {
  settings: ReadingSettings;
  onSettingsChange: (settings: ReadingSettings) => void;
  onClose: () => void;
}

const ReadingSettingsPanel: React.FC<ReadingSettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onClose
}) => {
  const updateSetting = (key: keyof ReadingSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card className="w-96 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Reading Settings
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="display" className="space-y-4">
            {/* Theme Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('theme', 'light')}
                  className="flex items-center space-x-1"
                >
                  <Sun className="h-3 w-3" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('theme', 'dark')}
                  className="flex items-center space-x-1"
                >
                  <Moon className="h-3 w-3" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant={settings.theme === 'sepia' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('theme', 'sepia')}
                  className="flex items-center space-x-1"
                >
                  <Palette className="h-3 w-3" />
                  <span>Sepia</span>
                </Button>
              </div>
            </div>

            {/* Display Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Verse Numbers</label>
                <button
                  onClick={() => updateSetting('showVerseNumbers', !settings.showVerseNumbers)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showVerseNumbers ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.showVerseNumbers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Chapter Numbers</label>
                <button
                  onClick={() => updateSetting('showChapterNumbers', !settings.showChapterNumbers)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showChapterNumbers ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.showChapterNumbers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Paragraph Mode</label>
                <button
                  onClick={() => updateSetting('paragraphMode', !settings.paragraphMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.paragraphMode ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.paragraphMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-2 block">Font Size</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                  disabled={settings.fontSize <= 12}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {settings.fontSize}px
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                  disabled={settings.fontSize >= 24}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="text-sm font-medium mb-2 block">Font Family</label>
              <div className="space-y-2">
                <Button
                  variant={settings.fontFamily === 'serif' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('fontFamily', 'serif')}
                  className="w-full justify-start"
                  style={{ fontFamily: 'serif' }}
                >
                  Serif (Traditional)
                </Button>
                <Button
                  variant={settings.fontFamily === 'sans-serif' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('fontFamily', 'sans-serif')}
                  className="w-full justify-start"
                  style={{ fontFamily: 'sans-serif' }}
                >
                  Sans-serif (Modern)
                </Button>
                <Button
                  variant={settings.fontFamily === 'dyslexic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('fontFamily', 'dyslexic')}
                  className="w-full justify-start"
                >
                  Dyslexia-friendly
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            {/* Line Spacing */}
            <div>
              <label className="text-sm font-medium mb-2 block">Line Spacing</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSetting('lineSpacing', Math.max(1.2, settings.lineSpacing - 0.1))}
                  disabled={settings.lineSpacing <= 1.2}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {settings.lineSpacing.toFixed(1)}x
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateSetting('lineSpacing', Math.min(2.0, settings.lineSpacing + 0.1))}
                  disabled={settings.lineSpacing >= 2.0}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Reset to Defaults */}
            <Button
              variant="outline"
              onClick={() => onSettingsChange({
                fontSize: 16,
                fontFamily: 'serif',
                theme: 'light',
                lineSpacing: 1.5,
                showVerseNumbers: true,
                showChapterNumbers: true,
                paragraphMode: false
              })}
              className="w-full"
            >
              Reset to Defaults
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReadingSettingsPanel;
