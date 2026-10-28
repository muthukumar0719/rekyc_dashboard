import React,{useEffect,useState} from 'react';
import {Trash2,X,History} from 'lucide-react';
import {api} from '../api';
// Delete a request (reason required) and view the delete log. The backend removes the rekyc_master row and logs who/why/when in rekyc_delete_logs.
const Modal=({title,icon:Icon,onClose,wide,children})=><div className="pdf-preview-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className={`modal-card${wide?' wide':''}`}><div className="pdf-preview-head"><b><Icon size={17}/> {title}</b><button className="icon-btn" onClick={onClose}><X/></button></div>{children}</div></div>;
export function DeleteDialog({row,onClose,onDeleted}){const [reason,setReason]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const submit=async()=>{if(!reason.trim())return setError('Please enter a reason for deleting this request.');setBusy(true);setError('');try{await api.deleteRequest(row.id,reason.trim());onDeleted(row)}catch(e){setError(e.message||'Could not delete')}finally{setBusy(false)}};
 return <Modal title="Delete request" icon={Trash2} onClose={onClose}><div className="modal-body">
  <p>Delete the ReKYC request for <b>{row.client_code||`#${row.id}`}</b>{row.change_types?.length?<> ({row.change_types.join(', ')})</>:null}? It will be removed from the database. Your username, the reason and the time are saved in the delete log.</p>
  <label>Reason <span className="req">*</span></label><textarea rows="4" autoFocus value={reason} onChange={e=>setReason(e.target.value)} placeholder="Why is this request being deleted?"/>
  {error&&<div className="error-box">{error}</div>}
  <div className="modal-actions"><button className="view-btn" disabled={busy} onClick={onClose}>Cancel</button><button className="delete-btn" disabled={busy} onClick={submit}><Trash2 size={16}/> {busy?'Deleting...':'Delete'}</button></div>
 </div></Modal>
}
export function DeleteLogs({onClose}){return <Modal title="Delete logs" icon={History} onClose={onClose} wide><div className="modal-body logs"><DeleteLogsTable/></div></Modal>}
export function DeleteLogsTable(){const [items,setItems]=useState(null),[error,setError]=useState('');useEffect(()=>{api.deleteLogs().then(d=>setItems(d.items||[])).catch(e=>setError(e.message))},[]);
 return <>
  {error?<div className="error-box">{error}</div>:!items?<div className="loading">Loading...</div>:!items.length?<div className="empty">No requests have been deleted.</div>:
  <div className="table-wrap"><table><thead><tr><th>Deleted at</th><th>Client</th><th>Request ID</th><th>Change Type</th><th>Deleted by</th><th>Reason</th></tr></thead><tbody>{items.map(l=><tr key={l.id}><td style={{whiteSpace:'nowrap'}}>{l.deleted_at?new Date(l.deleted_at).toLocaleString():'—'}</td><td><b>{l.client_code||'—'}</b></td><td>{l.request_id}</td><td>{l.change_types||'—'}</td><td>{l.deleted_by||'—'}</td><td className="log-reason">{l.reason}</td></tr>)}</tbody></table></div>}
 </>
}
