import { useState, useEffect } from 'react';
import { RefreshCw, Play, Copy, Check, Download, Youtube } from 'lucide-react';
import RandExp from 'randexp';
import QRCode from 'qrcode';
import ToolLayout from './ToolLayout';

interface GeneratorToolProps {
  id: string;
  name: string;
  description: string;
}

export default function GeneratorTool({ id, name, description }: GeneratorToolProps) {
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Parameters
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [regex, setRegex] = useState('[a-z0-9]{8,16}');
  const [inputText, setInputText] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  // QR Specific Options
  const [qrFg, setQrFg] = useState('#000000');
  const [qrBg, setQrBg] = useState('#ffffff');
  const [qrMargin, setQrMargin] = useState(4);
  const [qrLevel, setQrLevel] = useState<'L'|'M'|'Q'|'H'>('M');

  const getPresets = () => {
    switch (id) {
      case 'qr-generator':
        return [
          { label: 'URL', value: 'https://horasweb.com' },
          { label: 'WiFi', value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;' },
          { label: 'WA', value: 'https://wa.me/123456789?text=Hello' },
          { label: 'Mail', value: 'mailto:admin@horasweb.com?subject=Inquiry' },
          { label: 'vCard', value: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTITLE:Developer\nEND:VCARD' }
        ];
      case 'youtube-link-generator':
        return [
          { label: 'URL', value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { label: 'ID Only', value: 'dQw4w9WgXcQ' }
        ];
      case 'regex-generator':
        return [
          { label: 'Email', value: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}' },
          { label: 'Password', value: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,16}' }
        ];
      case 'shuffle-letters':
      case 'pick-random':
        return [
          { label: 'Words', value: 'Developer\nDesigner\nManager\nProduct' },
          { label: 'Numbers', value: '100\n200\n300\n400' }
        ];
      default:
        return [];
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generate = () => {
    let result = '';
    
    switch (id) {
      case 'uuid-generator':
      case 'guid-generator':
        result = crypto.randomUUID();
        break;
      
      case 'password-generator': {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        for (let i = 0; i < length; i++) result += charset.charAt(Math.floor(Math.random() * charset.length));
        break;
      }
      
      case 'string-generator': {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let i = 0; i < length; i++) result += charset.charAt(Math.floor(Math.random() * charset.length));
        break;
      }

      case 'number-generator':
        result = Math.floor(Math.random() * (max - min + 1) + min).toString();
        break;

      case 'decimal-generator':
        result = (Math.random() * (max - min) + min).toFixed(4);
        break;

      case 'binary-generator': {
        for (let i = 0; i < length; i++) result += Math.round(Math.random());
        break;
      }

      case 'octal-generator': {
        for (let i = 0; i < length; i++) result += Math.floor(Math.random() * 8).toString();
        break;
      }

      case 'hex-generator': {
        const hex = "0123456789abcdef";
        for (let i = 0; i < length; i++) result += hex.charAt(Math.floor(Math.random() * 16));
        break;
      }

      case 'byte-generator': {
        const bytes = new Uint8Array(length);
        crypto.getRandomValues(bytes);
        result = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
        break;
      }

      case 'ip-generator':
        result = Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
        break;

      case 'mac-generator':
        result = Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':').toUpperCase();
        break;

      case 'date-generator': {
        const start = new Date(2000, 0, 1).getTime();
        const end = new Date().getTime();
        result = new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
        break;
      }

      case 'time-generator': {
        const h = Math.floor(Math.random() * 24).toString().padStart(2, '0');
        const m = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        const s = Math.floor(Math.random() * 60).toString().padStart(2, '0');
        result = `${h}:${m}:${s}`;
        break;
      }

      case 'json-generator': {
        const mock = Array.from({length: count}, (_, i) => ({
          id: i + 1,
          name: ['John', 'Jane', 'Bob', 'Alice'][Math.floor(Math.random() * 4)],
          email: `${['user', 'test', 'admin'][Math.floor(Math.random() * 3)]}${i}@example.com`,
          active: Math.random() > 0.5
        }));
        result = JSON.stringify(mock, null, 2);
        break;
      }

      case 'xml-generator': {
        result = '<?xml version="1.0" encoding="UTF-8"?>\n<items>\n';
        for(let i=0; i<count; i++) {
          result += `  <item id="${i+1}">\n    <name>${['Item A', 'Item B'][Math.floor(Math.random()*2)]}</name>\n  </item>\n`;
        }
        result += '</items>';
        break;
      }

      case 'yaml-generator': {
        result = 'items:\n';
        for(let i=0; i<count; i++) {
          result += `  - id: ${i+1}\n    name: ${['Dev', 'Ops', 'QA'][Math.floor(Math.random()*3)]}\n`;
        }
        break;
      }

      case 'csv-generator': {
        result = 'id,name,value\n';
        for(let i=0; i<count; i++) {
          result += `${i+1},Name${i},${Math.floor(Math.random()*100)}\n`;
        }
        break;
      }

      case 'tsv-generator': {
        result = 'id\tname\tvalue\n';
        for(let i=0; i<count; i++) {
          result += `${i+1}\tName${i}\t${Math.floor(Math.random()*100)}\n`;
        }
        break;
      }

      case 'regex-generator':
        try {
          result = new RandExp(regex).gen();
        } catch(e) { result = "Error: Invalid Regex"; }
        break;

      case 'shuffle-letters':
        result = inputText.split('').sort(() => Math.random() - 0.5).join('');
        break;

      case 'pick-random': {
        const lines = inputText.split('\n').filter(l => l.trim());
        result = lines.length ? lines[Math.floor(Math.random() * lines.length)] : "Empty list";
        break;
      }

      case 'prime-generator': {
        const n = count;
        const primes = [];
        let num = 2;
        while (primes.length < n) {
          let isPrime = true;
          for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
            if (num % i === 0) { isPrime = false; break; }
          }
          if (isPrime) primes.push(num);
          num++;
        }
        result = primes.join(', ');
        break;
      }

      case 'fibonacci-generator': {
        const n = count;
        const fib = [0, 1];
        for (let i = 2; i < n; i++) fib[i] = fib[i-1] + fib[i-2];
        result = fib.slice(0, n).join(', ');
        break;
      }

      case 'pi-generator': {
        // Limited precision by Math.PI, but can show up to ~15 decimal places
        result = Math.PI.toFixed(length > 20 ? 20 : length);
        break;
      }

      case 'euler-generator': {
        result = Math.E.toFixed(length > 20 ? 20 : length);
        break;
      }

      case 'qr-generator': {
        if (!inputText) {
          result = "Enter text to generate QR";
          setQrUrl('');
          break;
        }
        QRCode.toDataURL(inputText, { 
          width: 600, 
          margin: qrMargin, 
          errorCorrectionLevel: qrLevel,
          color: { 
            dark: qrFg, 
            light: qrBg 
          } 
        }, (err, url) => {
          if (!err) setQrUrl(url);
        });
        result = inputText;
        break;
      }

      case 'lorem-ipsum': {
        const words = [
          'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero', 
          'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 
          'pretium', 'quis', 'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros', 'dictum', 
          'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus', 'quisque', 
          'porttitor', 'ligula', 'dui', 'mollis', 'tempus', 'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam', 'tincidunt', 'id', 
          'condimentum', 'enim', 'sodales', 'in', 'hac', 'habitasse', 'platea', 'dictumst', 'aenean', 'neque', 'fusce', 'augue', 
          'leo', 'eget', 'semper', 'mattis', 'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada', 'rhoncus', 
          'porta', 'sem', 'aliquet', 'et', 'nam', 'suspendisse', 'potenti', 'vivamus', 'luctus', 'fringilla', 'erat', 'donec'
        ];
        const count_val = count || 5;
        const paragraphs = [];
        for (let i = 0; i < count_val; i++) {
          const sentenceCount = 3 + Math.floor(Math.random() * 5);
          const sentences = [];
          for (let j = 0; j < sentenceCount; j++) {
            const wordCount = 8 + Math.floor(Math.random() * 12);
            const sentence = [];
            for (let k = 0; k < wordCount; k++) {
              sentence.push(words[Math.floor(Math.random() * words.length)]);
            }
            const s = sentence.join(' ');
            sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
          }
          paragraphs.push(sentences.join(' '));
        }
        result = paragraphs.join('\n\n');
        break;
      }

      case 'youtube-link-generator': {
        const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = inputText.match(ytRegex);
        const videoId = match ? match[1] : (inputText.length === 11 ? inputText : null);

        if (!videoId) {
          result = "Enter a YouTube URL or 11-character Video ID";
          break;
        }

        result = `Video ID: ${videoId}\n\n`;
        result += `Standard: https://www.youtube.com/watch?v=${videoId}\n`;
        result += `Shortened: https://youtu.be/${videoId}\n`;
        result += `Embed: https://www.youtube.com/embed/${videoId}\n`;
        result += `Thumbnail: https://img.youtube.com/vi/${videoId}/maxresdefault.jpg\n`;
        result += `No-Cookie: https://www.youtube-nocookie.com/embed/${videoId}\n`;
        break;
      }

      default:
        result = "Unsupported Generator";
    }
    setOutput(result);
  };

  const hasLength = ['password-generator', 'string-generator', 'binary-generator', 'octal-generator', 'hex-generator', 'byte-generator', 'pi-generator', 'euler-generator'].includes(id);
  const hasRange = ['number-generator', 'decimal-generator'].includes(id);
  const hasCount = ['json-generator', 'xml-generator', 'yaml-generator', 'csv-generator', 'tsv-generator', 'prime-generator', 'fibonacci-generator', 'lorem-ipsum'].includes(id);
  const hasRegex = id === 'regex-generator';
  const hasInput = ['shuffle-letters', 'pick-random', 'qr-generator', 'youtube-link-generator'].includes(id);

  const downloadQr = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qrcode_${Date.now()}.png`;
    link.click();
  };

  const controls = (
    <div className="flex flex-wrap items-center gap-6 bg-slate-900/80 px-4 py-3 rounded-2xl border border-slate-800">
      {hasLength && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Length</span>
          <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-16 bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none" />
        </div>
      )}
      {hasRange && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Min</span>
            <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-16 bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max</span>
            <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-16 bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none" />
          </div>
        </>
      )}
      {hasCount && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Items/Rows</span>
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-16 bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none" />
        </div>
      )}
      {hasRegex && (
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Regex</span>
          <input type="text" value={regex} onChange={(e) => setRegex(e.target.value)} className="flex-1 bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-lg px-3 py-1 outline-none" />
        </div>
      )}

      {id === 'qr-generator' && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Foreground</span>
            <input type="color" value={qrFg} onChange={(e) => setQrFg(e.target.value)} className="w-8 h-8 bg-transparent border-none cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Background</span>
            <input type="color" value={qrBg} onChange={(e) => setQrBg(e.target.value)} className="w-8 h-8 bg-transparent border-none cursor-pointer" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Margin</span>
            <input type="number" min="0" max="10" value={qrMargin} onChange={(e) => setQrMargin(Number(e.target.value))} className="w-12 bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ECC Level</span>
            <select value={qrLevel} onChange={(e) => setQrLevel(e.target.value as any)} className="bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none">
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </>
      )}
      
      <button onClick={generate} className="btn-primary flex items-center gap-2 px-4 py-2 text-xs">
        <Play className="w-3 h-3 fill-current" />
        Generate
      </button>
      {id === 'qr-generator' && qrUrl && (
        <button onClick={downloadQr} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 border border-emerald-400/50">
          <Download className="w-3.5 h-3.5" />
          Download PNG
        </button>
      )}
    </div>
  );

  return (
    <ToolLayout
      id={id}
      title={name}
      description={description}
      input={hasInput ? inputText : ''}
      setInput={setInputText}
      output={output}
      presets={getPresets()}
      customOutput={
        id === 'qr-generator' && qrUrl ? (
          <div 
            className="p-8 rounded-2xl shadow-2xl transition-all duration-300"
            style={{ backgroundColor: qrBg === '#00000000' || qrBg === 'transparent' ? '#ffffff' : qrBg }}
          >
            <img src={qrUrl} alt="QR Code" className="w-64 h-64 object-contain" referrerPolicy="no-referrer" />
          </div>
        ) : id === 'youtube-link-generator' && output.includes('Video ID:') ? (
          <div className="space-y-6 max-w-md w-full">
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-slate-800">
              <img 
                src={`https://img.youtube.com/vi/${output.match(/Video ID: (.{11})/)?.[1]}/maxresdefault.jpg`} 
                alt="Video Thumbnail" 
                className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://img.youtube.com/vi/${output.match(/Video ID: (.{11})/)?.[1]}/hqdefault.jpg`;
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-500/20">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-black text-white uppercase tracking-wider italic">Video Identified</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-8">
              {[
                { label: 'Standard', val: output.match(/Standard: (.*)/)?.[1] },
                { label: 'Short', val: output.match(/Shortened: (.*)/)?.[1] },
                { label: 'Embed', val: output.match(/Embed: (.*)/)?.[1] }
              ].map(link => (
                <button 
                  key={link.label}
                  onClick={() => {
                    if (link.val) navigator.clipboard.writeText(link.val);
                  }}
                  className="flex flex-col items-start p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/30 hover:bg-slate-900 transition-all text-left group"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-indigo-400">{link.label}</span>
                  <span className="text-[11px] font-mono text-slate-300 truncate w-full">{link.val?.split('//')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : undefined
      }
      controls={controls}
      hideInput={!hasInput}
    />
  );
}
