import { createHighlighter, type Highlighter } from 'shiki';
import { useEffect, useState } from 'react';

import { Button } from '@/lib/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}

const THEMES = {
  dark: 'tokyo-night',
  light: 'min-light',
} as const;

const LANGUAGES = [
  'typescript',
  'tsx',
  'javascript',
  'jsx',
  'css',
  'html',
  'json',
  'glsl',
];

let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighterInstance = () => {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: Object.values(THEMES),
      langs: LANGUAGES,
    });
  }
  return highlighterPromise;
};

export const CodeBlock = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  theme = 'dark',
  className,
}: CodeBlockProps) => {
  const [highlightedCode, setHighlightedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        setIsLoading(true);
        const highlighter = await getHighlighterInstance();
        
        const html = highlighter.codeToHtml(code, {
          lang: language,
          theme: THEMES[theme],
          transformers: showLineNumbers
            ? [
                {
                  name: 'line-numbers',
                  line(node, line) {
                    node.children.unshift({
                      type: 'element',
                      tagName: 'span',
                      properties: {
                        class: 'line-number',
                        'data-line': line,
                      },
                      children: [
                        {
                          type: 'text',
                          value: String(line).padStart(3, ' '),
                        },
                      ],
                    });
                  },
                },
              ]
            : [],
        });
        
        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
        setHighlightedCode(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();
  }, [code, language, theme, showLineNumbers]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('rounded-lg border bg-muted p-4', className)}>
        <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
          Highlighting code...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border bg-card', className)}>
      {filename && (
        <div className="flex items-center justify-between border-border border-b bg-muted/50 px-4 py-2">
          <span className="font-mono text-muted-foreground text-sm">{filename}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="h-7 px-2 text-xs"
          >
            Copy
          </Button>
        </div>
      )}
      <div className="relative overflow-x-auto">
        <div
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className="overflow-x-auto [&_.shiki]:!bg-transparent [&_.shiki]:p-4 [&_.shiki]:font-mono [&_.shiki]:text-sm [&_.shiki]:leading-relaxed [&_.line-number]:mr-4 [&_.line-number]:w-12 [&_.line-number]:inline-block [&_.line-number]:text-right [&_.line-number]:text-muted-foreground [&_.line-number]:select-none [&_.line-number]:border-r [&_.line-number]:border-border [&_.line-number]:pr-3"
        />
        {!filename && (
          <Button
            size="sm"
            onClick={copyToClipboard}
            className="absolute top-2 right-2 h-7 px-2 text-xs opacity-60 hover:opacity-100"
          >
            Copy
          </Button>
        )}
      </div>
    </div>
  );
};