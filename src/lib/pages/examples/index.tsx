import { Link } from '@tanstack/react-router';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

import { ThemeToggle } from '@/lib/components/theme-toggle';
import { Button } from '@/lib/components/ui/button';
import { useIsMobile } from '@/lib/hooks/use-is-mobile';

import { ContentArea } from './components/content-area';
import { Sidebar } from './components/sidebar';

const Examples = () => {
  const [activeComponent, setActiveComponent] = useState('particle-globe');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-border border-b bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                {sidebarOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            )}
            <Link
              to="/"
              className="group flex items-center gap-2 text-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="group-hover:-translate-x-1 h-4 w-4 transition-transform" />
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white text-xs">
                  P5
                </div>
                <span className="font-semibold text-sm sm:text-base">
                  p5-three-lab
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden text-muted-foreground text-xs sm:block sm:text-sm">
              Components
            </div>
            <a
              href="https://github.com/yusixian/p5-three-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground text-xs transition-colors hover:text-foreground sm:text-sm"
            >
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex h-[calc(100vh-3.5rem)] w-full overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <button
            type="button"
            className="absolute inset-0 z-20 bg-black/50"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSidebarOpen(false);
              }
            }}
            aria-label="Close sidebar"
          />
        )}

        {/* Sidebar */}
        <div
          className={`${
            isMobile
              ? `absolute top-0 left-0 z-30 h-full transform transition-transform duration-300 ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : 'relative'
          } w-64 flex-shrink-0`}
        >
          <Sidebar
            activeComponent={activeComponent}
            onComponentSelect={(component) => {
              setActiveComponent(component);
              if (isMobile) {
                setSidebarOpen(false);
              }
            }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <ContentArea activeComponent={activeComponent} />
        </div>
      </div>
    </div>
  );
};

export default Examples;
