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
      <header className="sticky top-0 z-20 border-border border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-6">
          <Link
            to="/"
            className="group flex items-center gap-3 text-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="group-hover:-translate-x-1 h-5 w-5 transition-transform" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-sm text-white">
                P5
              </div>
              <span className="font-semibold text-lg">p5-three-lab</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground text-sm">Components</div>
            <a
              href="https://github.com/yusixian/p5-three-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
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
