import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import Papa from 'papaparse';
import mdIt from 'markdown-it';
import turndownSrc from 'turndown';
import tinycolor from 'tinycolor2';
import * as toml from 'smol-toml';
import cronstrue from 'cronstrue';
import ToolLayout from './ToolLayout';

// Helpers for BCD and Gray Code
const decimalToBcd = (dec: string) => {
  return dec.split('').map(d => parseInt(d).toString(2).padStart(4, '0')).join(' ');
};

const bcdToDecimal = (bcd: string) => {
  return bcd.replace(/\s/g, '').match(/.{1,4}/g)?.map(b => parseInt(b, 2).toString()).join('') || '';
};

const binaryToGray = (bin: string) => {
  const b = parseInt(bin, 2);
  const g = b ^ (b >>> 1);
  return g.toString(2).padStart(bin.length, '0');
};

const grayToBinary = (gray: string) => {
  let g = parseInt(gray, 2);
  let b = 0;
  for (; g; g >>= 1) b ^= g;
  return b.toString(2).padStart(gray.length, '0');
};

const numberToWords = (num: number): string => {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

  if (num === 0) return 'zero';
  if (num < 0) return 'negative ' + numberToWords(Math.abs(num));

  let words = '';
  let scaleIndex = 0;

  while (num > 0) {
    let chunk = num % 1000;
    if (chunk > 0) {
      let chunkWords = '';
      if (chunk >= 100) {
        chunkWords += ones[Math.floor(chunk / 100)] + ' hundred ';
        chunk %= 100;
      }
      if (chunk >= 20) {
        chunkWords += tens[Math.floor(chunk / 10)] + (chunk % 10 > 0 ? '-' + ones[chunk % 10] : '');
      } else if (chunk > 0) {
        chunkWords += ones[chunk];
      }
      words = chunkWords + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + (words ? ' ' + words : '');
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }
  return words.trim();
};

const wordsToNumber = (wordsStr: string): number => {
  const units: any = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
  const tens: any = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
  const scales: any = { thousand: 1000, million: 1000000, billion: 1000000000, trillion: 1000000000000 };

  const words = wordsStr.toLowerCase().replace(/-/g, ' ').split(/\s+/);
  let total = 0;
  let currentGroup = 0;

  words.forEach(word => {
    if (units[word] !== undefined) currentGroup += units[word];
    else if (tens[word] !== undefined) currentGroup += tens[word];
    else if (word === 'hundred') currentGroup *= 100;
    else if (scales[word] !== undefined) {
      total += currentGroup * scales[word];
      currentGroup = 0;
    }
  });

  return total + currentGroup;
};

interface ConverterProps {
  id: string;
  name: string;
  description: string;
}

const MarkdownIt = (mdIt as any).default || mdIt;
const TurndownService = (turndownSrc as any).default || turndownSrc;

const md = new MarkdownIt();
const turndown = new TurndownService();

export default function Converter({ id, name, description }: ConverterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const getPresets = () => {
    switch (id) {
      case 'json-to-yaml':
      case 'json-to-csv':
      case 'json-to-toml':
      case 'json-to-xml':
        return [{ label: 'Config', value: '{"api":{"version":"v1","retry":3,"endpoints":["/auth","/user","/posts"]},"server":{"port":8080,"host":"0.0.0.0"}}' }, { label: 'User List', value: '[{"id":1,"name":"Alice","role":"Admin"},{"id":2,"name":"Bob","role":"User"}]' }];
      case 'yaml-to-json':
        return [{ label: 'App Config', value: 'app:\n  name: DevToolKit\n  version: 2.4.0\n  database:\n    type: postgres\n    pool: 20' }];
      case 'csv-to-json':
      case 'csv-to-xml':
        return [{ label: 'Users', value: 'id,first_name,last_name,email\n1,John,Doe,john@example.com\n2,Jane,Smith,jane@example.com' }];
      case 'hex-to-rgb':
      case 'hex-to-hsl':
      case 'hex-to-gray':
        return [{ label: 'Indigo', value: '#6366f1' }, { label: 'Emerald', value: '#10b981' }, { label: 'Slate', value: '#0f172a' }];
      case 'rgb-to-hex':
      case 'rgb-to-cmyk':
        return [{ label: 'Indigo', value: 'rgb(99, 102, 241)' }, { label: 'Crimson', value: '220, 20, 60' }];
      case 'markdown-to-html':
        return [{ label: 'Checklist', value: '# My Checklist\n- [x] Learn React\n- [ ] Deep Research Tools\n- [ ] Deploy Application' }];
      case 'html-to-markdown':
      case 'html-to-jade':
        return [{ label: 'Hero', value: '<section class="hero"><h1>Ultimate DevToolKit</h1><p>The only workstation you need.</p><button>Get Started</button></section>' }];
      case 'cron-to-text':
        return [{ label: 'Daily', value: '0 0 * * *' }, { label: 'Weekly', value: '0 0 * * 0' }, { label: 'Interval', value: '*/15 * * * *' }];
      case 'decimal-to-roman':
        return [{ label: 'Year', value: '2026' }, { label: 'Duo', value: '42' }];
      case 'miles-to-km':
        return [{ label: 'Marathon', value: '26.2' }, { label: 'Century', value: '100' }];
      case 'base-converter':
        return [{ label: 'Base 10', value: '255 10 16' }, { label: 'Binary', value: '11111111 2 10' }];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(undefined);
      return;
    }

    try {
      let result = '';
      switch (id) {
        case 'json-to-yaml':
          result = yaml.dump(JSON.parse(input));
          break;
        case 'yaml-to-json':
          result = JSON.stringify(yaml.load(input), null, 2);
          break;
        case 'csv-to-json':
          const csv = Papa.parse(input, { header: true, skipEmptyLines: true });
          result = JSON.stringify(csv.data, null, 2);
          break;
        case 'json-to-csv':
          const json = JSON.parse(input);
          result = Papa.unparse(json);
          break;
        case 'hex-to-rgb':
          const colorHex = tinycolor(input);
          if (!colorHex.isValid()) throw new Error('Invalid Hex Color');
          const rgb = colorHex.toRgb();
          result = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})${rgb.a < 1 ? ` rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})` : ''}`;
          break;
        case 'rgb-to-hex':
          const colorRgb = tinycolor(input);
          if (!colorRgb.isValid()) throw new Error('Invalid RGB Color');
          result = colorRgb.toHexString();
          break;
        case 'hex-to-hsl':
          const colorHsl = tinycolor(input);
          if (!colorHsl.isValid()) throw new Error('Invalid Hex Color');
          const hsl = colorHsl.toHsl();
          result = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
          break;
        case 'hsl-to-hex':
          const colorHslIn = tinycolor(input);
          if (!colorHslIn.isValid()) throw new Error('Invalid HSL Color');
          result = colorHslIn.toHexString();
          break;
        case 'markdown-to-html':
          result = md.render(input);
          break;
        case 'html-to-markdown':
          result = turndown.turndown(input);
          break;
        case 'bbcode-to-html':
          result = input
            .replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>')
            .replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>')
            .replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>')
            .replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1">$2</a>')
            .replace(/\[img\](.*?)\[\/img\]/gi, '<img src="$1" />')
            .replace(/\[quote\](.*?)\[\/quote\]/gi, '<blockquote>$1</blockquote>')
            .replace(/\[code\](.*?)\[\/code\]/gi, '<pre><code>$1</code></pre>');
          break;
        case 'roman-to-decimal':
          const romanData: any = {M:1000,D:500,C:100,L:50,X:10,V:5,I:1};
          result = input.toUpperCase().split('').reduce((acc, curr, i, arr) => {
            return romanData[curr] < romanData[arr[i+1]] ? acc - romanData[curr] : acc + romanData[curr];
          }, 0).toString();
          break;
        case 'decimal-to-roman':
          let num = parseInt(input);
          if (isNaN(num)) throw new Error('Invalid Number');
          const lookup: any = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
          result = '';
          for (let i in lookup) {
            while (num >= lookup[i]) {
              result += i;
              num -= lookup[i];
            }
          }
          break;
        case 'binary-to-octal':
          result = parseInt(input, 2).toString(8);
          break;
        case 'binary-to-decimal':
          result = parseInt(input, 2).toString(10);
          break;
        case 'binary-to-hex':
          result = parseInt(input, 2).toString(16).toUpperCase();
          break;
        case 'octal-to-binary':
          result = parseInt(input, 8).toString(2);
          break;
        case 'octal-to-decimal':
          result = parseInt(input, 8).toString(10);
          break;
        case 'octal-to-hex':
          result = parseInt(input, 8).toString(16).toUpperCase();
          break;
        case 'decimal-to-binary':
          result = parseInt(input, 10).toString(2);
          break;
        case 'decimal-to-octal':
          result = parseInt(input, 10).toString(8);
          break;
        case 'decimal-to-hex':
          result = parseInt(input, 10).toString(16).toUpperCase();
          break;
        case 'hex-to-binary':
          result = parseInt(input, 16).toString(2);
          break;
        case 'hex-to-octal':
          result = parseInt(input, 16).toString(8);
          break;
        case 'hex-to-decimal':
          result = parseInt(input, 16).toString(10);
          break;
        case 'decimal-to-bcd':
          result = decimalToBcd(input);
          break;
        case 'bcd-to-decimal':
          result = bcdToDecimal(input);
          break;
        case 'octal-to-bcd':
          result = decimalToBcd(parseInt(input, 8).toString(10));
          break;
        case 'bcd-to-octal':
          result = parseInt(bcdToDecimal(input), 10).toString(8);
          break;
        case 'hex-to-bcd':
          result = decimalToBcd(parseInt(input, 16).toString(10));
          break;
        case 'bcd-to-hex':
          result = parseInt(bcdToDecimal(input), 10).toString(16).toUpperCase();
          break;
        case 'binary-to-gray':
          result = binaryToGray(input);
          break;
        case 'gray-to-binary':
          result = grayToBinary(input);
          break;
        case 'octal-to-gray':
          result = binaryToGray(parseInt(input, 8).toString(2));
          break;
        case 'gray-to-octal':
          result = parseInt(grayToBinary(input), 2).toString(8);
          break;
        case 'decimal-to-gray':
          result = binaryToGray(parseInt(input, 10).toString(2));
          break;
        case 'gray-to-decimal':
          result = parseInt(grayToBinary(input), 2).toString(10);
          break;
        case 'hex-to-gray':
          result = binaryToGray(parseInt(input, 16).toString(2));
          break;
        case 'gray-to-hex':
          result = parseInt(grayToBinary(input), 2).toString(16).toUpperCase();
          break;
        case 'number-to-words':
          result = numberToWords(parseInt(input));
          break;
        case 'words-to-number':
          result = wordsToNumber(input).toString();
          break;
        case 'miles-to-km':
          result = (parseFloat(input) * 1.609344).toFixed(6).replace(/\.?0+$/, '');
          break;
        case 'km-to-miles':
          result = (parseFloat(input) / 1.609344).toFixed(6).replace(/\.?0+$/, '');
          break;
        case 'celsius-to-fahrenheit':
          result = ((parseFloat(input) * 9/5) + 32).toFixed(2).replace(/\.?0+$/, '');
          break;
        case 'fahrenheit-to-celsius':
          result = ((parseFloat(input) - 32) * 5/9).toFixed(2).replace(/\.?0+$/, '');
          break;
        case 'degrees-to-radians':
          result = (parseFloat(input) * (Math.PI / 180)).toFixed(10).replace(/\.?0+$/, '');
          break;
        case 'radians-to-degrees':
          result = (parseFloat(input) * (180 / Math.PI)).toFixed(6).replace(/\.?0+$/, '');
          break;
        case 'pounds-to-kilograms':
          result = (parseFloat(input) * 0.45359237).toFixed(6).replace(/\.?0+$/, '');
          break;
        case 'kilograms-to-pounds':
          result = (parseFloat(input) / 0.45359237).toFixed(6).replace(/\.?0+$/, '');
          break;
        case 'base-converter':
          // We'll use param1/param2 if available, otherwise default to dec->hex
          // Actually ToolLayout doesn't support params yet here.
          // I will assume input format "value fromBase toBase" if not using param UI
          const parts = input.split(/\s+/);
          if (parts.length === 3) {
            result = parseInt(parts[0], parseInt(parts[1])).toString(parseInt(parts[2])).toUpperCase();
          } else {
            result = "Usage: [value] [fromBase] [toBase]\nExample: 255 10 16";
          }
          break;
        case 'scientific-to-decimal':
          result = Number(input).toString();
          if (result === 'NaN') throw new Error('Invalid Scientific Notation');
          break;
        case 'decimal-to-scientific':
          result = Number(input).toExponential();
          if (result === 'NaN') throw new Error('Invalid Number');
          break;
        case 'toml-to-json':
          result = JSON.stringify(toml.parse(input), null, 2);
          break;
        case 'json-to-toml':
          result = toml.stringify(JSON.parse(input));
          break;
        case 'cron-to-text':
          result = cronstrue.toString(input);
          break;
        case 'rgb-to-cmyk':
          const colR = tinycolor(input).toRgb();
          let c = 1 - (colR.r / 255);
          let m = 1 - (colR.g / 255);
          let y = 1 - (colR.b / 255);
          let k = Math.min(c, Math.min(m, y));
          c = (c - k) / (1 - k);
          m = (m - k) / (1 - k);
          y = (y - k) / (1 - k);
          result = `cmyk(${Math.round(isNaN(c) ? 0 : c * 100)}%, ${Math.round(isNaN(m) ? 0 : m * 100)}%, ${Math.round(isNaN(y) ? 0 : y * 100)}%, ${Math.round(k * 100)}%)`;
          break;
        case 'cmyk-to-rgb': {
          const matches = input.match(/\d+/g);
          if (!matches || matches.length < 4) throw new Error('Invalid CMYK (format: cmyk(c, m, y, k))');
          let [cc, mm, yy, kk] = matches.map(Number).map(v => v / 100);
          let r = 255 * (1 - cc) * (1 - kk);
          let g = 255 * (1 - mm) * (1 - kk);
          let b = 255 * (1 - yy) * (1 - kk);
          result = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
          break;
        }
        case 'xml-to-json':
          result = "// Simple XML to JSON transformation\n" + 
                   JSON.stringify(input.replace(/<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g, '"$1": "$3"'), null, 2);
          break;
        case 'json-to-xml': {
          const obj = JSON.parse(input);
          const toXml = (o: any): string => {
            return Object.entries(o).map(([k, v]) => `<${k}>${typeof v === 'object' ? toXml(v) : v}</${k}>`).join('\n');
          };
          result = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${toXml(obj)}\n</root>`;
          break;
        }
        case 'csv-to-xml': {
          const csvData = Papa.parse(input, { header: true }).data;
          const rows = csvData.map((row: any) => {
            const fields = Object.entries(row).map(([k, v]) => `  <${k}>${v}</${k}>`).join('\n');
            return `<row>\n${fields}\n</row>`;
          }).join('\n');
          result = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${rows}\n</root>`;
          break;
        }
        case 'xml-to-csv': {
          // Simplified XML to CSV (extracts tags as headers)
          const xmlMatches = input.match(/<(\w+)>/g) || [];
          const headers = Array.from(new Set(xmlMatches.map(t => t.slice(1, -1)))) as string[];
          const items = input.match(/<row>([\s\S]*?)<\/row>/g) || [input];
          const rowsList = items.map(item => {
            return headers.map(h => {
              const m = item.match(new RegExp(`<${h}>(.*?)<\/${h}>`));
              return m ? m[1] : '';
            });
          });
          result = Papa.unparse({ fields: headers, data: rowsList });
          break;
        }
        case 'html-to-jade':
          result = "// HTML to Jade requires complex parsing, here is a simplified version (manual transformation suggested)\n" + 
                   input.replace(/<(\w+).*?>/g, '$1\n  ').replace(/<\/.*?>/g, '');
          break;
        case 'jade-to-html':
          result = "Jade/Pug rendering typically requires a server-side engine. \nUse 'pug' library if environment supports it.";
          break;
        default:
          result = input;
      }
      setOutput(result);
      setError(undefined);
    } catch (err: any) {
      setError('Conversion Error: ' + err.message);
      setOutput('');
    }
  }, [input, id]);

  return (
    <ToolLayout
      id={id}
      title={name}
      description={description}
      input={input}
      setInput={setInput}
      output={output}
      error={error}
      presets={getPresets()}
    />
  );
}
