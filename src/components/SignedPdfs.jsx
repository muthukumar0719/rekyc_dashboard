import React,{useEffect,useState} from 'react';
import {FileCheck2,Eye,Download,X} from 'lucide-react';
import {api} from '../api';
// Signed eSign PDFs (S3: Client/Upload/esigned_pdf/<PAN>.pdf). Only forms whose eSign is completed are returned by the API,
// so nothing renders for a pending eSign. Preview/download use a short-lived presigned URL.
export function SignedPdfButtons({id,pdfs,compact}){const [busy,setBusy]=useState(null),[preview,setPreview]=useState(null);
 const open=async(p,mode)=>{setBusy(`${p.form_type}:${mode}`);try{const d=await api.signedPdfUrl(id,p.form_type,mode);if(mode==='preview')setPreview({...p,url:d.url,file_name:d.file_name});else location.href=d.url}catch(e){alert(e.message)}finally{setBusy(null)}};
 const many=pdfs.length>1;
 return <>{pdfs.map(p=><div className={compact?'signed-pdf-compact':'signed-pdf'} key={p.form_type}>{compact?(many&&<small>{p.form_type}</small>):<div><b>{p.label}</b><span>eSign completed{p.signed_at?` · ${new Date(p.signed_at).toLocaleString()}`:''}</span></div>}<div className="signed-pdf-actions"><button className="pdf-btn" disabled={!!busy} onClick={()=>open(p,'preview')}><Eye size={16}/> {busy===`${p.form_type}:preview`?'Loading...':compact?'View':'View PDF'}</button><button className="pdf-btn primary" disabled={!!busy} onClick={()=>open(p,'download')}><Download size={16}/> {busy===`${p.form_type}:download`?'Preparing...':compact?'Download':'Download PDF'}</button></div></div>)}
  {preview&&<div className="pdf-preview-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setPreview(null)}}><div className="pdf-preview"><div className="pdf-preview-head"><b>{preview.label} — {preview.file_name}</b><button className="pdf-btn primary" disabled={!!busy} onClick={()=>open(preview,'download')}><Download size={16}/> Download PDF</button><button className="icon-btn" onClick={()=>setPreview(null)}><X/></button></div><iframe title="Signed PDF preview" src={preview.url}/></div></div>}
 </>
}
export default function SignedPdfs({id}){const [pdfs,setPdfs]=useState([]);useEffect(()=>{setPdfs([]);if(id)api.signedPdfs(id).then(d=>setPdfs(d.signed_pdfs||[])).catch(()=>setPdfs([]))},[id]);
 if(!pdfs.length)return null;
 return <section><h4><FileCheck2 size={17}/> Signed documents</h4><div className="signed-pdfs"><SignedPdfButtons id={id} pdfs={pdfs}/></div></section>
}
