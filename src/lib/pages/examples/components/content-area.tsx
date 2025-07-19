import { useEffect, useState } from 'react';

import { Button } from '@/lib/components/ui/button';
import { CodeBlock } from '@/lib/components/ui/code-block';
import { useTheme } from '@/lib/hooks/use-theme';
import { DynamicParticleGLDemo } from '@/lib/pages/examples/components/demos/dynamic-particle-gl';
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
  const theme = useTheme();

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
        case 'dynamic-particle-gl':
          componentPath = 'dynamic-particle-gl';
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
          <div className="flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-8 pb-40">
            <ParticleGlobeGLDemo />
          </div>
        );
      case 'particle-line-globe':
        return (
          <div className="flex min-h-[500px] flex-1 items-center justify-center bg-gradient-to-br from-background to-muted/20 p-8 pb-40">
            <ParticleLineGlobeGLDemo />
          </div>
        );
      case 'dynamic-particle-gl':
        return (
          <div className="flex min-h-[500px] flex-1 items-center justify-center bg-gradient-to-br from-background to-muted/20 p-8 pb-40">
            <DynamicParticleGLDemo />
          </div>
        );
      default:
        return (
          <div className="flex h-full items-center justify-center text-muted-foreground">
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

    const languageMap: Record<string, string> = {
      '.tsx': 'tsx',
      '.ts': 'typescript',
      '.jsx': 'jsx',
      '.js': 'javascript',
      '.css': 'css',
      '.json': 'json',
      '.glsl': 'glsl',
      '.vert': 'glsl',
      '.frag': 'glsl',
    };

    const getLanguage = (filename: string) => {
      const extension = Object.keys(languageMap).find((ext) =>
        filename.endsWith(ext),
      );
      return extension ? languageMap[extension] : 'typescript';
    };

    return (
      <div className="flex h-full flex-col p-6">
        {/* File tabs */}
        {fileNames.length > 1 && (
          <div className="mb-4 flex gap-2 border-border border-b pb-3">
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

        <div className="flex-1 overflow-hidden">
          <CodeBlock
            code={currentCode}
            language={getLanguage(activeCodeFile)}
            filename={activeCodeFile}
            theme={theme}
            showLineNumbers={true}
          />
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
      case 'dynamic-particle-gl':
        return 'A dynamic particle system animation with P5.js and interactive image switching';
      default:
        return 'Explore the infinite possibilities of creative programming';
    }
  };

  return (
    <div className="flex h-full flex-col overflow-auto bg-background">
      {/* Header */}
      <div className="border-border border-b bg-background/95 backdrop-blur-sm">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="mb-2 font-bold text-2xl text-foreground sm:text-3xl">
              {getComponentTitle()}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {getComponentDescription()}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 font-medium text-sm transition-all duration-200 sm:flex-none sm:px-4 ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
};
