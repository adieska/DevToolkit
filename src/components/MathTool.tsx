import { useState, useEffect } from 'react';
import ToolLayout from './ToolLayout';

interface MathToolProps {
  id: string;
  name: string;
  description: string;
}

export default function MathTool({ id, name, description }: MathToolProps) {
  const [input, setInput] = useState('');
  const [input2, setInput2] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const getPresets = () => {
    switch (id) {
      case 'aspect-ratio':
        return [{ label: 'Full HD', value: '1920' }, { label: '4K', value: '3840' }, { label: 'Ultrawide', value: '3440' }];
      case 'round-up':
      case 'round-down':
        return [{ label: 'Float', value: '42.75' }, { label: 'Pi', value: '3.14159' }];
      default:
        if (id.includes('binary')) return [{ label: 'Byte', value: '10101010' }, { label: 'Nibble', value: '1100' }];
        return [];
    }
  };

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      let result = '';
      const v1 = input.trim();
      const v2 = input2.trim();

      switch (id) {
        case 'binary-sum': {
          const n1 = BigInt('0b' + v1);
          const n2 = BigInt('0b' + v2);
          result = (n1 + n2).toString(2);
          break;
        }
        case 'binary-product': {
          const n1 = BigInt('0b' + v1);
          const n2 = BigInt('0b' + v2);
          result = (n1 * n2).toString(2);
          break;
        }
        case 'binary-and': {
          const n1 = BigInt('0b' + v1);
          const n2 = BigInt('0b' + v2);
          result = (n1 & n2).toString(2);
          break;
        }
        case 'binary-nand': {
          const n1 = BigInt('0b' + v1);
          const n2 = BigInt('0b' + v2);
          const maxLen = Math.max(v1.length, v2.length);
          const andRes = n1 & n2;
          const mask = (1n << BigInt(maxLen)) - 1n;
          result = (andRes ^ mask).toString(2).padStart(maxLen, '0');
          break;
        }
        case 'binary-or': {
          const n1 = BigInt('0b' + v1);
          const n2 = BigInt('0b' + v2);
          result = (n1 | n2).toString(2);
          break;
        }
        case 'binary-nor': {
          const n1 = BigInt('0b' + v1);
          const n2 = BigInt('0b' + v2);
          const maxLen = Math.max(v1.length, v2.length);
          const orRes = n1 | n2;
          const mask = (1n << BigInt(maxLen)) - 1n;
          result = (orRes ^ mask).toString(2).padStart(maxLen, '0');
          break;
        }
        case 'binary-xor': {
          const n1 = BigInt('0b' + v1);
          const n2 = BigInt('0b' + v2);
          result = (n1 ^ n2).toString(2);
          break;
        }
        case 'binary-xnor': {
          const n1 = BigInt('0b' + v1);
          const n2 = BigInt('0b' + v2);
          const maxLen = Math.max(v1.length, v2.length);
          const xorRes = n1 ^ n2;
          const mask = (1n << BigInt(maxLen)) - 1n;
          result = (xorRes ^ mask).toString(2).padStart(maxLen, '0');
          break;
        }
        case 'binary-not': {
          const n1 = BigInt('0b' + v1);
          const mask = (1n << BigInt(v1.length)) - 1n;
          result = (n1 ^ mask).toString(2).padStart(v1.length, '0');
          break;
        }
        case 'binary-invert': {
          result = v1.split('').map(b => b === '1' ? '0' : '1').join('');
          break;
        }
        case 'binary-reverse': {
          result = v1.split('').reverse().join('');
          break;
        }
        case 'binary-shift': {
          // Circular shift
          const len = v1.length;
          const shift = parseInt(v2) || 0;
          const s = ((shift % len) + len) % len;
          result = v1.slice(len - s) + v1.slice(0, len - s);
          break;
        }
        case 'binary-rotate-left': {
          const shift = parseInt(v2) || 1;
          const s = shift % v1.length;
          result = v1.slice(s) + v1.slice(0, s);
          break;
        }
        case 'binary-rotate-right': {
          const shift = parseInt(v2) || 1;
          const s = shift % v1.length;
          result = v1.slice(-s) + v1.slice(0, -s);
          break;
        }
        case 'round-up':
          result = Math.ceil(Number(v1)).toString();
          break;
        case 'round-down':
          result = Math.floor(Number(v1)).toString();
          break;
        case 'aspect-ratio': {
          const w = parseInt(v1);
          const h = parseInt(v2);
          if (isNaN(w) || isNaN(h)) {
            result = "Please enter both width and height";
            break;
          }
          const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
          const common = gcd(w, h);
          const rw = w / common;
          const rh = h / common;
          result = `Ratio: ${rw}:${rh}\n`;
          result += `Simplified: ${rw}x${rh}\n`;
          result += `GCD: ${common}\n\n`;
          result += `Common Scaling:\n`;
          [0.25, 0.5, 0.75, 1.25, 1.5, 2].forEach(scale => {
            result += `${(scale * 100).toString().padStart(3)}%: ${Math.round(w * scale)} x ${Math.round(h * scale)}\n`;
          });
          break;
        }
        default:
          result = v1;
      }
      setOutput(result);
      setError(undefined);
    } catch (err: any) {
      setError('Math Error: ' + err.message);
      setOutput('');
    }
  }, [input, input2, id]);

  const hasSecondInput = [
    'binary-sum', 'binary-product', 'binary-and', 'binary-nand', 
    'binary-or', 'binary-nor', 'binary-xor', 'binary-xnor', 
    'binary-shift', 'binary-rotate-left', 'binary-rotate-right',
    'aspect-ratio'
  ].includes(id);

  const controls = (
    <div className="flex flex-wrap items-center gap-4">
      {hasSecondInput && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {id === 'aspect-ratio' ? 'Height' : (id.includes('shift') || id.includes('rotate') ? 'Amount' : 'Second Binary')}
          </span>
          <input 
            type="text" 
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            placeholder={id === 'aspect-ratio' ? "Height (e.g. 1080)" : (id.includes('shift') || id.includes('rotate') ? "Shift amount" : "0101...")}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout
      id={id}
      title={id === 'aspect-ratio' ? 'Width / Ratio' : name}
      description={description}
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      presets={getPresets()}
      controls={controls}
    />
  );
}
