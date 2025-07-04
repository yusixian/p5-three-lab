import { useEffect, useState } from 'react';

import { Button } from '@/lib/components/ui/button';
import { ParticleGlobeGLDemo } from '@/lib/pages/examples/components/demos/particle-globe-gl';
import { ParticleLineGlobeGLDemo } from '@/lib/pages/examples/components/demos/particle-line-globe-gl';
import { loadSourceCodes } from '@/lib/utils';

interface ContentAreaProps {
  activeComponent: string;
}

const tabs = [
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
];

export const ContentArea = ({ activeComponent }: ContentAreaProps) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [sourceCodes, setSourceCodes] = useState<Record<string, string>>({});
  const [activeCodeFile, setActiveCodeFile] = useState<string>('');
  const [isLoadingCode, setIsLoadingCode] = useState(false);

  // Load source codes when activeComponent changes and code tab is active
  useEffect(() => {
    if (activeTab === 'code') {
      // 动态映射 activeComponent 到源码目录
      let componentPath = '';
      switch (activeComponent) {
        case 'particle-globe':
          componentPath = 'particle-globe-gl';
          break;
        case 'particle-line-globe':
          componentPath = 'particle-line-globe-gl';
          break;
        default:
          componentPath = activeComponent;
      }
      setIsLoadingCode(true);
      loadSourceCodes(componentPath)
        .then((codes) => {
          setSourceCodes(codes);
          // Set default active file to the main component
          const mainFile = Object.keys(codes).find((name) =>
            name.includes(`${componentPath}.tsx`),
          );
          if (mainFile) {
            setActiveCodeFile(mainFile);
          } else {
            setActiveCodeFile(Object.keys(codes)[0] || '');
          }
        })
        .catch((error) => {
          console.error('Failed to load source codes:', error);
        })
        .finally(() => {
          setIsLoadingCode(false);
        });
    }
  }, [activeTab, activeComponent]);

  const renderContent = () => {
    if (activeTab === 'preview') {
      return renderPreview();
    }
    if (activeTab === 'code') {
      return renderCode();
    }
  };

  const renderPreview = () => {
    switch (activeComponent) {
      case 'particle-globe':
        return (
          <div className="flex min-h-[400px] items-center justify-center p-6">
            <ParticleGlobeGLDemo />
          </div>
        );
      case 'particle-line-globe':
        return (
          <div className="flex min-h-[400px] items-center justify-center p-6">
            <ParticleLineGlobeGLDemo />
          </div>
        );
      default:
        return (
          <div className="flex h-96 items-center justify-center text-muted-foreground">
            <div className="space-y-4 text-center">
              <div className="text-6xl">🚧</div>
              <p className="font-medium text-lg">
                Component under development...
              </p>
              <p className="text-sm">Stay tuned for more exciting components</p>
            </div>
          </div>
        );
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const renderCode = () => {
    if (isLoadingCode) {
      return (
        <div className="p-6">
          <div className="flex h-96 items-center justify-center">
            <div className="text-muted-foreground">Loading source code...</div>
          </div>
        </div>
      );
    }

    const fileNames = Object.keys(sourceCodes);
    const currentCode = sourceCodes[activeCodeFile] || '';

    if (fileNames.length === 0) {
      return (
        <div className="p-6">
          <div className="flex h-96 items-center justify-center">
            <div className="text-muted-foreground">
              No source code available
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        {/* File tabs */}
        {fileNames.length > 1 && (
          <div className="mb-4 flex gap-2 border-gray-800 border-b pb-3">
            {fileNames.map((fileName) => (
              <Button
                key={fileName}
                variant={activeCodeFile === fileName ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveCodeFile(fileName)}
                className="px-3 py-1 text-xs"
              >
                {fileName}
              </Button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl bg-gray-950 p-6 font-mono text-gray-100 text-sm">
          <div className="mb-4 flex items-center justify-between border-gray-800 border-b pb-3">
            <span className="text-gray-400">{activeCodeFile}</span>
            <Button
              size="sm"
              onClick={() => copyToClipboard(currentCode)}
              className="bg-blue-600 px-3 py-1 text-white text-xs hover:bg-blue-700"
            >
              Copy Code
            </Button>
          </div>
          <pre className="overflow-x-auto">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    );
  };

  const getComponentTitle = () => {
    switch (activeComponent) {
      case 'particle-globe':
        return 'Particle Globe';
      case 'particle-line-globe':
        return 'Particle Line Globe';
      default:
        return activeComponent
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  const getComponentDescription = () => {
    switch (activeComponent) {
      case 'particle-globe':
        return 'A stunning 3D particle globe animation with WebGL and Three.js';
      case 'particle-line-globe':
        return 'A 3D particle line globe animation with WebGL and Three.js';
      default:
        return 'Explore the infinite possibilities of creative programming';
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-auto bg-background">
      {/* Header */}
      <div className="border-border border-b bg-background/95 backdrop-blur-sm">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2 font-bold text-3xl text-foreground">
              {getComponentTitle()}
            </h1>
            <p className="text-muted-foreground">{getComponentDescription()}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      {renderContent()}
    </div>
  );
};
