import { useState } from 'react';
import { 
  Search, 
  Menu, 
  Settings2, 
  Star,
  LayoutGrid,
  ChevronRight,
  Hammer,
  Zap,
  Clock,
  Globe,
  Lock,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS, CATEGORIES, Tool, ToolCategory } from './types';

// Components
import Formatter from './components/Formatter';
import Encoder from './components/Encoder';
import Converter from './components/Converter';
import CryptoTool from './components/CryptoTool';
import TextTool from './components/TextTool';
import GeneratorTool from './components/GeneratorTool';
import NetworkingTool from './components/NetworkingTool';
import TimeTool from './components/TimeTool';
import DataTool from './components/DataTool';
import ImageTool from './components/ImageTool';
import MathTool from './components/MathTool';
import Blog from './components/Blog';
import Settings from './components/Settings';

export default function App() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [currentPage, setCurrentPage] = useState<'tools' | 'blog'>('tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'midnight' | 'carbon'>('dark');
  const [density, setDensity] = useState<'relaxed' | 'compact'>('relaxed');

  const themeClasses = {
    dark: 'bg-slate-950 text-slate-200',
    midnight: 'bg-[#0a0c10] text-slate-300',
    carbon: 'bg-black text-slate-400'
  };

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderContent = () => {
    if (currentPage === 'blog') return <Blog />;
    if (!selectedTool) return <HomeDashboard tools={filteredTools} activeCategory={activeCategory} onSelect={setSelectedTool} searchQuery={searchQuery} onNavigate={setCurrentPage} />;

    const category = selectedTool.category;
    if (category === 'Formatters') return <Formatter {...selectedTool} />;
    if (category === 'Encoders/Decoders') return <Encoder {...selectedTool} />;
    if (category === 'Converters') return <Converter {...selectedTool} />;
    if (category === 'Cryptography') return <CryptoTool {...selectedTool} />;
    if (category === 'Text Tools') return <TextTool {...selectedTool} />;
    if (category === 'Generators') return <GeneratorTool {...selectedTool} />;
    if (category === 'Networking') return <NetworkingTool {...selectedTool} />;
    if (category === 'Time') return <TimeTool {...selectedTool} />;
    if (category === 'Data Tools') return <DataTool {...selectedTool} />;
    if (category === 'Math Tools') return <MathTool {...selectedTool} />;
    if (category === 'Image Tools') return <ImageTool {...selectedTool} />;
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <Zap className="w-12 h-12 mb-4 text-indigo-500 opacity-50" />
        <h2 className="text-xl font-semibold text-slate-300">{selectedTool.name}</h2>
        <p>Implementation coming soon logic for {selectedTool.id}</p>
      </div>
    );
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans selection:bg-indigo-500/30 transition-colors duration-300 ${themeClasses[theme]} ${density === 'compact' ? 'compact-layout' : ''}`}>
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className={`w-72 border-r flex flex-col z-50 overflow-hidden transition-colors duration-300 ${theme === 'midnight' ? 'bg-[#0a0c10] border-indigo-900/30' : theme === 'carbon' ? 'bg-black border-slate-900' : 'bg-slate-950 border-slate-900'}`}
          >
            <div className={`p-6 border-b flex items-center gap-3 transition-colors duration-300 ${theme === 'midnight' ? 'border-indigo-900/30' : 'border-slate-900'}`}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-500/20">D</div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-tight">DevToolKit</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Essential Dev Tools</p>
              </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto space-y-8 mt-4 scrollbar-none">
              <div className="space-y-1">
                <h2 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Navigation</h2>
                <button 
                  onClick={() => { setCurrentPage('tools'); setActiveCategory('All'); setSelectedTool(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentPage === 'tools' && activeCategory === 'All' && !selectedTool ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Explore Library
                </button>
                <button 
                  onClick={() => { setCurrentPage('blog'); setSelectedTool(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${currentPage === 'blog' ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  Technical Journal
                </button>
              </div>

              <div className="space-y-1">
                <h2 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Categories</h2>
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setCurrentPage('tools'); setActiveCategory(cat); setSelectedTool(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${currentPage === 'tools' && activeCategory === cat && !selectedTool ? 'bg-slate-900 text-indigo-400 border border-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
                  >
                   <ChevronRight className={`w-3 h-3 transition-transform ${currentPage === 'tools' && activeCategory === cat ? 'rotate-90 text-indigo-500' : 'text-slate-600 group-hover:text-slate-400'}`} />
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <h2 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Pinned Tools</h2>
                {TOOLS.slice(0, 4).map(tool => (
                  <button 
                    key={tool.id}
                    onClick={() => { setCurrentPage('tools'); setSelectedTool(tool); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${currentPage === 'tools' && selectedTool?.id === tool.id ? 'bg-slate-900 text-white border border-slate-800' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}
                  >
                    <tool.icon className={`w-4 h-4 ${currentPage === 'tools' && selectedTool?.id === tool.id ? 'text-indigo-400' : ''}`} />
                    {tool.name}
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-slate-900">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-400 font-medium">Free Tier</p>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase">Upgrade</p>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-1/3"></div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Header */}
        <header className={`h-20 border-b backdrop-blur-md px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300 ${theme === 'midnight' ? 'bg-[#0a0c10]/80 border-indigo-900/30' : theme === 'carbon' ? 'bg-black/80 border-slate-900' : 'bg-slate-950/80 border-slate-900'}`}>
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-xl w-full hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search essential developer tools..."
                className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-4 mr-4 text-right">
              <div>
                <p className="text-xs font-bold text-white leading-none">v2.4.0</p>
                <p className="text-[9px] text-emerald-400 font-medium mt-1">System Stable</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>
            <button 
              title="Favorites"
              className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-amber-400 transition-all border border-slate-900 active:scale-95"
              onClick={() => alert('Favorites feature coming soon! Mark tools to see them here.')}
            >
              <Star className="w-4 h-4" />
            </button>
            <button 
              title="Settings"
              className="p-2.5 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-900 active:scale-95"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto p-6 md:p-10 transition-colors duration-300 ${theme === 'midnight' ? 'bg-[#0a0c10]' : theme === 'carbon' ? 'bg-black' : 'bg-slate-950'}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTool?.id || activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Status */}
        <footer className={`h-10 border-t px-6 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest transition-colors duration-300 ${theme === 'midnight' ? 'bg-[#0a0c10] border-indigo-900/30' : theme === 'carbon' ? 'bg-black border-slate-900' : 'bg-slate-950 border-slate-900'}`}>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Network: Online</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Session: Active</span>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-indigo-400">Logs →</span>
              <span>UTF-8</span>
            </div>
        </footer>
      </main>
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme}
        setTheme={setTheme}
        density={density}
        setDensity={setDensity}
      />
    </div>
  );
}

function HomeDashboard({ tools, activeCategory, onSelect, searchQuery, onNavigate }: { tools: Tool[], activeCategory: string, onSelect: (tool: Tool) => void, searchQuery: string, onNavigate: (page: 'tools' | 'blog') => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-10 text-left">
      {/* Hero Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-indigo-600 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[320px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <Hammer className="w-64 h-64 -mr-20 -mt-20" />
          </div>
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">Platform Highlight</span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-6 tracking-tight max-w-xl">
              Essential Tools for <br />
              <span className="text-indigo-200">Modern Developers</span>
            </h1>
          </div>
          <div className="relative z-10 flex flex-wrap gap-3 mt-8">
            <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-xl shadow-indigo-900/20 hover:scale-105 transition-transform" onClick={() => onSelect(tools[0])}>Get Started</button>
            <button className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm border border-indigo-400 hover:bg-indigo-400 transition-all" onClick={() => onNavigate('blog')}>Browse Journal</button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col text-center items-center justify-center group cursor-pointer hover:border-slate-700 transition-all">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
             <ArrowUpRight className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">System Status</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">All systems are operational with 99.9% uptime across all encoding and conversion clusters.</p>
          <div className="flex -space-x-3 mt-auto">
             {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800"></div>)}
             <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">+50</div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
             {activeCategory === 'All' ? 'Latest Discoveries' : activeCategory}
          </h2>
          <p className="text-sm font-medium text-slate-500">{tools.length} Tools Available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, idx) => (
            <motion.div 
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="tool-card relative group"
              onClick={() => onSelect(tool)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl transition-colors ${idx % 3 === 0 ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : idx % 3 === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                  <tool.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{tool.description}</p>
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{tool.category}</span>
                <span className="text-[9px] text-slate-700 font-mono">v1.2.0</span>
              </div>
            </motion.div>
          ))}

          {tools.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
              <div className="bg-slate-900 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No tools found matching "{searchQuery}"</h3>
              <p className="text-slate-600 text-sm mt-2">Try adjusting your search or category filters</p>
              <button onClick={() => window.location.reload()} className="text-indigo-400 font-bold mt-6 hover:underline text-sm uppercase tracking-widest">Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
