import { useId, useState } from 'react';

import { Button } from '@/lib/components/ui/button';

import { BlurTextDemo } from './demos/blur-text-demo';

interface ContentAreaProps {
  activeComponent: string;
}

const tabs = [
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
];

export const ContentArea = ({ activeComponent }: ContentAreaProps) => {
  const [activeTab, setActiveTab] = useState('preview');
  const animateById = useId();
  const directionId = useId();
  const delayId = useId();

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
      case 'blur-text':
        return (
          <div className="flex items-center justify-center min-h-[400px] p-8">
            <BlurTextDemo />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center space-y-4">
              <div className="text-6xl">🚧</div>
              <p className="text-lg font-medium">
                Component under development...
              </p>
              <p className="text-sm">Stay tuned for more exciting components</p>
            </div>
          </div>
        );
    }
  };

  const renderCode = () => {
    return (
      <div className="p-6">
        <div className="bg-gray-950 rounded-xl p-6 font-mono text-sm text-gray-100 overflow-x-auto">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
            <span className="text-gray-400">BlurText.tsx</span>
            <Button
              size="sm"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              Copy Code
            </Button>
          </div>
          <pre className="overflow-x-auto">
            <code>{`import { useState, useEffect } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function BlurText({ 
  text, 
  delay = 200, 
  className = '' 
}: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={\`transition-all duration-1000 \${
      isVisible 
        ? 'blur-none opacity-100' 
        : 'blur-sm opacity-70'
    } \${className}\`}>
      {text}
    </div>
  );
}

// 使用示例
export default function Demo() {
  return (
    <BlurText 
      text="Hello, World!" 
      delay={300}
      className="text-2xl font-bold"
    />
  );
}`}</code>
          </pre>
        </div>
      </div>
    );
  };

  const getComponentTitle = () => {
    switch (activeComponent) {
      case 'blur-text':
        return 'Blur Text';
      default:
        return activeComponent
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  const getComponentDescription = () => {
    switch (activeComponent) {
      case 'blur-text':
        return 'A beautiful blur text animation component';
      default:
        return 'Explore the infinite possibilities of creative programming';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
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
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-auto">{renderContent()}</div>

      {/* Customize section for preview */}
      {activeTab === 'preview' && activeComponent === 'blur-text' && (
        <div className="border-t border-border bg-muted/30 p-6">
          <div className="max-w-md">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              Customize Parameters
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label
                  htmlFor={animateById}
                  className="block text-muted-foreground mb-1 font-medium"
                >
                  Animation Type:
                </label>
                <select
                  id={animateById}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option>Word</option>
                  <option>Letter</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor={directionId}
                  className="block text-muted-foreground mb-1 font-medium"
                >
                  Animation Direction:
                </label>
                <select
                  id={directionId}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option>Up to Down</option>
                  <option>Down to Up</option>
                  <option>Left to Right</option>
                  <option>Right to Left</option>
                </select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor={delayId}
                  className="block text-muted-foreground mb-1 font-medium"
                >
                  Delay Time: 200ms
                </label>
                <input
                  id={delayId}
                  type="range"
                  min="0"
                  max="1000"
                  defaultValue="200"
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
