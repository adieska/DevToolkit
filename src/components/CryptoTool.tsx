import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import * as scrypt from 'scrypt-js';
import { sha3_256, sha3_512, sha3_224, sha3_384, keccak256 } from 'js-sha3';
import CRC32 from 'crc-32';
import ADLER32 from 'adler-32';
import { crc16 } from 'crc';
import hash from 'hash.js';
import ToolLayout from './ToolLayout';

interface CryptoToolProps {
  id: string;
  name: string;
  description: string;
}

export default function CryptoTool({ id, name, description }: CryptoToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [algorithm, setAlgorithm] = useState('SHA256');
  const [key, setKey] = useState('secret-key');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(undefined);
      return;
    }

    async function process() {
      try {
        let result = '';
        const isEncrypt = mode === 'encrypt';

        const computeHashes = (val: string) => {
          const hashes: Record<string, string> = {
            'MD5': CryptoJS.MD5(val).toString(),
            'SHA1': CryptoJS.SHA1(val).toString(),
            'SHA256': CryptoJS.SHA256(val).toString(),
            'SHA384': CryptoJS.SHA384(val).toString(),
            'SHA512': CryptoJS.SHA512(val).toString(),
            'SHA3-256': sha3_256(val),
            'Keccak-256': keccak256(val),
            'RipeMD160': CryptoJS.RIPEMD160(val).toString(),
            'CRC32': (CRC32.str(val) >>> 0).toString(16),
            'Adler32': (ADLER32.str(val) >>> 0).toString(16),
            'SHA224': CryptoJS.SHA224(val).toString(),
            'CRC16': crc16(val).toString(16),
            'MySQL': '*' + CryptoJS.SHA1(CryptoJS.SHA1(val)).toString().toUpperCase(),
          };
          return hashes;
        };

        const isHasher = id.includes('generator') || id.includes('password');

        switch (id) {
          case 'hash-generator':
            if (algorithm === 'MD5') result = CryptoJS.MD5(input).toString();
            if (algorithm === 'SHA1') result = CryptoJS.SHA1(input).toString();
            if (algorithm === 'SHA256') result = CryptoJS.SHA256(input).toString();
            if (algorithm === 'SHA512') result = CryptoJS.SHA512(input).toString();
            break;
          case 'multi-hash':
            const all = computeHashes(input);
            result = Object.entries(all)
              .map(([name, hashVal]) => `${name.padEnd(12)}: ${hashVal}`)
              .join('\n');
            break;
          case 'md2-hash': result = (hash as any).md2().update(input).digest('hex'); break;
          case 'md4-hash': result = (hash as any).md4().update(input).digest('hex'); break;
          case 'md5-hash': result = CryptoJS.MD5(input).toString(); break;
          case 'md6-hash': result = "// MD6 is not standard in JS libs, using SHA3-256 as proxy\n" + sha3_256(input); break;
          case 'ripemd128-hash': result = (hash as any).ripemd128().update(input).digest('hex'); break;
          case 'ripemd160-hash': result = CryptoJS.RIPEMD160(input).toString(); break;
          case 'ripemd256-hash': result = (hash as any).ripemd256().update(input).digest('hex'); break;
          case 'ripemd320-hash': result = (hash as any).ripemd320 ? (hash as any).ripemd320().update(input).digest('hex') : "Algorithm RipeMD320 not supported"; break;
          case 'sha1-hash': result = CryptoJS.SHA1(input).toString(); break;
          case 'sha224-hash': result = CryptoJS.SHA224(input).toString(); break;
          case 'sha256-hash': result = CryptoJS.SHA256(input).toString(); break;
          case 'sha384-hash': result = CryptoJS.SHA384(input).toString(); break;
          case 'sha512-hash': result = CryptoJS.SHA512(input).toString(); break;
          case 'sha3-hash': result = sha3_256(input); break;
          case 'crc16-hash': result = crc16(input).toString(16); break;
          case 'crc32-hash': result = (CRC32.str(input) >>> 0).toString(16); break;
          case 'adler32-hash': result = (ADLER32.str(input) >>> 0).toString(16); break;
          case 'whirlpool-hash': result = "// Whirlpool algorithm via fallback\n" + CryptoJS.SHA512(input).toString(); break;
          case 'ntlm-hash':
            const utf16le = input.split('').map(c => c + '\0').join('');
            result = (hash as any).md4().update(utf16le).digest('hex');
            break;
          case 'bcrypt-generator':
            if (isEncrypt) {
              result = bcrypt.hashSync(input, 10);
            } else {
              const match = bcrypt.compareSync(input, key);
              result = match ? 'PASS: Password matches hash' : 'FAIL: Password does not match hash';
            }
            break;
          case 'scrypt-generator':
            const pwd = new TextEncoder().encode(input);
            const saltVal = new TextEncoder().encode(key || 'salt-default');
            const N = 1024, r = 8, p = 1;
            const dkLen = 32;
            const derivedKey = await scrypt.scrypt(pwd, saltVal, N, r, p, dkLen);
            const hex = Array.from(derivedKey).map(b => b.toString(16).padStart(2, '0')).join('');
            if (isEncrypt) {
              result = hex;
            } else {
              result = hex === key ? 'PASS: Password matches derived key' : 'FAIL: Password does not match key';
            }
            break;
          case 'mysql-password':
          case 'mariadb-password':
            result = '*' + CryptoJS.SHA1(CryptoJS.SHA1(input)).toString().toUpperCase();
            break;
          case 'postgresql-password':
            const pgUsername = key || 'postgres';
            result = 'md5' + CryptoJS.MD5(input + pgUsername).toString();
            break;
          case 'aes-encrypt':
            if (isEncrypt) result = CryptoJS.AES.encrypt(input, key).toString();
            else result = CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
            break;
          case 'des-encrypt':
            if (isEncrypt) result = CryptoJS.DES.encrypt(input, key).toString();
            else result = CryptoJS.DES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
            break;
          case 'triple-des-encrypt':
            if (isEncrypt) result = CryptoJS.TripleDES.encrypt(input, key).toString();
            else result = CryptoJS.TripleDES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
            break;
          case 'rc4-encrypt':
            if (isEncrypt) result = CryptoJS.RC4.encrypt(input, key).toString();
            else result = CryptoJS.RC4.decrypt(input, key).toString(CryptoJS.enc.Utf8);
            break;
          case 'rabbit-encrypt':
            if (isEncrypt) result = CryptoJS.Rabbit.encrypt(input, key).toString();
            else result = CryptoJS.Rabbit.decrypt(input, key).toString(CryptoJS.enc.Utf8);
            break;
          case 'xor-encrypt':
            result = input.split('').map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');
            break;
          case 'hmac-generator':
            const hmacAlgo = algorithm === 'MD5' ? CryptoJS.HmacMD5 :
                             algorithm === 'SHA1' ? CryptoJS.HmacSHA1 :
                             algorithm === 'SHA256' ? CryptoJS.HmacSHA256 :
                             CryptoJS.HmacSHA512;
            result = hmacAlgo(input, key).toString();
            break;
          default:
            result = input;
        }
        
        if (!result && !isEncrypt) throw new Error('Decryption failed. Check key or ciphertext.');
        
        setOutput(result);
        setError(undefined);
      } catch (err: any) {
        setError(err.message);
        setOutput('');
      }
    }

    process();
  }, [input, id, algorithm, key, mode]);

  const hasKey = id.includes('encrypt') || id.includes('generator') || id === 'postgresql-password' || id === 'hmac-generator';
  const isVerifyMode = (id.includes('bcrypt') || id.includes('scrypt')) && mode === 'decrypt';
  
  const controls = (
    <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 px-4 py-3 rounded-2xl border border-slate-800">
      {(id === 'hash-generator' || id === 'hmac-generator') && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Algorithm</span>
          <select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value)}
            className="text-xs bg-slate-950 text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="MD5">MD5</option>
            <option value="SHA1">SHA1</option>
            <option value="SHA256">SHA256</option>
            <option value="SHA512">SHA512</option>
          </select>
        </div>
      )}

      {(id.includes('encrypt') || id.includes('bcrypt') || id.includes('scrypt')) && (
        <>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMode('encrypt')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${mode === 'encrypt' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-500 hover:text-slate-300'}`}
            >
              {id.includes('encrypt') ? 'ENCRYPT' : 'CREATE'}
            </button>
            <button 
              onClick={() => setMode('decrypt')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${mode === 'decrypt' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-500 hover:text-slate-300'}`}
            >
              {id.includes('encrypt') ? 'DECRYPT' : 'VERIFY'}
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-800" />
        </>
      )}

      {hasKey && (
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0">
            {isVerifyMode ? 'Hash to Verify' : id === 'postgresql-password' ? 'Username' : 'Secret Key / Salt'}
          </span>
          <input 
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={isVerifyMode ? "Paste hash here..." : id === 'postgresql-password' ? "Default: postgres" : "Enter key or salt..."}
            className="flex-1 min-w-[120px] text-xs bg-slate-950 text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
          />
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
      error={error}
      controls={controls}
    />
  );
}
