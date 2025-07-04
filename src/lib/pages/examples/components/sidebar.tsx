import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { Button } from '@/lib/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/lib/components/ui/tooltip';

interface SidebarProps {
  activeComponent: string;
  onComponentSelect: (component: string) => void;
}

interface ComponentItem {
  id: string;
  name: string;
  isNew?: boolean;
  isUpdated?: boolean;
}

interface Category {
  title: string;
  items: Array<ComponentItem>;
}

const categories: Array<Category> = [
  {
    title: 'p5 2D Animate',
    items: [],
  },
  {
    title: 'Three 3D Animate',
    items: [
      { id: 'particle-globe', name: 'Particle Globe', isNew: true },
      { id: 'particle-line-globe', name: 'Particle Line Globe', isNew: true },
    ],
  },
];

export const Sidebar = ({
  activeComponent,
  onComponentSelect,
}: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ width: 320 }}
      animate={{ width: isExpanded ? 320 : 80 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className="relative h-full flex-shrink-0 overflow-hidden border-border border-r bg-background"
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="absolute top-4 right-2 z-10 h-8 w-8 p-0 hover:bg-muted"
      >
        {isExpanded ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <div className="h-full overflow-y-auto">
        <div className="p-6 pt-16">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <div className="mb-8">
                  <h2 className="mb-2 font-semibold text-foreground text-lg">
                    Components
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Explore reusable creative components
                  </p>
                </div>

                <div className="space-y-6">
                  {categories.map((category) => (
                    <div key={category.title}>
                      <h3 className="mb-3 font-medium text-foreground text-sm uppercase tracking-wide">
                        {category.title}
                      </h3>
                      <div className="space-y-1">
                        {category.items.length === 0 ? (
                          <div className="px-3 py-2 text-muted-foreground/60 text-sm italic">
                            Coming soon...
                          </div>
                        ) : (
                          category.items.map((item) => (
                            <Button
                              key={item.id}
                              variant={
                                activeComponent === item.id
                                  ? 'default'
                                  : 'ghost'
                              }
                              onClick={() => onComponentSelect(item.id)}
                              className={`h-auto w-full justify-between px-3 py-3 text-sm transition-all duration-200 ${
                                activeComponent === item.id
                                  ? 'bg-primary text-primary-foreground shadow-sm'
                                  : 'text-foreground hover:bg-muted hover:text-foreground'
                              }`}
                            >
                              <span className="font-medium">{item.name}</span>
                              <div className="flex gap-1">
                                {item.isNew && (
                                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 font-medium text-white text-xs">
                                    New
                                  </span>
                                )}
                                {item.isUpdated && (
                                  <span className="rounded-full bg-blue-500 px-2 py-0.5 font-medium text-white text-xs">
                                    Updated
                                  </span>
                                )}
                              </div>
                            </Button>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex flex-col items-center space-y-4"
              >
                {/* Collapsed view - show only active component icons with tooltip */}
                {categories.map((category) =>
                  category.items.map((item) => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            activeComponent === item.id ? 'default' : 'ghost'
                          }
                          onClick={() => onComponentSelect(item.id)}
                          className={`h-12 w-12 p-0 ${
                            activeComponent === item.id
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'text-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <span className="font-bold text-lg">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  )),
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
