import { useRef } from 'react';
import { X, Moon, Layout, Shield, Trash2, Check, Maximize, Zap, Download, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'midnight' | 'carbon';
  setTheme: (theme: 'dark' | 'midnight' | 'carbon') => void;
  density: 'relaxed' | 'compact';
  setDensity: (density: 'relaxed' | 'compact') => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
}

export default function Settings({ isOpen, onClose, theme, setTheme, density, setDensity, onReset, onExport, onImport }: SettingsProps) {
  const importInputRef = useRef<HTMLInputElement>(null);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 bottom-0 w-full max-w-md border-l z-[101] shadow-2xl flex flex-col ${theme === 'midnight' ? 'bg-[#0a0c10] border-indigo-900/30' : theme === 'carbon' ? 'bg-black border-slate-900' : 'bg-slate-950 border-slate-900'}`}
          >
            <div className={`p-8 border-b flex items-center justify-between ${theme === 'midnight' ? 'border-indigo-900/30' : 'border-slate-900'}`}>
              <div>
                <h2 id="settings-title" className="text-2xl font-black text-white tracking-tight italic">PREFERENCES</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Application Configuration</p>
              </div>
              <button 
                aria-label="Close Settings"
                onClick={onClose}
                className="p-3 hover:bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95 border border-transparent hover:border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {/* Appearance Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Appearance</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'dark', name: 'Deep Slate', desc: 'Default optimized for productivity', color: 'bg-slate-950' },
                    { id: 'midnight', name: 'Midnight', desc: 'Elegant deep indigo tones', color: 'bg-[#0a0c10]' },
                    { id: 'carbon', name: 'Carbon Black', desc: 'OLED-friendly true black variant', color: 'bg-black' }
                  ].map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => setTheme(t.id as any)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${theme === t.id ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl border border-slate-800 ${t.color}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{t.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{t.desc}</p>
                      </div>
                      {theme === t.id && <Check className="w-5 h-5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Layout Density */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Layout className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Layout Density</h3>
                </div>
                
                <div className="flex gap-3">
                  {[
                    { id: 'relaxed', name: 'Relaxed', icon: Maximize },
                    { id: 'compact', name: 'Compact', icon: Zap }
                  ].map((d) => (
                    <button 
                      key={d.id}
                      onClick={() => setDensity(d.id as any)}
                      className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${density === d.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}
                    >
                      <d.icon className={`w-6 h-6 ${density === d.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className={`text-xs font-bold ${density === d.id ? 'text-white' : 'text-slate-400'}`}>{d.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Data & Privacy */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Privacy & Security</h3>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Shield className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white mb-1">Local-Only Processing</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium">All computations happen locally in your browser. No data ever leaves your machine unless you explicitly export it.</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <button
                        onClick={onExport}
                        className="flex items-center justify-center gap-2 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        Export Workspace
                      </button>
                      <button
                        onClick={() => importInputRef.current?.click()}
                        className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95"
                      >
                        <Upload className="w-4 h-4" />
                        Import Workspace
                      </button>
                      <input
                        ref={importInputRef}
                        type="file"
                        accept="application/json,.json"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void onImport(file);
                          event.target.value = '';
                        }}
                      />
                    </div>
                    <button 
                      onClick={() => {
                        onReset();
                        alert('Application cache cleared and reset to factory defaults.');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Local Data
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-8 border-t border-slate-900 bg-slate-900/20">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                <span>Core Engine v1.0.0</span>
                <span>ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
