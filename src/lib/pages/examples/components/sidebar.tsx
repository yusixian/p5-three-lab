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
    title: 'P5.js Animate',
    items: [
      { id: 'dynamic-particle-gl', name: 'Dynamic Particle GL', isNew: true },
    ],
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
  return (
    <div className="h-full w-full border-border border-r bg-background">
      <div className="h-full overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Component Categories */}
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category.title}>
                <h3 className="mb-3 font-semibold text-foreground text-sm">
                  {category.title}
                </h3>
                <div className="space-y-1">
                  {category.items.length === 0 ? (
                    <div className="px-3 py-2 text-muted-foreground/60 text-sm italic">
                      Coming soon...
                    </div>
                  ) : (
                    category.items.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => onComponentSelect(item.id)}
                        className={`group relative w-full rounded-md px-3 py-2 text-left text-sm transition-all duration-200 ${
                          activeComponent === item.id
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex gap-1">
                            {item.isNew && (
                              <span className="rounded bg-green-500/20 px-1.5 py-0.5 font-medium text-green-600 text-xs dark:text-green-400">
                                New
                              </span>
                            )}
                            {item.isUpdated && (
                              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 font-medium text-blue-600 text-xs dark:text-blue-400">
                                Updated
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Active indicator */}
                        {activeComponent === item.id && (
                          <div className="-translate-y-1/2 absolute top-1/2 left-0 h-4 w-0.5 rounded-r-full bg-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
