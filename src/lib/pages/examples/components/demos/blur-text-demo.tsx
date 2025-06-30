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
        isVisible ? 'blur-none opacity-100' : 'blur-sm opacity-70'
      } ${className}`}
    >
      {text}
    </div>
  );
};

export const BlurTextDemo = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 rounded-2xl p-12 shadow-lg">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-lg"></div>
        </div>

        <div className="relative text-center space-y-12">
          {/* Main heading */}
          <div className="space-y-4">
            <BlurText
              text="✨ Blur Text"
              delay={300}
              className="text-lg text-muted-foreground font-medium"
            />
            <BlurText
              text="Blur Text Demo"
              delay={600}
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
