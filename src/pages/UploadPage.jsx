import React,{useRef,useState} from 'react';
import {Upload,FileText,X,CheckCircle2,AlertTriangle} from 'lucide-react';
import {unzip} from 'fflate';
import {api} from '../api';
// Stamp paper upload: PDFs named <stamp number>.pdf (or a .zip of them) go straight from the browser to S3 through presigned links, in batches
// matching the server's limit; each batch is then registered in stamp_paper_master as Available. See /stamp-papers/* in server routes/admin.js.
const BATCH=500,PARALLEL=6;
const stampOf=name=>name.split('/').pop().replace(/\.pdf$/i,'').trim().toUpperCase();
const isPdf=name=>/\.pdf$/i.test(name)&&!name.split('/').some(p=>p.startsWith('.')||p==='__MACOSX');
const unzipFile=file=>file.arrayBuffer().then(buf=>new Promise((ok,fail)=>unzip(new Uint8Array(buf),{filter:f=>isPdf(f.name)},(e,out)=>e?fail(e):ok(Object.entries(out).map(([name,data])=>({name:name.split('/').pop(),blob:new Blob([data],{type:'application/pdf'})}))))));
async function pool(items,fn){let i=0;await Promise.all(Array.from({length:Math.min(PARALLEL,items.length)},async()=>{while(i<items.length)await fn(items[i++])}))}
export default function UploadPage(){const input=useRef(null);const [files,setFiles]=useState([]);const [rejected,setRejected]=useState([]);const [reading,setReading]=useState(false);const [drag,setDrag]=useState(false);const [busy,setBusy]=useState(false);const [progress,setProgress]=useState(null);const [result,setResult]=useState(null);const [error,setError]=useState('');
 // Turns picked files into {number,name,blob}; a number picked twice is kept once.
 const add=async list=>{setError('');setResult(null);setReading(true);try{const next=[...files],bad=[...rejected],seen=new Set(files.map(f=>f.number));
  for(const f of list){const entries=/\.zip$/i.test(f.name)?await unzipFile(f).catch(()=>{bad.push({name:f.name,reason:'Could not read this zip'});return []}):isPdf(f.name)?[{name:f.name,blob:f}]:(bad.push({name:f.name,reason:'Not a PDF or ZIP'}),[]);
   for(const x of entries){const number=stampOf(x.name);if(seen.has(number))bad.push({name:x.name,reason:'Repeated in this upload'});else{seen.add(number);next.push({number,name:x.name,blob:x.blob})}}}
  setFiles(next);setRejected(bad)}finally{setReading(false)}};
 const clear=()=>{setFiles([]);setRejected([]);setResult(null);setError('');setProgress(null)};
 const upload=async()=>{setBusy(true);setError('');setResult(null);const out={added:[],skipped:[],failed:[],location:''};setProgress({done:0,total:files.length});
  try{for(let b=0;b<files.length;b+=BATCH){const batch=files.slice(b,b+BATCH),byNumber=new Map(batch.map(f=>[f.number,f]));
    const {items,skipped,location}=await api.stampUploadUrls(batch.map(f=>f.number));out.location=location;out.skipped.push(...skipped);setProgress(p=>({...p,done:p.done+skipped.length}));
    const uploaded=[];await pool(items,async({number,url})=>{try{const r=await fetch(url,{method:'PUT',headers:{'Content-Type':'application/pdf'},body:byNumber.get(number).blob});if(!r.ok)throw new Error(`S3 returned ${r.status}`);uploaded.push(number)}catch(e){out.failed.push({number,reason:e.message==='Failed to fetch'?'Upload to S3 blocked (check bucket CORS)':e.message})}setProgress(p=>({...p,done:p.done+1}))});
    if(uploaded.length){const reg=await api.stampRegister(uploaded);out.added.push(...reg.added);out.skipped.push(...reg.skipped)}}
   setFiles([]);setRejected([])}catch(e){setError(e.message||'Upload failed')}finally{setResult(out);setBusy(false)}};
 const onDrop=e=>{e.preventDefault();setDrag(false);if(!busy)add([...e.dataTransfer.files])};
 return <main className="dashboard"><div className="page-title"><div><p>OPERATIONS / UPLOAD</p><h1>Upload</h1></div></div>
 <div className="upload-card"><div className="upload-head"><div className="upload-icon"><Upload size={20}/></div><div><h2>Stamp Paper Upload</h2><p>Bulk upload stamp paper PDFs to S3 and add them to stock</p></div></div>
  <div className="upload-body">
   <div className={`dropzone${drag?' drag':''}${busy?' disabled':''}`} onClick={()=>!busy&&input.current?.click()} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={onDrop}>
    <Upload size={24}/><b><span>Click to choose</span> or drag PDFs or a ZIP here</b><small>Select many PDFs or one .zip of PDFs (3,000+ files supported)</small>
    <input ref={input} type="file" multiple accept=".pdf,.zip,application/pdf,application/zip" hidden onChange={e=>{add([...e.target.files]);e.target.value=''}}/></div>
   {reading&&<p className="upload-note">Reading files...</p>}
   {files.length>0&&<div className="upload-selected"><FileText size={18}/><span><b>{files.length.toLocaleString('en-IN')}</b> PDF{files.length>1?'s':''} ready{files.length<=5?`: ${files.map(f=>f.number).join(', ')}`:''}</span>{!busy&&<button className="view-btn" onClick={clear}><X size={15}/> Clear</button>}</div>}
   {rejected.length>0&&<details className="upload-list warn"><summary><AlertTriangle size={15}/> {rejected.length} file{rejected.length>1?'s':''} left out</summary><ul>{rejected.map((r,i)=><li key={i}><b>{r.name}</b> — {r.reason}</li>)}</ul></details>}
   <ul className="upload-rules"><li>Name each PDF after its stamp number, e.g. <b>DK123456.pdf</b>.</li><li>Stored in S3 at <b>{result?.location||'aionion-rekyc-document/Client/Upload/stamp_paper/stamp-paper/'}</b> and added as <b>Available</b> stock.</li><li>Duplicates are not allowed: numbers already in the table or S3 are skipped.</li></ul>
   {progress&&busy&&<div className="upload-progress"><div style={{width:`${progress.total?progress.done/progress.total*100:0}%`}}/><span>{progress.done.toLocaleString('en-IN')} / {progress.total.toLocaleString('en-IN')}</span></div>}
   {error&&<div className="error-box">{error}</div>}
   {result&&<div className="upload-result"><p className="ok"><CheckCircle2 size={18}/> {result.added.length.toLocaleString('en-IN')} stamp paper{result.added.length===1?'':'s'} added to stock{result.location?` (S3: ${result.location})`:''}</p>
    {[['Skipped',result.skipped,'warn'],['Failed',result.failed,'bad']].map(([label,list,cls])=>list.length>0&&<details key={label} className={`upload-list ${cls}`}><summary>{label}: {list.length}</summary><ul>{list.map((r,i)=><li key={i}><b>{r.number}</b> — {r.reason}</li>)}</ul></details>)}</div>}
   <div className="upload-actions"><button className="upload-btn" disabled={!files.length||busy||reading} onClick={upload}>{busy?'Uploading...':'Upload Stamp Papers'}</button></div>
  </div></div></main>
}
