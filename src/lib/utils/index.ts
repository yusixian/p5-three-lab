import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

// Dynamic source code loading utility
export async function loadSourceCodes(
  componentPath: string,
): Promise<Record<string, string>> {
  const sourceFiles: Record<string, string> = {};

  try {
    // Use dynamic import to get the source code as text
    // This is a workaround to load source files in Vite
    const modules = import.meta.glob(
      '/src/lib/pages/examples/components/demos/**/*.{ts,tsx}',
      {
        query: '?raw',
        import: 'default',
      },
    );

    for (const [path, module] of Object.entries(modules)) {
      if (path.includes(componentPath)) {
        const fileName = path.split('/').pop() || '';
        const content = (await module()) as string;
        sourceFiles[fileName] = content;
      }
    }
  } catch (error) {
    console.error('Failed to load source codes:', error);
  }

  return sourceFiles;
}

export function toRadians(angle: number) {
  return angle * (Math.PI / 180);
}
