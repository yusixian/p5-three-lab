import { Link } from '@tanstack/react-router';
import { ArrowRight, Github } from 'lucide-react';

import { Button } from '@/lib/components/ui/button';

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden py-12">
      <div className="relative w-full max-w-6xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
            p5-three-lab
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
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
              className="group btn-gradient-shine relative inline-flex items-center gap-3 px-8 py-4 font-semibold text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              Explore Components
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Github className="size-4" />
                GitHub
              </Button>
            </a>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              React • Three.js • p5.js
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
