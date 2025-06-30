import { Link } from '@tanstack/react-router';
import { ArrowRight, Github } from 'lucide-react';

import { Button } from '@/lib/components/ui/button';

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden py-12">
      <div className="relative mx-auto w-full max-w-6xl space-y-12 px-6 text-center">
        <div className="space-y-6">
          <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text font-bold text-5xl text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
            p5-three-lab
          </h1>
          <h2 className="mx-auto max-w-4xl font-semibold text-2xl text-gray-700 leading-relaxed dark:text-gray-300">
            🔬 Experimental playground of reusable Three.js & p5.js components.
            <br />
            Crafted by <a href="https://github.com/yusixian">cos</a>.
          </h2>
        </div>

        <div className="space-y-8">
          {/* Main CTA Button */}
          <div className="flex justify-center">
            <Link
              to="/examples"
              className="group btn-gradient-shine hover:-translate-y-1 relative inline-flex transform items-center gap-3 rounded-2xl px-8 py-4 font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Explore Components
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {/* Secondary actions */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/yusixian/p5-three-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Button
                variant="outline"
                className="border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white dark:border-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-800"
              >
                <Github className="size-4" />
                GitHub
              </Button>
            </a>
            <div className="text-gray-500 text-sm dark:text-gray-400">
              React • Three.js • p5.js
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
