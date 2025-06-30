import { Link } from '@tanstack/react-router';

import { ThemeToggle } from '@/lib/components/theme-toggle';

export const Header = () => {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-10 w-full">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <Link
          to="/"
          className="flex items-center gap-3 text-foreground hover:text-primary transition-colors group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            P5
          </div>
          <span className="font-semibold text-lg">p5-three-lab</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/examples"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Components
            </Link>
            <a
              href="https://github.com/yusixian/p5-three-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>
          <ThemeToggle />
        </div>
      </section>
    </header>
  );
};
