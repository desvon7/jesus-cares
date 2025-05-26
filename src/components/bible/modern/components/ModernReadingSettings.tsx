
import React from 'react';
import { X, Sun, Moon, Type, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ReadingSettings } from '../../types/readingSettings';

interface ModernReadingSettingsProps {
  settings: ReadingSettings;
  onSettingsChange: (settings: ReadingSettings) => void;
  onClose: () => void;
}

export const ModernReadingSettings: React.FC<ModernReadingSettingsProps> = ({
  settings,
  onSettingsChange,
  onClose
}) => {
  const updateSetting = <K extends keyof ReadingSettings>(
    key: K,
    value: ReadingSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-3/4 rounded-t-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reading Settings</h2>
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

        {/* Settings */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Theme */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Sun className="h-5 w-5" />
              <span>Appearance</span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'sepia'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateSetting('theme', theme)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.theme === theme
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className={`w-full h-8 rounded-lg mb-2 ${
                    theme === 'light' ? 'bg-white border border-gray-200' :
                    theme === 'dark' ? 'bg-gray-900' :
                    'bg-yellow-50 border border-yellow-200'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {theme}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Type className="h-5 w-5" />
              <span>Font</span>
            </h3>
            <div className="space-y-2">
              {([
                { value: 'serif', label: 'Serif (Georgia)', className: 'font-serif' },
                { value: 'sans-serif', label: 'Sans-serif (System)', className: 'font-sans' },
                { value: 'dyslexic', label: 'Monospace', className: 'font-mono' }
              ] as const).map((font) => (
                <button
                  key={font.value}
                  onClick={() => updateSetting('fontFamily', font.value)}
                  className={`w-full p-3 text-left rounded-xl border transition-all ${
                    settings.fontFamily === font.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className={`${font.className} text-gray-900 dark:text-white`}>
                    {font.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Font Size</h3>
            <div className="space-y-4">
              <Slider
                value={[settings.fontSize]}
                onValueChange={(value) => updateSetting('fontSize', value[0])}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Small</span>
                <span>{settings.fontSize}px</span>
                <span>Large</span>
              </div>
            </div>
          </div>

          {/* Line Spacing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Line Spacing</h3>
            <div className="space-y-4">
              <Slider
                value={[settings.lineSpacing]}
                onValueChange={(value) => updateSetting('lineSpacing', value[0])}
                min={1.2}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Tight</span>
                <span>{settings.lineSpacing.toFixed(1)}</span>
                <span>Loose</span>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <AlignLeft className="h-5 w-5" />
              <span>Display</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">Show verse numbers</span>
                <Switch
                  checked={settings.showVerseNumbers}
                  onCheckedChange={(checked) => updateSetting('showVerseNumbers', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">Show chapter numbers</span>
                <Switch
                  checked={settings.showChapterNumbers}
                  onCheckedChange={(checked) => updateSetting('showChapterNumbers', checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
