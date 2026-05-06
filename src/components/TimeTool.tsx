import { useState, useEffect } from 'react';
import { Clock, Globe, Calendar, Play, Pause, RotateCcw } from 'lucide-react';
import ToolLayout from './ToolLayout';

interface TimeToolProps {
  id: string;
  name: string;
  description: string;
}

export default function TimeTool({ id, name, description }: TimeToolProps) {
  const [input, setInput] = useState(Math.floor(Date.now() / 1000).toString());
  const [input2, setInput2] = useState(new Date().toISOString());
  const [output, setOutput] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdownInput, setCountdownInput] = useState(60);
  
  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Countdown state
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [countdownLeft, setCountdownLeft] = useState(0); // in ms

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      const startTime = Date.now() - elapsedTime;
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    } else if (isCountdownRunning && countdownLeft > 0) {
      interval = setInterval(() => {
        setCountdownLeft(prev => Math.max(0, prev - 10));
      }, 10);
    } else if (isCountdownRunning && countdownLeft <= 0) {
      setIsCountdownRunning(false);
      // Maybe play a sound or alert (alert is discouraged in instructions but good for UX here? instructions say avoid window.alert)
      // I'll show a "Finished" status
    }
    return () => clearInterval(interval);
  }, [isRunning, isCountdownRunning, countdownLeft, elapsedTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!input && !['unix-time', 'world-clock', 'stopwatch-gen'].includes(id)) {
      setOutput('');
      return;
    }

    try {
      let result = '';
      const now = currentTime;

      switch (id) {
        case 'unix-time':
          if (!input) {
            result = `Current Unix Timestamp: ${Math.floor(now.getTime() / 1000)}\nISO 8601: ${now.toISOString()}\nUTC: ${now.toUTCString()}\nLocal: ${now.toLocaleString()}`;
          } else {
            const timestamp = Number(input);
            const isSeconds = timestamp < 10000000000;
            const date = isNaN(timestamp) ? new Date(input) : (isSeconds ? new Date(timestamp * 1000) : new Date(timestamp));
            result = `Unix Timestamp: ${Math.floor(date.getTime() / 1000)}\nISO 8601: ${date.toISOString()}\nUTC: ${date.toUTCString()}\nLocal: ${date.toLocaleString()}\nRelative: ${getRelativeTime(date)}`;
          }
          break;
        case 'unix-to-utc':
          const ts = Number(input);
          const uDate = new Date(ts < 10000000000 ? ts * 1000 : ts);
          result = uDate.toUTCString();
          break;
        case 'utc-to-unix':
          const uDate2 = new Date(input);
          result = Math.floor(uDate2.getTime() / 1000).toString();
          break;
        case 'seconds-to-hms':
          const seconds = parseInt(input);
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = seconds % 60;
          result = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          break;
        case 'hms-to-seconds':
          const partsHms = input.split(':').map(Number);
          if (partsHms.length === 3) {
            result = (partsHms[0] * 3600 + partsHms[1] * 60 + partsHms[2]).toString();
          } else if (partsHms.length === 2) {
            result = (partsHms[0] * 60 + partsHms[1]).toString();
          } else {
            result = "Format: HH:MM:SS or MM:SS";
          }
          break;
        case 'seconds-to-human':
          const secs = parseInt(input);
          result = formatHumanDuration(secs);
          break;
        case 'time-diff':
          const d1 = new Date(input);
          const d2 = new Date(input2);
          const diffMs = Math.abs(d2.getTime() - d1.getTime());
          const diffSecs = Math.floor(diffMs / 1000);
          result = `Difference:\nMs:      ${diffMs}\nSeconds: ${diffSecs}\nHuman:   ${formatHumanDuration(diffSecs)}`;
          break;
        case 'world-clock':
          const zones = [
            { name: 'UTC', zone: 'UTC' },
            { name: 'New York', zone: 'America/New_York' },
            { name: 'London', zone: 'Europe/London' },
            { name: 'Tokyo', zone: 'Asia/Tokyo' },
            { name: 'Sydney', zone: 'Australia/Sydney' }
          ];
          result = zones.map(z => `${z.name.padEnd(12)}: ${now.toLocaleTimeString('en-US', { timeZone: z.zone })} (${now.toLocaleDateString('en-US', { timeZone: z.zone })})`).join('\n');
          break;
        case 'leap-year-check':
          const year = parseInt(input) || now.getFullYear();
          const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
          result = `${year} is ${isLeap ? '' : 'NOT '}a leap year.`;
          break;
        case 'week-number':
          const dWeek = new Date(input);
          const tdt = new Date(dWeek.valueOf());
          const dayn = (dWeek.getDay() + 6) % 7;
          tdt.setDate(tdt.getDate() - dayn + 3);
          const firstThursday = tdt.valueOf();
          tdt.setMonth(0, 1);
          if (tdt.getDay() !== 4) {
            tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
          }
          result = `ISO Week Number: ${1 + Math.ceil((firstThursday - tdt.valueOf()) / 604800000)}`;
          break;
        case 'stopwatch-gen':
          const ms = elapsedTime % 1000;
          const sSt = Math.floor(elapsedTime / 1000) % 60;
          const mSt = Math.floor(elapsedTime / 60000) % 60;
          const hSt = Math.floor(elapsedTime / 3600000);
          result = `STOPWATCH:\n${hSt.toString().padStart(2, '0')}:${mSt.toString().padStart(2, '0')}:${sSt.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
          break;
        case 'countdown-timer':
          const cMs = countdownLeft % 1000;
          const cS = Math.floor(countdownLeft / 1000) % 60;
          const cM = Math.floor(countdownLeft / 60000) % 60;
          const cH = Math.floor(countdownLeft / 3600000);
          result = `COUNTDOWN:\n${cH.toString().padStart(2, '0')}:${cM.toString().padStart(2, '0')}:${cS.toString().padStart(2, '0')}.${cMs.toString().padStart(3, '0')}`;
          if (countdownLeft === 0 && !isCountdownRunning) result += "\n\nTIMER FINISHED!";
          break;
        default:
          result = '';
      }
      setOutput(result);
    } catch (err) {
      setOutput('Invalid Time Format');
    }
  }, [input, input2, id, currentTime]);

  const formatHumanDuration = (secs: number) => {
    const years = Math.floor(secs / 31536000);
    const days = Math.floor((secs % 31536000) / 86400);
    const hours = Math.floor((secs % 86400) / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const ss = secs % 60;
    const parts = [];
    if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (mins) parts.push(`${mins} minute${mins > 1 ? 's' : ''}`);
    if (ss) parts.push(`${ss} second${ss > 1 ? 's' : ''}`);
    return parts.join(', ') || '0 seconds';
  };

  const getRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (Math.abs(days) > 0) return `${Math.abs(days)} days ${days > 0 ? 'ago' : 'from now'}`;
    if (Math.abs(hours) > 0) return `${Math.abs(hours)} hours ${hours > 0 ? 'ago' : 'from now'}`;
    if (Math.abs(minutes) > 0) return `${Math.abs(minutes)} minutes ${minutes > 0 ? 'ago' : 'from now'}`;
    return 'Just now';
  };

  const setNow = () => {
    const n = new Date();
    if (id === 'unix-time' || id === 'unix-to-utc') {
      setInput(Math.floor(n.getTime() / 1000).toString());
    } else {
      setInput(n.toISOString());
    }
  };

  const controls = (
    <div className="flex flex-wrap items-center gap-4">
      {['unix-time', 'unix-to-utc', 'utc-to-unix', 'time-diff', 'week-number'].includes(id) && (
        <button 
          onClick={setNow}
          className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/20 transition-all"
        >
          Set to Now
        </button>
      )}
      {id === 'time-diff' && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">End Date/Time</span>
          <input 
            type="text" 
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ISO Date or Timestamp"
          />
        </div>
      )}
      {id === 'stopwatch-gen' && (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-xl transition-all ${isRunning ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => { setIsRunning(false); setElapsedTime(0); }}
            className="p-2 bg-slate-900 text-slate-400 border border-slate-800 rounded-xl hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
      {id === 'countdown-timer' && (
        <div className="flex items-center gap-2">
          {!isCountdownRunning && (
             <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secs</span>
              <input 
                type="number" 
                value={countdownInput} 
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setCountdownInput(val);
                  setCountdownLeft(val * 1000);
                }}
                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none"
              />
            </div>
          )}
          <button 
            onClick={() => {
              if (countdownLeft > 0) setIsCountdownRunning(!isCountdownRunning);
            }}
            className={`p-2 rounded-xl transition-all ${isCountdownRunning ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}
          >
            {isCountdownRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => { setIsCountdownRunning(false); setCountdownLeft(0); }}
            className="p-2 bg-slate-900 text-slate-400 border border-slate-800 rounded-xl hover:text-white transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
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
      controls={controls}
    />
  );
}
