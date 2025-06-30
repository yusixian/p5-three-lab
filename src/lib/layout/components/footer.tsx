export const Footer = () => {
  return (
    <footer className="mt-auto border-border/60 border-t bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white text-xs">
              P5
            </div>
            <span className="font-medium text-foreground text-sm">
              p5-three-lab
            </span>
          </div>

          <div className="flex items-center gap-6 text-muted-foreground text-sm">
            <span>© {new Date().getFullYear()} p5-three-lab</span>
            <a
              href="https://github.com/yusixian/p5-three-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
