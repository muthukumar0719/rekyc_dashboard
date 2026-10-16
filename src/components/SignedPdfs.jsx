import React,{useEffect,useState} from 'react';
import {FileCheck2,Eye,Download,X} from 'lucide-react';
import {api} from '../api';
// Client documents from S3 (Client/Upload/<folder>/<PAN>.<ext>): the API returns only the files that exist and apply to the
// categories this client changed (eSigned, Modification ReKYC, Nominee, DDPI PDFs, Aadhaar XML). Preview/download use a short-lived presigned URL.
export function SignedPdfButtons({id,pdfs,compact}){const [busy,setBusy]=useState(null),[preview,setPreview]=useState(null);
 const open=async(p,mode)=>{setBusy(`${p.form_type}:${mode}`);try{const d=await api.signedPdfUrl(id,p.form_type,mode);if(mode==='preview')setPreview({...p,url:d.url,file_name:d.file_name});else location.href=d.url}catch(e){alert(e.message)}finally{setBusy(null)}};
 const many=pdfs.length>1;
 return <>{pdfs.map(p=><div className={compact?'signed-pdf-compact':'signed-pdf'} key={p.form_type}>{compact?(many&&<small>{p.label}</small>):<div><b>{p.label}</b><span>{p.file_name}{p.signed_at?` · ${new Date(p.signed_at).toLocaleString()}`:''}</span></div>}<div className="signed-pdf-actions"><button className="pdf-btn" disabled={!!busy} onClick={()=>open(p,'preview')}><Eye size={16}/> {busy===`${p.form_type}:preview`?'Loading...':'View'}</button><button className="pdf-btn primary" disabled={!!busy} onClick={()=>open(p,'download')}><Download size={16}/> {busy===`${p.form_type}:download`?'Preparing...':'Download'}</button></div></div>)}
  {preview&&<div className="pdf-preview-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setPreview(null)}}><div className="pdf-preview"><div className="pdf-preview-head"><b>{preview.label} — {preview.file_name}</b><button className="pdf-btn primary" disabled={!!busy} onClick={()=>open(preview,'download')}><Download size={16}/> Download</button><button className="icon-btn" onClick={()=>setPreview(null)}><X/></button></div><iframe title="Document preview" src={preview.url}/></div></div>}
 </>
}
export default function SignedPdfs({id}){const [pdfs,setPdfs]=useState([]),[lookup,setLookup]=useState(null);useEffect(()=>{setPdfs([]);setLookup(null);if(id)api.signedPdfs(id).then(d=>{setPdfs(d.signed_pdfs||[]);setLookup(d.lookup||null)}).catch(()=>setPdfs([]))},[id]);
 const missing=lookup?.missing||[];if(!pdfs.length&&!lookup?.reason&&!missing.length)return null;
 // Explains an empty/partial list: no PAN for the client, or which S3 paths were checked for each missing document.
 return <section><h4><FileCheck2 size={17}/> Documents</h4>{pdfs.length>0&&<div className="signed-pdfs"><SignedPdfButtons id={id} pdfs={pdfs}/></div>}{(lookup?.reason||missing.length>0)&&<div className="docs-missing">{lookup.reason?<p>{lookup.reason}</p>:missing.map(m=><p key={m.label}><b>{m.label}</b> not found. Looked in: {m.looked_in.join(' · ')}</p>)}</div>}</section>
}
