# 样式系统

## Tailwind CSS 4.0
- 全局样式：`src/lib/styles/globals.css`
- 工具函数：`cn()` 用于合并类名

## 主题切换
```typescript
// 主题提供者
import { useTheme } from '@/lib/components/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      切换主题
    </button>
  );
}
```

## 工具函数
```typescript
// lib/utils/index.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 使用方式
<div className={cn(
  "base-styles",
  condition && "conditional-styles",
  className
)}>
```