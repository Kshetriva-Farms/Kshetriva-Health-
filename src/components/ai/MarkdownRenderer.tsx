'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-100 bg-slate-800/40 px-1 py-0.5 rounded">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="bg-slate-800 text-emerald-400 font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-700">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = (keyPrefix: string) => {
      if (listBuffer.length > 0 && listType) {
        if (listType === 'ul') {
          elements.push(
            <ul key={`${keyPrefix}-ul`} className="list-disc list-inside space-y-1 my-2 text-slate-200">
              {listBuffer.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`${keyPrefix}-ol`} className="list-decimal list-inside space-y-1 my-2 text-slate-200">
              {listBuffer.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        }
        listBuffer = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 3: ### Heading
      if (trimmed.startsWith('### ')) {
        flushList(`line-${index}`);
        elements.push(
          <h3 key={index} className="text-sm font-bold text-emerald-400 mt-3 mb-1.5 flex items-center gap-1.5">
            {renderInlineFormatting(trimmed.replace('### ', ''))}
          </h3>
        );
        return;
      }

      // Heading 2: ## Heading
      if (trimmed.startsWith('## ')) {
        flushList(`line-${index}`);
        elements.push(
          <h2 key={index} className="text-base font-bold text-teal-300 mt-4 mb-2 pb-1 border-b border-slate-800">
            {renderInlineFormatting(trimmed.replace('## ', ''))}
          </h2>
        );
        return;
      }

      // Heading 1: # Heading
      if (trimmed.startsWith('# ')) {
        flushList(`line-${index}`);
        elements.push(
          <h1 key={index} className="text-lg font-extrabold text-emerald-300 mt-4 mb-2">
            {renderInlineFormatting(trimmed.replace('# ', ''))}
          </h1>
        );
        return;
      }

      // Bullet List item: * or -
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (listType !== 'ul') flushList(`line-${index}`);
        listType = 'ul';
        listBuffer.push(trimmed.replace(/^[-*]\s+/, ''));
        return;
      }

      // Numbered List item: 1. 2. etc
      if (/^\d+\.\s+/.test(trimmed)) {
        if (listType !== 'ol') flushList(`line-${index}`);
        listType = 'ol';
        listBuffer.push(trimmed.replace(/^\d+\.\s+/, ''));
        return;
      }

      // Blockquote / Tip: > text
      if (trimmed.startsWith('> ')) {
        flushList(`line-${index}`);
        elements.push(
          <blockquote key={index} className="pl-3 py-1.5 my-2 border-l-2 border-emerald-500 bg-emerald-500/10 text-emerald-200 text-xs rounded-r-lg font-medium">
            {renderInlineFormatting(trimmed.replace('> ', ''))}
          </blockquote>
        );
        return;
      }

      // Empty line
      if (!trimmed) {
        flushList(`line-${index}`);
        return;
      }

      // Regular line
      flushList(`line-${index}`);
      elements.push(
        <p key={index} className="my-1 text-slate-200 leading-relaxed">
          {renderInlineFormatting(trimmed)}
        </p>
      );
    });

    flushList('final');
    return elements;
  };

  return <div className={`space-y-1 ${className}`}>{formatText(content)}</div>;
};
