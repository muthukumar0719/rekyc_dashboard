import React from 'react';
export function StatusBadge({status}){const s=(status||'pending').toLowerCase();let cls='pending';if(s.includes('verif')||s.includes('approve')||s==='success')cls='verified';else if(s.includes('reject')||s.includes('fail'))cls='rejected';else if(s.includes('progress')||s.includes('submit'))cls='progress';return <span className={`status-badge ${cls}`}>{status||'Pending'}</span>}
export function CheckPill({label,ok,pending}){return <span className={`check-pill ${ok?'ok':pending?'wait':'muted'}`}><i/>{label}</span>}
