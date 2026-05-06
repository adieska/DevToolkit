import { useState, useEffect } from 'react';
import punycode from 'punycode';
import he from 'he';
import ToolLayout from './ToolLayout';

interface TextToolProps {
  id: string;
  name: string;
  description: string;
}

export default function TextTool({ id, name, description }: TextToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [param1, setParam1] = useState(''); // Generic parameter 1 (e.g., search, count, prefix)
  const [param2, setParam2] = useState(''); // Generic parameter 2 (e.g., replace, suffix, separator)

  const getPresets = () => {
    switch (id) {
      case 'lowercase-text':
      case 'uppercase-text':
      case 'titlecase-text':
      case 'text-transform':
      case 'capitalize-words':
        return [{ label: 'Quote', value: 'the quick brown fox jumps over the lazy dog' }, { label: 'Tech', value: 'javascript acts like it is the only language in the world.' }];
      case 'remove-duplicates':
      case 'sort-text':
      case 'delete-empty-lines':
      case 'shuffle-lines':
        return [{ label: 'Fruits', value: 'Apple\nBanana\nApple\nOrange\nBanana\nCherry' }, { label: 'IDs', value: 'user_99\nuser_01\nuser_42\nuser_01\nuser_15' }];
      case 'extract-emails':
      case 'extract-urls':
      case 'extract-numbers':
        return [{ label: 'Mixed Content', value: 'Contact us at help@example.com or visit https://devtoolkit.app. Our office is located at 123 Main St.' }];
      case 'text-stats':
      case 'word-frequency':
      case 'word-count':
        return [{ label: 'Preamble', value: 'We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defense, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.' }];
      case 'morse-encode':
        return [{ label: 'SOS', value: 'SOS' }, { label: 'Hello', value: 'Hello World' }];
      case 'text-to-binary':
      case 'text-to-hex':
        return [{ label: 'Name', value: 'DevToolKit' }, { label: 'Key', value: 'SecretKey123' }];
      case 'strip-html':
      case 'html-to-text':
        return [{ label: 'Complex Tag', value: '<div class="main"><h1 id="title">Welcome</h1><p>This is <a href="#">Link</a> content.</p></div>' }];
      case 'sort-ip-addresses':
        return [{ label: 'Servers', value: '192.168.1.10\n10.0.0.1\n172.16.0.5\n192.168.1.2\n127.0.0.1' }];
      default:
        return [];
    }
  };

  const MORSE_MAP: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
    'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
    'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
  };

  const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
    Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    let result = '';
    const lines = input.split('\n');

    switch (id) {
      case 'lowercase-text':
        result = input.toLowerCase();
        break;
      case 'uppercase-text':
        result = input.toUpperCase();
        break;
      case 'titlecase-text':
        result = input.toLowerCase().split(/\s+/).map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        break;
      case 'randomcase-text':
      case 'random-case':
        result = input.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
        break;
      case 'invertcase-text':
        result = input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      case 'text-transform':
        result = input.toUpperCase(); // Default
        break;
      case 'repeat-text':
        const count = parseInt(param1) || 1;
        result = input.repeat(count);
        break;
      case 'replace-text':
        result = input.split(param1).join(param2);
        break;
      case 'reverse-text':
        result = input.split('').reverse().join('');
        break;
      case 'reverse-lines-text':
        result = lines.reverse().join('\n');
        break;
      case 'truncate-text':
        const len = parseInt(param1) || 100;
        result = input.length > len ? input.substring(0, len) + '...' : input;
        break;
      case 'trim-text':
        result = input.split('\n').map(l => l.trim()).join('\n').trim();
        break;
      case 'remove-duplicates':
        const cleanLines = lines.map(l => l.trim()).filter(l => l !== '');
        result = Array.from(new Set(cleanLines)).join('\n');
        break;
      case 'text-stats':
        const charCount = input.length;
        const wordCount = input.trim() === '' ? 0 : input.trim().split(/\s+/).length;
        const lineCount = lines.length;
        const paragraphCount = input.split(/\n\s*\n/).filter(p => p.trim()).length;
        const size = new Blob([input]).size;
        
        result = `Characters: ${charCount}\nWords:      ${wordCount}\nLines:      ${lineCount}\nParagraphs: ${paragraphCount}\nBytes:      ${size} bytes`;
        break;
      case 'find-longest-line':
        result = lines.reduce((a, b) => a.length >= b.length ? a : b, '');
        break;
      case 'find-shortest-line':
        result = lines.reduce((a, b) => (a === '' || b.length < a.length) ? b : a, '');
        break;
      case 'sort-text':
        result = [...lines].sort((a, b) => a.localeCompare(b)).join('\n');
        break;
      case 'sort-words':
        result = input.split(/\s+/).sort((a, b) => a.localeCompare(b)).join(' ');
        break;
      case 'sort-text-length':
        result = [...lines].sort((a, b) => a.length - b.length).join('\n');
        break;
      case 'sort-ip-addresses':
        result = [...lines].sort((a, b) => {
          const numA = a.split('.').map(n => parseInt(n).toString().padStart(3, '0')).join('');
          const numB = b.split('.').map(n => parseInt(n).toString().padStart(3, '0')).join('');
          return numA.localeCompare(numB);
        }).join('\n');
        break;
      case 'word-wrap':
        const wrapAt = parseInt(param1) || 80;
        result = input.replace(new RegExp(`(?![^\\n]{1,${wrapAt}}$)([^\\n]{1,${wrapAt}})\\s`, 'g'), '$1\n');
        break;
      case 'number-lines':
        result = lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
        break;
      case 'letter-frequency':
        const freq: Record<string, number> = {};
        input.toLowerCase().replace(/[^a-z0-9]/g, '').split('').forEach(c => freq[c] = (freq[c] || 0) + 1);
        result = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join('\n');
        break;
      case 'word-frequency':
        const wFreq: Record<string, number> = {};
        input.toLowerCase().split(/\W+/).filter(w => w).forEach(w => wFreq[w] = (wFreq[w] || 0) + 1);
        result = Object.entries(wFreq).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join('\n');
        break;
      case 'extract-emails':
        result = (input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).join('\n');
        break;
      case 'extract-urls':
        result = (input.match(/https?:\/\/[^\s$.?#].[^\s]*/g) || []).join('\n');
        break;
      case 'extract-numbers':
        result = (input.match(/\d+(\.\d+)?/g) || []).join('\n');
        break;
      case 'morse-encode':
        result = input.toUpperCase().split('').map(c => MORSE_MAP[c] || '?').join(' ');
        break;
      case 'morse-decode':
        result = input.split(' ').map(m => REVERSE_MORSE[m] || '?').join('');
        break;
      case 'strip-html':
        result = input.replace(/<\/?[^>]+(>|$)/g, "");
        break;
      case 'html-to-text':
        result = he.decode(input.replace(/<\/?[^>]+(>|$)/g, ""));
        break;
      case 'rotate-text':
        const rot = parseInt(param1) || 1;
        const shift = rot % input.length;
        result = input.substring(shift) + input.substring(0, shift);
        break;
      case 'center-text':
        const width = parseInt(param1) || 40;
        result = lines.map(line => {
          const l = line.trim();
          const p = Math.max(0, Math.floor((width - l.length) / 2));
          return ' '.repeat(p) + l;
        }).join('\n');
        break;
      case 'right-align-text':
        const rWidth = parseInt(param1) || 40;
        result = lines.map(line => {
          const l = line.trim();
          const p = Math.max(0, rWidth - l.length);
          return ' '.repeat(p) + l;
        }).join('\n');
        break;
      case 'justify-text':
        const jWidth = parseInt(param1) || 40;
        result = lines.map(line => {
          const words = line.trim().split(/\s+/);
          if (words.length <= 1) return line.trim().padEnd(jWidth);
          const totalSpaces = jWidth - words.join('').length;
          const spacesBetween = Math.floor(totalSpaces / (words.length - 1));
          const extraSpaces = totalSpaces % (words.length - 1);
          return words.reduce((acc, word, idx) => {
            if (idx === words.length - 1) return acc + word;
            return acc + word + ' '.repeat(spacesBetween + (idx < extraSpaces ? 1 : 0));
          }, '');
        }).join('\n');
        break;
      case 'prefix-suffix-lines':
        result = lines.map(l => param1 + l + param2).join('\n');
        break;
      case 'delete-empty-lines':
        result = lines.filter(l => l.trim() !== '').join('\n');
        break;
      case 'shuffle-lines':
        result = [...lines].sort(() => Math.random() - 0.5).join('\n');
        break;
      case 'join-lines':
        result = lines.join(param1 || ' ');
        break;
      case 'split-strings':
        result = input.split(param1 || ',').join('\n');
        break;
      case 'remove-accents':
        result = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        break;
      case 'remove-punctuation':
        result = input.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        break;
      case 'thousands-separator':
        result = input.replace(/\B(?=(\d{3})+(?!\d))/g, param1 || ",");
        break;
      case 'list-merge':
        // param1 as second list
        const l2 = param1.split('\n');
        result = lines.map((l, i) => l + (l2[i] || '')).join('\n');
        break;
      case 'list-zip':
        const zipList = param1.split('\n');
        const zippedLines: string[] = [];
        for(let i=0; i<Math.max(lines.length, zipList.length); i++) {
          if (i < lines.length) zippedLines.push(lines[i]);
          if (i < zipList.length) zippedLines.push(zipList[i]);
        }
        result = zippedLines.join('\n');
        break;
      case 'list-intersect':
        const iSet = new Set(param1.split('\n').map(l => l.trim()));
        result = lines.filter(l => iSet.has(l.trim())).join('\n');
        break;
      case 'list-diff':
        const dSet = new Set(param1.split('\n').map(l => l.trim()));
        result = lines.filter(l => !dSet.has(l.trim())).join('\n');
        break;
      case 'grep-text':
        try {
          const regexStr = new RegExp(param1, 'i');
          result = lines.filter(line => regexStr.test(line)).join('\n');
        } catch(e) { result = "Invalid regex"; }
        break;
      case 'head-text':
        result = lines.slice(0, parseInt(param1) || 1).join('\n');
        break;
      case 'tail-text':
        result = lines.slice(-(parseInt(param1) || 1)).join('\n');
        break;
      case 'line-range':
        const start = parseInt(param1) || 1;
        const endLine = parseInt(param2) || start;
        result = lines.slice(start - 1, endLine).join('\n');
        break;
      case 'add-backslashes':
        result = input.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
        break;
      case 'strip-backslashes':
        result = input.replace(/\\(.)/mg, "$1");
        break;
      case 'sort-numbers':
        result = [...lines].sort((a, b) => {
          const numA = parseFloat(a.replace(/[^0-9.-]/g, ''));
          const numB = parseFloat(b.replace(/[^0-9.-]/g, ''));
          return (isNaN(numA) ? 0 : numA) - (isNaN(numB) ? 0 : numB);
        }).join('\n');
        break;
      case 'split-words':
        result = input.split(/\s+/).filter(w => w).join('\n');
        break;
      case 'phrase-frequency':
        const n = parseInt(param1) || 2;
        const wordsArr = input.toLowerCase().split(/\W+/).filter(w => w);
        const pFreq: Record<string, number> = {};
        for(let i=0; i <= wordsArr.length - n; i++) {
          const phrase = wordsArr.slice(i, i+n).join(' ');
          pFreq[phrase] = (pFreq[phrase] || 0) + 1;
        }
        result = Object.entries(pFreq).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join('\n');
        break;
      case 'regexp-extract':
        try {
          const re = new RegExp(param1, 'g');
          result = (input.match(re) || []).join('\n');
        } catch(e) { result = "Invalid Regex"; }
        break;
      case 'regexp-replace':
        try {
          const rRe = new RegExp(param1, 'g');
          result = input.replace(rRe, param2);
        } catch(e) { result = "Invalid Regex"; }
        break;
      case 'text-length':
      case 'char-count':
        result = input.length.toString();
        break;
      case 'word-count':
        result = (input.trim() === '' ? 0 : input.trim().split(/\s+/).length).toString();
        break;
      case 'line-count':
        result = lines.length.toString();
        break;
      case 'paragraph-count':
        result = input.split(/\n\s*\n/).filter(p => p.trim()).length.toString();
        break;
      case 'text-to-slug':
        result = input
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        break;
      case 'escape-html':
        result = input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        break;
      case 'spaces-to-tabs':
        result = input.replace(/ {4}/g, '\t');
        break;
      case 'tabs-to-spaces':
        result = input.replace(/\t/g, ' '.repeat(parseInt(param1) || 4));
        break;
      case 'spaces-to-newlines':
        result = input.replace(/ /g, '\n');
        break;
      case 'newlines-to-spaces':
        result = input.replace(/\n/g, ' ');
        break;
      case 'remove-duplicate-spaces':
        result = input.replace(/ +/g, ' ');
        break;
      case 'remove-all-whitespaces':
        result = input.replace(/\s/g, '');
        break;
      case 'printf-tool':
        result = param1.replace(/%s/g, () => input);
        break;
      case 'left-pad': {
        const lp = parseInt(param1) || 4;
        result = lines.map(l => ' '.repeat(lp) + l).join('\n');
        break;
      }
      case 'right-pad': {
        const rp = parseInt(param1) || 4;
        result = lines.map(l => l + ' '.repeat(rp)).join('\n');
        break;
      }
      case 'capitalize-words':
        result = input.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        break;
      case 'format-columns': {
        const sep = param1 || ',';
        const rows = lines.map(line => line.split(sep));
        const colWidths: number[] = [];
        rows.forEach(row => {
          row.forEach((cell, i) => {
            colWidths[i] = Math.max(colWidths[i] || 0, cell.trim().length);
          });
        });
        result = rows.map(row => 
          row.map((cell, i) => cell.trim().padEnd(colWidths[i])).join(' | ')
        ).join('\n');
        break;
      }
      case 'text-to-html-entities':
        result = he.encode(input);
        break;
      case 'text-to-binary':
        result = input.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        break;
      case 'binary-to-text':
        result = input.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
        break;
      case 'text-to-hex':
        result = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        break;
      case 'hex-to-text':
        result = input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
        break;
      case 'text-to-octal':
        result = input.split('').map(c => c.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
        break;
      case 'octal-to-text':
        result = input.split(' ').map(o => String.fromCharCode(parseInt(o, 8))).join('');
        break;
      case 'text-to-decimal':
        result = input.split('').map(c => c.charCodeAt(0)).join(' ');
        break;
      case 'decimal-to-text':
        result = input.split(' ').map(d => String.fromCharCode(parseInt(d, 10))).join('');
        break;
      case 'idn-encode':
        try { result = punycode.encode(input); } catch(e) { result = "Error: Invalid input"; }
        break;
      case 'idn-decode':
        try { result = punycode.decode(input); } catch(e) { result = "Error: Invalid input"; }
        break;
      default:
        result = input;
    }
    setOutput(result);
  }, [input, id, param1, param2]);

  const handleTransform = (type: string) => {
    let res = '';
    if (type === 'upper') res = input.toUpperCase();
    if (type === 'lower') res = input.toLowerCase();
    if (type === 'title') {
      res = input.toLowerCase().split(/\s+/).map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    }
    if (type === 'sentence') {
      res = input.toLowerCase().replace(/(^\w|\.\s*\w)/g, m => m.toUpperCase());
    }
    if (type === 'random') {
      res = input.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
    }
    if (type === 'invert') {
      res = input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    }
    if (type === 'kebab') {
      res = input.toLowerCase().trim().replace(/[\s_-]+/g, '-');
    }
    if (type === 'camel') {
      res = input.toLowerCase().trim().replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    }
    if (type === 'pascal') {
      const camel = input.toLowerCase().trim().replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
      res = camel.charAt(0).toUpperCase() + camel.slice(1);
    }
    setOutput(res);
  };

  const showTransformControls = ['text-transform', 'lowercase-text', 'uppercase-text', 'titlecase-text', 'randomcase-text', 'invertcase-text'].includes(id);

  const controls = (
    <div className="flex flex-col gap-4">
      {showTransformControls && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleTransform('upper')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95">UPPERCASE</button>
          <button onClick={() => handleTransform('lower')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95">lowercase</button>
          <button onClick={() => handleTransform('title')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95">Title Case</button>
          <button onClick={() => handleTransform('sentence')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95">Sentence case</button>
          <button onClick={() => handleTransform('invert')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95">iNvErT cAsE</button>
          <button onClick={() => handleTransform('kebab')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95">kebab-case</button>
          <button onClick={() => handleTransform('camel')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95">camelCase</button>
          <button onClick={() => handleTransform('pascal')} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-300 transition-all active:scale-95">PascalCase</button>
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center">
        {['repeat-text', 'truncate-text', 'word-wrap', 'rotate-text', 'center-text', 'right-align-text', 'justify-text', 'join-lines', 'split-strings', 'thousands-separator', 'grep-text', 'head-text', 'tail-text', 'number-lines', 'phrase-frequency', 'regexp-extract', 'tabs-to-spaces', 'left-pad', 'right-pad', 'format-columns', 'printf-tool'].includes(id) && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {id === 'grep-text' ? 'Pattern' : 
               id === 'regexp-extract' ? 'Regex' : 
               id === 'printf-tool' ? 'Template (%s)' :
               id === 'phrase-frequency' ? 'N-Words' :
               id === 'format-columns' ? 'Separator' :
               id.includes('text') ? 'Value' : 'Count/Width'}
            </span>
            <input 
              type="text" 
              value={param1}
              onChange={(e) => setParam1(e.target.value)}
              placeholder="Value..."
              className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500 w-24"
            />
          </div>
        )}
 
        {['replace-text', 'prefix-suffix-lines', 'list-merge', 'list-zip', 'list-intersect', 'list-diff', 'line-range', 'regexp-replace'].includes(id) && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {id.includes('regexp') ? 'Regex' : id === 'replace-text' ? 'Find' : id === 'line-range' ? 'Start' : id.includes('list') ? 'List 1 Extra' : 'Prefix'}
              </span>
              <input 
                type="text" 
                value={param1}
                onChange={(e) => setParam1(e.target.value)}
                placeholder="..."
                className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500 w-24"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {id.includes('regexp') ? 'Replace' : id === 'replace-text' ? 'Replace' : id === 'line-range' ? 'End' : id.includes('list') ? 'List 2' : 'Suffix'}
              </span>
              <input 
                type="text" 
                value={param2}
                onChange={(e) => setParam2(e.target.value)}
                placeholder="..."
                className="bg-slate-950 text-xs text-slate-300 border border-slate-800 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500 w-24"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <ToolLayout
      id={id}
      title={name}
      description={description}
      input={input}
      setInput={setInput}
      output={output}
      presets={getPresets()}
      controls={controls}
    />
  );
}
