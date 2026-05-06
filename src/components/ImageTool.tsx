import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Download, RefreshCw, BookOpen, Hammer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mdIt from 'markdown-it';
import { TOOL_DOCS } from '../data/toolDocs';

const MarkdownIt = (mdIt as any).default || mdIt;
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

interface ImageToolProps {
  id: string;
  name: string;
  description: string;
}

export default function ImageTool({ id, name, description }: ImageToolProps) {
  const [activeTab, setActiveTab] = useState<'tool' | 'docs'>('tool');
  const docContent = TOOL_DOCS[id] || `
# ${name}

${description}

## How to Use
1. Upload your image by clicking the upload area or dragging a file.
2. The workstation will process your request based on the selected configuration.
3. Your result will be displayed for download or copying.

## Features
- Fast client-side processing.
- No server uploads (privacy-focused).
- High-quality output.

## Use Cases
- Web asset optimization.
- Image format conversion for compatibility.
- Quick resizing tasks.
`;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [format, setFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setOutput(null);

      const img = document.createElement('img');
      img.src = url;
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspectRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspectRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const processImage = () => {
    if (!file || !preview) return;
    setLoading(true);

    const img = document.createElement('img');
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      let targetFormat = format;
      if (id === 'jpg-to-png' || id === 'gif-to-png' || id === 'bmp-to-png') targetFormat = 'png';
      if (id === 'png-to-jpg' || id === 'gif-to-jpg' || id === 'bmp-to-jpg') targetFormat = 'jpeg';
      
      if (id === 'image-resize') {
        canvas.width = width;
        canvas.height = height;
      } else if (id === 'image-crop') {
        // Simple center square crop if crop is requested without complex UI
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (id === 'image-crop') {
          const size = Math.min(img.width, img.height);
          const x = (img.width - size) / 2;
          const y = (img.height - size) / 2;
          ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
        } else if (id === 'image-resize') {
          ctx.drawImage(img, 0, 0, width, height);
        } else {
          ctx.drawImage(img, 0, 0);
        }
        
        if (id === 'image-to-base64') {
          setOutput(canvas.toDataURL(file.type));
        } else {
          setOutput(canvas.toDataURL(`image/${targetFormat}`));
        }
      }
      setLoading(false);
    };
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">{name}</h1>
          <p className="text-slate-400 font-medium max-w-2xl">{description}</p>
        </div>
        
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
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tool' ? (
          <motion.div
            key="tool-ui"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm flex flex-col gap-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Upload Section */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${preview ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'}`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-64 rounded-xl shadow-lg object-contain" />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-slate-300 font-bold mb-1">Click or Drag Image</p>
                      <p className="text-slate-500 text-xs">Supports PNG, JPG, WebP, GIF</p>
                    </div>
                  </>
                )}
              </div>

              {/* Output / Controls */}
              <div className="flex flex-col justify-center gap-8">
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-8">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Processing Configuration</h3>
                  <div className="space-y-6">
                    {id === 'image-converter' && (
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-400">Target Format</label>
                        <div className="flex gap-2">
                          {['png', 'jpeg', 'webp'].map(fmt => (
                            <button 
                              key={fmt}
                              onClick={() => setFormat(fmt)}
                              className={`flex-1 px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${format === fmt ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700'}`}
                            >
                              {fmt.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {id === 'image-resize' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-400">Width (px)</label>
                          <input 
                            type="number" 
                            value={width || ''} 
                            onChange={(e) => handleWidthChange(Number(e.target.value))}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-slate-400">Height (px)</label>
                          <input 
                            type="number" 
                            value={height || ''} 
                            onChange={(e) => handleHeightChange(Number(e.target.value))}
                            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="aspectRatio"
                            checked={maintainAspectRatio}
                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            className="rounded border-slate-800 bg-slate-900 text-indigo-600 focus:ring-offset-slate-950"
                          />
                          <label htmlFor="aspectRatio" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Maintain Aspect Ratio</label>
                        </div>
                      </div>
                    )}
                    
                    <button 
                      disabled={!file || loading}
                      onClick={processImage}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed h-12"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      {loading ? 'Processing...' : id.includes('to-') ? 'Execute Conversion' : 'Execute Processing'}
                    </button>
                  </div>
                </div>

                {output && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
                        <Download className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-emerald-400 font-bold text-sm">Output Ready</p>
                        <p className="text-slate-500 text-[10px] font-mono truncate">{id === 'image-to-base64' ? 'Base64 Encoded text' : `Size: ${(output.length / 1.37 / 1024).toFixed(1)} KB`}</p>
                      </div>
                    </div>
                    <button 
                      onClick={id === 'image-to-base64' ? () => {navigator.clipboard.writeText(output); alert('Copied to clipboard!');} : () => {
                        const link = document.createElement('a');
                        link.href = output;
                        let ext = format;
                        if (id.includes('-to-')) ext = id.split('-to-')[1];
                        if (ext === 'jpeg') ext = 'jpg';
                        link.download = `output.${ext}`;
                        link.click();
                      }}
                      className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
                    >
                      {id === 'image-to-base64' ? 'Copy String' : 'Download'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {id === 'image-to-base64' && output && (
              <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Base64 Sequence Preview</label>
                <div className="font-mono text-[10px] text-indigo-300/60 break-all max-h-32 overflow-y-auto scrollbar-none selection:bg-indigo-500/30">
                  {output}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="docs-ui"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 lg:p-12 prose prose-invert prose-indigo max-w-none"
          >
            <div dangerouslySetInnerHTML={{ __html: md.render(docContent || 'No documentation available.') }} />
            <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
              <div className="text-slate-500 text-sm italic">
                * All image processing happens locally in your browser. Files are never uploaded to our servers.
              </div>
              <a 
                href={`https://www.google.com/search?q=${encodeURIComponent(name + ' file format official documentation')}`}
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
