import React,{useEffect,useState} from 'react';
import {Clock3,CheckCircle2,Files,RefreshCw} from 'lucide-react';
import {api} from '../api';
import StatCard from '../components/StatCard';
const fmt=n=>n==null?'—':Number(n).toLocaleString('en-IN');
export default function DashboardPage(){const [stats,setStats]=useState({});const [stamp,setStamp]=useState({});const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [stampError,setStampError]=useState('');
 // Stamp paper stats load separately so a missing stamp table does not hide the account stats.
 const load=async()=>{setLoading(true);setError('');setStampError('');await Promise.all([api.stats().then(setStats).catch(e=>setError(e.message||'Failed to load stats')),api.stampPaperStats().then(setStamp).catch(e=>setStampError(e.message||'Failed to load stamp papers'))]);setLoading(false)};useEffect(()=>{load()},[]);
 return <main className="dashboard"><div className="page-title"><div><p>OPERATIONS / REKYC</p><h1>Dashboard</h1><span>Overview of ReKYC accounts and change requests.</span></div><button className="refresh" onClick={load}><RefreshCw size={17} className={loading?'spin':''}/> Refresh</button></div>
 {error&&<div className="error-box" style={{marginBottom:16}}>Could not load stats: {error}</div>}
 <div className="stats-grid three"><StatCard label="Total Account Count" value={stats.totalAccounts} icon={Files} sub="All ReKYC accounts" tone="blue"/><StatCard label="Modified Account Count" value={stats.modifiedAccounts} icon={CheckCircle2} sub="Accounts with a change request" tone="green"/><StatCard label="Unmodified Account Count" value={stats.unmodifiedAccounts} icon={Clock3} sub="Accounts with no changes" tone="amber"/></div>
 <section className="stamp-section"><h2>Stamp Paper</h2>
  {stampError?<div className="error-box">Could not load stamp papers: {stampError}</div>:<div className="stamp-grid"><div className="stamp-card"><span>Total Accounts</span><strong>{fmt(stamp.total)}</strong></div><div className="stamp-card used"><span>Used</span><strong>{fmt(stamp.used)}</strong></div><div className="stamp-card available"><span>Available</span><strong>{fmt(stamp.available)}</strong></div></div>}
 </section>
 </main>
}
