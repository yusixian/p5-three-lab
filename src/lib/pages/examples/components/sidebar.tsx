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
    <div className="w-80 bg-background border-r border-border h-full overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Components
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore reusable creative components
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.items.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground/60 italic">
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
                      className={`w-full justify-between h-auto px-3 py-3 text-sm transition-all duration-200 ${
                        activeComponent === item.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <div className="flex gap-1">
                        {item.isNew && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-medium">
                            New
                          </span>
                        )}
                        {item.isUpdated && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
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
