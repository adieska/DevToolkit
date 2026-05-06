import { useState, ReactNode } from 'react';
import { Copy, Check, RotateCcw, BookOpen, Hammer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mdIt from 'markdown-it';
import { TOOL_DOCS } from '../data/toolDocs';

const MarkdownIt = (mdIt as any).default || mdIt;
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

interface ToolLayoutProps {
  id: string;
  title: string;
  description: string;
  input?: string;
  setInput?: (val: string) => void;
  output: string;
  customOutput?: ReactNode;
  error?: string;
  controls?: ReactNode;
  hideInput?: boolean;
  presets?: { label: string; value: string }[];
}

export default function ToolLayout({ 
  id,
  title, 
  description, 
  input = '', 
  setInput = () => {}, 
  output, 
  customOutput,
  error,
  controls,
  hideInput = false,
  presets = []
}: ToolLayoutProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tool' | 'docs'>('tool');

  const docContent = TOOL_DOCS[id] || `
# ${title}

${description}

## How to Use
1. Enter your input data into the "Input Buffer".
2. The workstation will process your request in real-time or upon clicking the action button.
3. Your result will be displayed in the "Result Stream" section.

## Features
- Standard formatting and conversion.
- Privacy-focused: Processing happens locally in your browser.
- Clean, minimal professional output.

## Use Cases
- Developer workflow optimization.
- Data sanitization and transformation.
- Quick utility tasks.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">{title}</h1>
          <p className="text-slate-400 font-medium max-w-2xl">{description}</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex bg-slate-900/50 p-1 rounded-xl self-start md:self-end border border-slate-800">
            <button
              onClick={() => setActiveTab('tool')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'tool' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" />
              Workstation
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'docs' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Documentation
            </button>
          </div>
          {controls && activeTab === 'tool' && (
            <div className="flex flex-wrap gap-3 md:justify-end">
              {controls}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tool' ? (
          <motion.div
            key="tool-ui"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`grid grid-cols-1 ${hideInput ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-8 h-full`}
          >
            {!hideInput && (
              <div className="flex flex-col gap-4 group">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Input Buffer</label>
                  <div className="flex items-center gap-2">
                    {presets.length > 0 && (
                      <div className="flex items-center gap-1.5 mr-2">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-1">Smart Presets:</span>
                        {presets.map((p, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInput(p.value)}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-[9px] font-bold text-slate-400 hover:text-indigo-400 transition-all uppercase"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <button 
                      onClick={() => setInput('')}
                    className="p-1.5 hover:bg-slate-900 rounded-lg transition-colors text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-800"
                    title="Clear input"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                className="input-area h-[400px]"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="System awaiting input payload..."
                />
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between h-8">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Result Stream</label>
                {output && !error && (
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Result'}
                  </button>
                )}
              </div>
              <div className={`output-area relative h-[400px] flex flex-col ${error ? 'border-red-500/30 bg-red-500/5' : 'bg-slate-950/40 backdrop-blur-sm'}`}>
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-sm font-mono p-2"
                    >
                      <span className="text-red-500 font-bold mr-2">[!]</span>
                      {error}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="output"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 h-full"
                    >
                      {customOutput ? (
                        <div className="h-full flex items-center justify-center">
                          {customOutput}
                        </div>
                      ) : output ? (
                        <div className="h-full font-mono text-indigo-300/90 selection:bg-indigo-500/50 whitespace-pre-wrap break-all overflow-y-auto p-4">
                          {output}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">
                          Awaiting processing...
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="docs-ui"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 lg:p-12 prose prose-invert prose-indigo max-w-none"
          >
            <div 
              dangerouslySetInnerHTML={{ __html: md.render(docContent || 'No documentation available.') }} 
            />
            <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-slate-500 text-sm italic">
                * All processing is performed locally in your browser. No data is sent to our servers.
              </div>
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(title + ' official specs documentation')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm transition-colors group"
              >
                View Official Reference
                <BookOpen className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
