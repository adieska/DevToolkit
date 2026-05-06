import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ToolLayout from './ToolLayout';

interface DataToolProps {
  id: string;
  name: string;
  description: string;
}

export default function DataTool({ id, name, description }: DataToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      const parsed = Papa.parse(input, { skipEmptyLines: true });
      const data = parsed.data as string[][];
      let result = '';

      switch (id) {
        case 'transpose-csv':
          if (data.length === 0) return;
          const transposed = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
          result = Papa.unparse(transposed);
          break;
        case 'csv-delimiter':
          result = Papa.unparse(data, { delimiter });
          break;
        case 'csv-to-tsv':
          result = Papa.unparse(data, { delimiter: '\t' });
          break;
        case 'tsv-to-csv':
          const tsvParsed = Papa.parse(input, { delimiter: '\t', skipEmptyLines: true });
          result = Papa.unparse(tsvParsed.data);
          break;
        default:
          result = input;
      }
      setOutput(result);
    } catch (err) {
      setOutput('Error processing data: ' + (err as Error).message);
    }
  }, [input, id, delimiter]);

  const controls = id === 'csv-delimiter' ? (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delimiter</span>
      <select 
        value={delimiter} 
        onChange={(e) => setDelimiter(e.target.value)}
        className="text-xs bg-slate-950 text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value=",">Comma (,)</option>
        <option value=";">Semicolon (;)</option>
        <option value="|">Pipe (|)</option>
        <option value="\t">Tab (\t)</option>
      </select>
    </div>
  ) : undefined;

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
