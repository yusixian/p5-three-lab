import { useEffect, useState } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const BlurText = ({ text, delay = 200, className = '' }: BlurTextProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 blur-none' : 'opacity-70 blur-sm'
      } ${className}`}
    >
      {text}
    </div>
  );
};

export const BlurTextDemo = () => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative rounded-2xl bg-gradient-to-br from-purple-50 via-white to-pink-50 p-12 shadow-lg dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-4 right-4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl"></div>
          <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-lg"></div>
        </div>

        <div className="relative space-y-12 text-center">
          {/* Main heading */}
          <div className="space-y-4">
            <BlurText
              text="✨ Blur Text"
              delay={300}
              className="font-medium text-lg text-muted-foreground"
            />
            <BlurText
              text="Blur Text Demo"
              delay={600}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text font-bold text-4xl text-transparent md:text-6xl dark:from-purple-400 dark:via-pink-400 dark:to-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
