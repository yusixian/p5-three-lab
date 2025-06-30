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
          <div className="flex min-h-[400px] items-center justify-center p-8">
            <BlurTextDemo />
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

  const renderCode = () => {
    return (
      <div className="p-6">
        <div className="overflow-x-auto rounded-xl bg-gray-950 p-6 font-mono text-gray-100 text-sm">
          <div className="mb-4 flex items-center justify-between border-gray-800 border-b pb-3">
            <span className="text-gray-400">BlurText.tsx</span>
            <Button
              size="sm"
              className="bg-blue-600 px-3 py-1 text-white text-xs hover:bg-blue-700"
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
    <div className="flex h-full flex-1 flex-col bg-background">
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
      <div className="overflow-auto">{renderContent()}</div>

      {/* Customize section for preview */}
      {activeTab === 'preview' && activeComponent === 'blur-text' && (
        <div className="border-border border-t bg-muted/30 p-6">
          <div className="max-w-md">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              Customize Parameters
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label
                  htmlFor={animateById}
                  className="mb-1 block font-medium text-muted-foreground"
                >
                  Animation Type:
                </label>
                <select
                  id={animateById}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-transparent focus:ring-2 focus:ring-primary"
                >
                  <option>Word</option>
                  <option>Letter</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor={directionId}
                  className="mb-1 block font-medium text-muted-foreground"
                >
                  Animation Direction:
                </label>
                <select
                  id={directionId}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-transparent focus:ring-2 focus:ring-primary"
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
                  className="mb-1 block font-medium text-muted-foreground"
                >
                  Delay Time: 200ms
                </label>
                <input
                  id={delayId}
                  type="range"
                  min="0"
                  max="1000"
                  defaultValue="200"
                  className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
