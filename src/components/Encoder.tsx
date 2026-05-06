import { useState, useEffect } from 'react';
import punycode from 'punycode';
import base32 from 'hi-base32';
import bs58 from 'bs58';
import ascii85 from 'ascii85';
import { jwtDecode } from 'jwt-decode';
import ToolLayout from './ToolLayout';

interface EncoderProps {
  id: string;
  name: string;
  description: string;
}

export default function Encoder({ id, name, description }: EncoderProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const getPresets = () => {
    switch (id) {
      case 'base64-encode':
        return [{ label: 'Hello', value: 'Hello DevToolKit!' }, { label: 'JSON', value: '{"id":123,"version":"2.4.0"}' }];
      case 'base64-decode':
        return [{ label: 'Hello', value: 'SGVsbG8gRGV2VG9vbEtpdCE=' }, { label: 'JSON', value: 'eyJpZCI6MTIzLCJ2ZXJzaW9uIjoiMi40LjAifQ==' }];
      case 'url-encode':
      case 'url-parse':
        return [{ label: 'Complex URL', value: 'https://ais-dev-example.run.app/search?query=react hooks&page=1&sort=desc#results' }];
      case 'url-decode':
        return [{ label: 'Encoded Query', value: 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Ddev%2Btools' }];
      case 'jwt-decode':
        return [{ label: 'Sample JWT', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }];
      case 'rot13-decode':
        return [{ label: 'Secret', value: 'Uryyb Jbeyq' }];
      case 'html-encode':
        return [{ label: 'Snippet', value: '<div><h1>"Hello & Welcome"</h1></div>' }];
      case 'html-decode':
        return [{ label: 'Encoded', value: '&lt;div&gt;&lt;h1&gt;&quot;Hello &amp; Welcome&quot;&lt;/h1&gt;&lt;/div&gt;' }];
      case 'idn-encode':
        return [{ label: 'Emoji Domain', value: '🚀.com' }];
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
        case 'base64-encode':
          result = btoa(unescape(encodeURIComponent(input)));
          break;
        case 'base64-decode':
          result = decodeURIComponent(escape(atob(input)));
          break;
        case 'url-encode':
          result = encodeURIComponent(input);
          break;
        case 'url-decode':
          result = decodeURIComponent(input);
          break;
        case 'url-parse':
          const url = new URL(input);
          result = JSON.stringify({
            href: url.href,
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            searchParams: Object.fromEntries(url.searchParams.entries()),
            hash: url.hash,
            origin: url.origin
          }, null, 2);
          break;
        case 'html-encode':
          const el = document.createElement('div');
          el.innerText = input;
          result = el.innerHTML;
          break;
        case 'html-decode':
          const doc = new DOMParser().parseFromString(input, 'text/html');
          result = doc.documentElement.textContent || "";
          break;
        case 'json-escape':
          result = JSON.stringify(input).slice(1, -1);
          break;
        case 'json-unescape':
          result = JSON.parse('"' + input + '"');
          break;
        case 'idn-encode':
          result = punycode.toASCII(input);
          break;
        case 'idn-decode':
          result = punycode.toUnicode(input);
          break;
        case 'base32-encode':
          result = base32.encode(input);
          break;
        case 'base32-decode':
          result = base32.decode(input);
          break;
        case 'base58-encode':
          result = bs58.encode(new TextEncoder().encode(input));
          break;
        case 'base58-decode':
          result = new TextDecoder().decode(bs58.decode(input));
          break;
        case 'rot13-decode':
          result = input.replace(/[a-zA-Z]/g, (c: any) => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
          });
          break;
        case 'rot47-decode':
          result = input.replace(/[!-~]/g, (c: any) => {
            return String.fromCharCode(((c.charCodeAt(0) - 33 + 47) % 94) + 33);
          });
          break;
        case 'ascii85-encode':
          result = ascii85.encode(input).toString();
          break;
        case 'ascii85-decode':
          result = ascii85.decode(input).toString();
          break;
        case 'utf8-encode':
          result = encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
          break;
        case 'utf8-decode':
          result = decodeURIComponent(input.split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
          break;
        case 'utf16-encode':
          result = (Array.from(input) as string[]).map((c: string) => c.charCodeAt(0).toString(16).padStart(4, '0')).join(' ');
          break;
        case 'utf16-decode':
          result = input.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
          break;
        case 'uuencode':
          // Simplified uuencoding
          const encode3 = (s: string) => {
            const b = [s.charCodeAt(0), s.charCodeAt(1) || 0, s.charCodeAt(2) || 0];
            const u = [
              (b[0] >> 2),
              ((b[0] & 3) << 4) | (b[1] >> 4),
              ((b[1] & 15) << 2) | (b[2] >> 6),
              (b[2] & 63)
            ];
            return u.map(x => String.fromCharCode((x || 64) + 32)).join('');
          };
          result = `begin 644 file.txt\n`;
          for(let i=0; i<input.length; i+=45) {
            const line = input.slice(i, i+45);
            result += String.fromCharCode(line.length + 32);
            for(let j=0; j<line.length; j+=3) {
              result += encode3(line.slice(j, j+3));
            }
            result += '\n';
          }
          result += '` \nend';
          break;
        case 'uudecode':
           // Very simplified uudecode (only one line handling)
           const lines = input.split('\n');
           const dataLines = lines.filter(l => l && !l.startsWith('begin') && !l.startsWith('end') && l !== '`');
           result = dataLines.map(line => {
             const len = line.charCodeAt(0) - 32;
             const chunks = (line.slice(1).match(/.{4}/g) || []) as string[];
             return chunks.map(chunk => {
               const u = chunk.split('').map(c => c.charCodeAt(0) - 32);
               const b = [
                 (u[0] << 2) | (u[1] >> 4),
                 ((u[1] & 15) << 4) | (u[2] >> 2),
                 ((u[2] & 3) << 6) | u[3]
               ];
               return b.map(x => String.fromCharCode(x)).join('');
             }).join('').slice(0, len);
           }).join('');
           break;
        case 'jwt-decode':
          const decodedHeader = jwtDecode(input, { header: true });
          const decodedPayload = jwtDecode(input);
          result = JSON.stringify({ header: decodedHeader, payload: decodedPayload }, null, 2);
          break;
        default:
          result = input;
      }
      setOutput(result);
      setError(undefined);
    } catch (err: any) {
      setError('Error processing transformation: ' + err.message);
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
