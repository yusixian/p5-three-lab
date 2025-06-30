import { Button } from '@/lib/components/ui/button';

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
    items: [{ id: 'blur-text', name: 'Blur Text', isNew: true }],
  },
  {
    title: 'Three 3D Animate',
    items: [],
  },
];

export const Sidebar = ({
  activeComponent,
  onComponentSelect,
}: SidebarProps) => {
  return (
    <div className="h-full w-80 overflow-y-auto border-border border-r bg-background">
      <div className="p-6">
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
                        activeComponent === item.id ? 'default' : 'ghost'
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
      </div>
    </div>
  );
};
