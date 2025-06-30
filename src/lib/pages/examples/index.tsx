import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { ThemeToggle } from '@/lib/components/theme-toggle';

import { ContentArea } from './components/content-area';
import { Sidebar } from './components/sidebar';

const Examples = () => {
  const [activeComponent, setActiveComponent] = useState('blur-text');

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-20">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P5
              </div>
              <span className="font-semibold text-lg">p5-three-lab</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Components</div>
            <a
              href="https://github.com/yusixian/p5-three-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          activeComponent={activeComponent}
          onComponentSelect={setActiveComponent}
        />
        <ContentArea activeComponent={activeComponent} />
      </div>
    </div>
  );
};

export default Examples;
