import { useState, useEffect } from 'react';
import ipaddr from 'ipaddr.js';
import ToolLayout from './ToolLayout';

interface NetworkingToolProps {
  id: string;
  name: string;
  description: string;
}

export default function NetworkingTool({ id, name, description }: NetworkingToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchIP = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      setOutput(`Your public IP Address is:\n${data.ip}\n\nNote: This reflects the IP address of your current network gateway.`);
    } catch (err) {
      setOutput('Failed to detect IP address. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const ipToLong = (ip: string) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  const longToIp = (long: number) => {
    return [
      (long >>> 24) & 0xFF,
      (long >>> 16) & 0xFF,
      (long >>> 8) & 0xFF,
      long & 0xFF
    ].join('.');
  };

  const getWebGLExtensionInfo = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as any);
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
      return 'N/A';
    } catch (e) {
      return 'N/A';
    }
  };

  useEffect(() => {
    if (id === 'ip-lookup') {
      fetchIP();
      return;
    }

    if (id === 'browser-info') {
      const info = {
        'User Agent': navigator.userAgent,
        'Platform': (navigator as any).platform || 'Unknown',
        'Language': navigator.language,
        'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
        'On Line': navigator.onLine ? 'Yes' : 'No',
        'Screen Size': `${window.screen.width}x${window.screen.height}`,
        'Viewport Size': `${window.innerWidth}x${window.innerHeight}`,
        'Color Depth': window.screen.colorDepth,
        'Device Pixel Ratio': window.devicePixelRatio,
        'GPU': getWebGLExtensionInfo()
      };
      setOutput(Object.entries(info).map(([k, v]) => `${k.padEnd(20)}: ${v}`).join('\n'));
      return;
    }

    if (!input && id !== 'ip-lookup' && id !== 'browser-info') {
      setOutput('');
      return;
    }

    try {
      let result = '';
      switch (id) {
        case 'ip-to-binary':
          const longBin = ipToLong(input);
          result = longBin.toString(2).padStart(32, '0').match(/.{8}/g)?.join('.') || '';
          break;
        case 'binary-to-ip':
          const cleanBin = input.replace(/[^01]/g, '');
          result = longToIp(parseInt(cleanBin, 2));
          break;
        case 'ip-to-decimal':
          result = ipToLong(input).toString();
          break;
        case 'decimal-to-ip':
          result = longToIp(parseInt(input, 10));
          break;
        case 'subnet-calculator': {
          const parts = input.split('/');
          const ipStr = parts[0];
          const cidr = parseInt(parts[parts.length - 1]) || 24;
          if (!ipaddr.isValid(ipStr)) throw new Error('Invalid IP');
          
          const addr = ipaddr.parse(ipStr);
          if (addr.kind() !== 'ipv4') throw new Error('Only IPv4 supported for now');
          
          // Manual mask calculation to avoid type issues
          const maskLong = (0xFFFFFFFF << (32 - cidr)) >>> 0;
          const mask = longToIp(maskLong);
          
          const ipLong = ipToLong(ipStr);
          const netLong = (ipLong & maskLong) >>> 0;
          const broadcastLong = (netLong | (~maskLong >>> 0)) >>> 0;
          
          result = [
            `CIDR:         /${cidr}`,
            `Netmask:      ${mask}`,
            `Network:      ${longToIp(netLong)}`,
            `Broadcast:    ${longToIp(broadcastLong)}`,
            `Host Range:   ${longToIp(netLong + 1)} - ${longToIp(broadcastLong - 1)}`,
            `Total Hosts:  ${broadcastLong - netLong + 1}`,
            `Usable Hosts: ${Math.max(0, broadcastLong - netLong - 1)}`
          ].join('\n');
          break;
        }
        default:
          result = '';
      }
      setOutput(result);
    } catch (err) {
      setOutput('Invalid Input');
    }
  }, [id, input]);

  if (id !== 'ip-lookup' && id !== 'browser-info') {
    return (
      <ToolLayout
        id={id}
        title={name}
        description={description}
        input={input || ''}
        setInput={setInput}
        output={output}
      />
    );
  }

  if (id === 'browser-info') {
    return (
      <ToolLayout
        id={id}
        title={name}
        description={description}
        input={navigator.userAgent}
        setInput={() => {}}
        output={output}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight mb-3">{name}</h1>
        <p className="text-slate-400 font-medium">{description}</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 flex flex-col items-center gap-10 shadow-2xl backdrop-blur-sm">
        <div className="w-full max-w-3xl bg-slate-950/80 border border-slate-800 p-10 rounded-2xl text-center font-mono text-3xl text-indigo-400 break-all min-h-[160px] flex items-center justify-center shadow-inner relative overflow-hidden">
          {loading ? (
             <div className="flex items-center gap-4 text-slate-500">
               <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
               <span className="text-lg">Interrogating Network...</span>
             </div>
          ) : output || 'Disconnected'}
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/10">
            <div className={`h-full bg-indigo-500 transition-all duration-[3000ms] ${loading ? 'w-full' : 'w-0'}`} />
          </div>
        </div>
        <button 
          disabled={loading}
          onClick={fetchIP}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          Re-establish Connection
        </button>
      </div>
    </div>
  );
}
