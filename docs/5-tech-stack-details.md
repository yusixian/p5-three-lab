# 技术栈

## 核心技术
- **React 19** - UI 库，并发特性
- **TypeScript 5.7** - 类型安全，严格模式
- **Vite 6.1** - 构建工具，HMR
- **TanStack Router 1.121** - 类型安全路由

## 开发工具
- **Biome 2.0** - 格式化和代码检查
- **Vitest 3.2** - 测试框架
- **Tailwind CSS 4.0** - 样式框架

## 关键配置

### TypeScript 严格配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 路由使用
```typescript
// 路由定义
export const Route = createFileRoute('/users/$userId')({
  component: UserPage,
  loader: ({ params }) => fetchUser(params.userId),
})

// 导航
<Link to="/users/$userId" params={{ userId: '123' }}>
  User 123
</Link>
```

### 数据验证 (Zod)
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;
```

## 文件结构
- `/src/main.tsx` - 应用入口
- `/src/routes/` - 路由文件
- `/src/lib/` - 组件和工具
- `/public/` - 静态资源 