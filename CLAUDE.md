# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Basic Commands
- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build production version to `dist/` directory
- `pnpm serve` - Preview production build locally

### Code Quality
- `pnpm type:check` - Run TypeScript type checking
- `pnpm biome:check` - Run Biome linting and formatting checks
- `pnpm biome:fix` - Auto-fix Biome issues
- `pnpm biome:ci` - Run Biome checks in CI mode
- `pnpm check:turbo` - Run all checks (biome, type-check, test) using Turbo

### Testing
- `pnpm test` - Run all tests
- `pnpm test:ui` - Run tests with UI and coverage
- `pnpm test:coverage` - Run tests with coverage report

## Workflow Memories
- Always run `nr biome:fix` or `nr biome:check` and fix error after code changes

## Architecture Overview

This is a React + Three.js laboratory for experimental 3D graphics components, built with:

### Core Stack
- **React 19** with TypeScript
- **Vite** as build tool with Hot Module Replacement
- **TanStack Router** for file-based routing with type safety
- **Three.js** for 3D graphics and WebGL
- **Tailwind CSS v4** with custom design system
- **Biome** for linting/formatting (not ESLint/Prettier)

### Key Dependencies
- **GSAP** - Animation library for smooth transitions
- **Jotai** - State management
- **Leva** - GUI controls for development/debugging
- **Motion** - Animation library
- **Radix UI** - Headless UI components

### Project Structure
```
src/
├── lib/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (Button, Tooltip)
│   │   └── theme-*       # Theme-related components
│   ├── hooks/            # Custom React hooks
│   ├── layout/           # Layout components (Header, Footer)
│   ├── pages/            # Page components
│   │   └── examples/     # Demo showcase pages
│   │       └── components/demos/  # Individual 3D demos
│   ├── styles/           # Global CSS
│   └── utils/            # Utility functions
├── routes/               # TanStack Router route definitions
└── main.tsx             # Application entry point
```

### Routing Architecture
- Uses TanStack Router with file-based routing
- Route tree is auto-generated in `routeTree.gen.ts`
- Root route (`__root.tsx`) provides global layout and meta tags
- Examples page has special layout without header/footer

### 3D Graphics Architecture
- Each demo is a self-contained component in `src/lib/pages/examples/components/demos/`
- Demos use `useGLActive` hook for WebGL lifecycle management
- Three.js setup includes:
  - Scene, Camera, Renderer setup
  - OrbitControls for user interaction
  - GSAP animations for smooth transitions
  - Proper cleanup and resize handling

### Code Standards (Biome Configuration)
- **No default exports** except for page components and certain config files
- **Kebab-case** file naming convention
- **Single quotes** for JavaScript strings
- **No console logs** except `console.error` and `console.info`
- **Sorted Tailwind classes** enforced
- **Strict TypeScript** with unused import/variable detection

### Development Patterns
- Use `forwardRef` and `useImperativeHandle` for Three.js component refs
- Custom hooks for responsive behavior (`useIsPortrait`, `useIsMobile`)
- Theme provider wraps entire application
- Conditional layout rendering based on route

### Three.js Demo Structure
Each 3D demo follows this pattern:
1. **Container ref** for DOM mounting
2. **Group ref** for Three.js object manipulation
3. **useGLActive hook** for lifecycle management
4. **Cleanup functions** for proper resource disposal
5. **Responsive handling** with ResizeObserver
6. **Animation loop** with requestAnimationFrame

When working with this codebase:
- Always run `pnpm biome:fix` before committing
- Use `pnpm type:check` to verify TypeScript compliance
- Test 3D demos across different viewport sizes
- Follow the established Three.js component patterns for new demos