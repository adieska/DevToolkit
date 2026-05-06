import { useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogPosts';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, User, Clock, ChevronLeft, ArrowRight, Share2 } from 'lucide-react';
import mdIt from 'markdown-it';

const MarkdownIt = (mdIt as any).default || mdIt;
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <button 
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-widest">Back to Journal</span>
        </button>

        <article className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                 {selectedPost.category}
               </span>
               <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPost.date}
               </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
              {selectedPost.title}
            </h1>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 font-bold">
                  {selectedPost.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedPost.author}</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedPost.readTime} read
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="aspect-[21/9] w-full bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 group">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-50 group-hover:opacity-70 transition-opacity"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <selectedPost.icon className="w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-700" />
             </div>
          </div>

          <div className="prose prose-invert prose-indigo max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-400 prose-p:leading-relaxed prose-strong:text-white prose-code:text-indigo-300">
             <div dangerouslySetInnerHTML={{ __html: md.render(selectedPost.content) }} />
          </div>

          <div className="pt-12 mt-12 border-t border-slate-900">
             <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
               <h3 className="text-xl font-bold text-white">Join the DevToolKit Newsletter</h3>
               <p className="text-slate-400 max-w-lg mx-auto text-sm">Get the latest tools, productivity hacks, and engineering tutorials delivered straight to your inbox.</p>
               <div className="flex max-w-md mx-auto gap-2">
                 <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                 />
                 <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20">
                   Subscribe
                 </button>
               </div>
             </div>
          </div>
        </article>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <BookOpen className="w-6 h-6" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Journal</h1>
          </div>
          <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
            Deep dives into our engineering process, architectural decisions, and tutorials on mastering the developer toolkit.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
           {['Latest', 'Most Read', 'Tutorials'].map(tab => (
             <button key={tab} className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${tab === 'Latest' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, idx) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedPost(post)}
            className="group cursor-pointer flex flex-col h-full bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 hover:bg-slate-900/50 transition-all"
          >
            <div className="aspect-video w-full bg-slate-950 p-8 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <post.icon className="w-16 h-16 text-slate-800 group-hover:scale-110 group-hover:text-indigo-500/20 transition-all duration-700" />
               <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-slate-900 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-800">
                    {post.category}
                  </span>
               </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>{post.readTime} read</span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                {post.title}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-auto pt-6 flex items-center gap-2 text-indigo-400 text-xs font-bold group-hover:gap-3 transition-all">
                Read Article
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
