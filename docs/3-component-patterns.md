# 组件模式

优先使用 shadcn 的 cli 添加 shadcn 组件，其次再自行编写。
## 目录结构
```
src/lib/
├── components/     # 可复用组件
├── layout/         # 布局组件
├── pages/          # 页面组件
└── utils/          # 工具函数
```

## 组件规范
```typescript
// Props 接口定义
interface ComponentProps {
  title: string;
  description?: string;
  className?: string;
}

// 组件实现
export function Component({ title, className }: ComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {title}
    </div>
  );
}
```

## 样式变体
```typescript
import { cva, type VariantProps } from "class-variance-authority";

const variants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-secondary",
    },
    size: {
      sm: "h-8 px-2",
      lg: "h-12 px-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
});
```

## 路由集成
```typescript
// routes/page.tsx
export const Route = createFileRoute('/page')({
  component: PageComponent,
})
``` 