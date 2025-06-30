import { useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { ThemeProvider } from '@/lib/components/theme-provider';

import { Footer } from './components/footer';
import { Header } from './components/header';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isExamplesPage = location.pathname === '/examples';

  return (
    <ThemeProvider>
      {/* <Meta /> */}
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {!isExamplesPage && <Header />}
        <main
          className={
            isExamplesPage
              ? 'flex-1'
              : 'wrapper mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8'
          }
        >
          {children}
        </main>
        {!isExamplesPage && <Footer />}
      </div>
    </ThemeProvider>
  );
};
