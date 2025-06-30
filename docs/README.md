# Project Documentation Index

## Overview
This documentation provides AI-readable context for the p5-three-lab project - a modern React TypeScript application with Vite, TanStack Router, and Tailwind CSS.

## Documentation Structure

### 1. [Project Structure](./1-project-structure.md)
**Purpose**: Understanding the codebase organization
- Source code layout (`src/lib/`)
- Key configuration files
- Component organization patterns
- Tech stack overview

### 2. [Development Guide](./2-development-guide.md)
**Purpose**: Development workflow and standards
- Environment setup and scripts
- Code quality tools (Biome, TypeScript, Vitest)
- Git workflow and commit conventions
- Performance and testing strategies

### 3. [Component Patterns](./3-component-patterns.md)
**Purpose**: Component development guidelines
- Component organization and types
- TypeScript interfaces and prop patterns
- Styling patterns with class variants
- State management approaches
- Testing patterns and best practices

### 4. [Styling System](./4-styling-system.md)
**Purpose**: Tailwind CSS and theme implementation
- Tailwind CSS 4.0 configuration
- Theme system (dark/light mode)
- Utility functions (`cn` helper)
- Component styling patterns
- Design tokens and responsive design

### 5. [Tech Stack Details](./5-tech-stack-details.md)
**Purpose**: Deep dive into each technology
- React 19 with concurrent features
- TypeScript 5.7 strict configuration
- Vite 6.1 build system
- TanStack Router type-safe routing
- Development tools integration

## Quick Reference

### Common Patterns
```typescript
// Component with props and styling
interface ComponentProps {
  title: string;
  className?: string;
}

export function Component({ title, className }: ComponentProps) {
  return (
    <div className={cn("base-styles", className)}>
      {title}
    </div>
  );
}
```

### Key Utilities
```typescript
// Class name merging
import { cn } from "@/lib/utils";

// Component variants
import { cva } from "class-variance-authority";

// Type validation
import { z } from "zod";

// Routing
import { createFileRoute } from "@tanstack/react-router";
```

### Development Commands
```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build

# Quality checks
pnpm biome:fix        # Format and lint
pnpm type:check       # TypeScript check
pnpm test             # Run tests
pnpm check:turbo      # All checks
```

## Architecture Summary

### Frontend Stack
- **React 19** - UI with concurrent features
- **TypeScript 5.7** - Strict type safety
- **Vite 6.1** - Fast build tool
- **TanStack Router** - Type-safe routing
- **Tailwind CSS 4.0** - Utility-first styling

### Development Tools
- **Biome** - Fast formatting and linting
- **Vitest** - Testing framework
- **Husky** - Git hooks
- **PNPM** - Package management

### Code Organization
- Feature-based component grouping
- Co-located related components
- Consistent TypeScript interfaces
- Utility-first styling approach

## AI Development Context

### When Creating Components:
1. Use TypeScript interfaces for props
2. Apply styling with `cn()` utility
3. Follow responsive design patterns
4. Implement proper error boundaries

### When Modifying Routing:
1. Use TanStack Router file-based routing
2. Ensure type safety for route parameters
3. Co-locate page components in `lib/pages/`

### When Styling:
1. Use Tailwind utilities with class variants
2. Apply responsive design mobile-first
3. Leverage theme system for dark/light mode
4. Use consistent spacing and design tokens

### When Testing:
1. Use Vitest with React Testing Library
2. Test component behavior, not implementation
3. Ensure accessibility in tests
4. Mock external dependencies appropriately

This documentation structure provides comprehensive context for AI assistance while maintaining focus on practical development needs. 