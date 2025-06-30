import { Link } from '@tanstack/react-router';

import { ThemeToggle } from '@/lib/components/theme-toggle';

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 w-full border-border/60 border-b bg-background/80 backdrop-blur-md">
      <section className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3 text-foreground transition-colors hover:text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-sm text-white">
            P5
          </div>
          <span className="font-semibold text-lg">p5-three-lab</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/examples"
              className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
            >
              Components
            </Link>
            <a
              href="https://github.com/yusixian/p5-three-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
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
