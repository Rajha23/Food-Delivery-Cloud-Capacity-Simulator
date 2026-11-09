import React, { useState } from 'react';
import { Copy, Check, Code, FileCode } from 'lucide-react';

export default function CodeSnippetViewer({ snippets = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!snippets || snippets.length === 0) return null;
  const current = snippets[activeIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Tab bar header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {snippets.map((snip, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition ${
                activeIdx === idx
                  ? 'bg-slate-800 text-orange-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              <span>{snip.title}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition border border-slate-700"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code viewport */}
      <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed max-h-[380px] bg-slate-950/90">
        <pre className="text-slate-300">
          <code>{current.code}</code>
        </pre>
      </div>

      {current.note && (
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span>{current.note}</span>
        </div>
      )}
    </div>
  );
}
