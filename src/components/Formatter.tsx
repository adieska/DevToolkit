import { useState, useEffect } from 'react';
import beautify from 'js-beautify';
import formatXml from 'xml-formatter';
import { format as formatSql } from 'sql-formatter';
import ToolLayout from './ToolLayout';

interface FormatterProps {
  id: string;
  name: string;
  description: string;
}

export default function Formatter({ id, name, description }: FormatterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [indentSize, setIndentSize] = useState(2);

  const getPresets = () => {
    if (id.includes('json')) return [{ label: 'Object', value: '{"name":"DevToolKit","version":"1.0.0","features":["Formatter","Generator","Converter"],"active":true,"metadata":{"tags":["tool","dev","productivity"]}}' }, { label: 'Array', value: '[{"id":1,"task":"Fix bugs"},{"id":2,"task":"Deploy"},{"id":3,"task":"Write Readme"}]' }];
    if (id.includes('html')) return [{ label: 'Basic Page', value: '<!DOCTYPE html><html><head><title>Test Page</title></head><body><h1>Hello World</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></body></html>' }, { label: 'Form', value: '<form action="/submit"><label for="name">Name:</label><input type="text" id="name"><button type="submit">Submit</button></form>' }];
    if (id.includes('css')) return [{ label: 'Layout', value: '.container { display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; background: #0a0c10; color: #fff; }' }, { label: 'Card', value: '.card { width: 300px; border-radius: 1rem; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #1e293b; }' }];
    if (id.includes('js')) return [{ label: 'Function', value: 'function calculateSum(a, b) { const result = a + b; console.log("The sum is: " + result); return result; }' }, { label: 'Async', value: 'async function fetchData(url) { try { const response = await fetch(url); const data = await response.json(); return data; } catch (error) { console.error("Error:", error); } }' }];
    if (id.includes('xml')) return [{ label: 'RSS', value: '<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>Latest News</title><link>http://example.com</link><description>Global Headlines</description><item><title>DevToolKit 1.0.0 Released</title><link>http://example.com/1.0.0</link></item></channel></rss>' }];
    if (id.includes('sql')) return [{ label: 'Select', value: 'SELECT users.name, orders.amount FROM users JOIN orders ON users.id = orders.user_id WHERE orders.status = "completed" ORDER BY orders.created_at DESC LIMIT 10;' }];
    if (id.includes('graphql')) return [{ label: 'Query', value: 'query GetUserData($userId: ID!) { user(id: $userId) { id username email profile { bio avatarUrl followersCount } posts(limit: 5) { id title createdAt } } }' }];
    return [];
  };

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(undefined);
      return;
    }

    try {
      let result = '';
      const opts = { indent_size: indentSize, space_in_empty_paren: true };

      switch (id) {
        case 'json-prettify':
          result = JSON.stringify(JSON.parse(input), null, indentSize);
          break;
        case 'json-minify':
          result = JSON.stringify(JSON.parse(input));
          break;
        case 'json-validate':
          JSON.parse(input);
          result = "Valid JSON";
          break;
        case 'html-prettify':
          result = beautify.html(input, opts);
          break;
        case 'html-minify':
          result = input.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
          break;
        case 'css-prettify':
          result = beautify.css(input, opts);
          break;
        case 'css-minify':
          result = input.replace(/\s+/g, ' ').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*([:;{}])\s*/g, '$1').trim();
          break;
        case 'js-prettify':
          result = beautify.js(input, opts);
          break;
        case 'js-minify':
          result = input.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
          break;
        case 'js-validate':
          new Function(input);
          result = "Valid JavaScript Syntax";
          break;
        case 'xml-prettify':
          result = formatXml(input, { indentation: ' '.repeat(indentSize) });
          break;
        case 'xml-minify':
          result = input.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
          break;
        case 'sql-prettify':
          result = formatSql(input, { tabWidth: indentSize, language: 'sql', keywordCase: 'upper' });
          break;
        case 'graphql-prettify':
          // Simple GraphQL formatter logic
          let indent = 0;
          result = input
            .replace(/\s+/g, ' ')
            .replace(/\{/g, ' {\n')
            .replace(/\}/g, '\n}\n')
            .split('\n')
            .map(line => {
              line = line.trim();
              if (line.includes('}')) indent--;
              const spaced = ' '.repeat(Math.max(0, indent * indentSize)) + line;
              if (line.includes('{')) indent++;
              return spaced;
            })
            .join('\n')
            .replace(/\n\s*\n/g, '\n')
            .trim();
          break;
        default:
          result = input;
      }
      setOutput(result);
      setError(undefined);
    } catch (err: any) {
      setError(err.message || 'Invalid input for formatter');
      setOutput('');
    }
  }, [input, id, indentSize]);

  const controls = (
    <div className="flex items-center gap-4 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Indent Space</span>
        <select 
          value={indentSize} 
          onChange={(e) => setIndentSize(Number(e.target.value))}
          className="text-xs bg-slate-950 text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
          <option value={8}>8 Spaces</option>
        </select>
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
      error={error}
      presets={getPresets()}
      controls={id.includes('prettify') ? controls : undefined}
    />
  );
}
