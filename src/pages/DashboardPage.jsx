import React,{useEffect,useState} from 'react';
import {Clock3,CheckCircle2,Files,RefreshCw} from 'lucide-react';
import {api} from '../api';
import StatCard from '../components/StatCard';
export default function DashboardPage(){const [stats,setStats]=useState({});const [loading,setLoading]=useState(false);const [error,setError]=useState('');
 const load=async()=>{setLoading(true);setError('');try{setStats(await api.stats())}catch(e){setError(e.message||'Failed to load stats')}finally{setLoading(false)}};useEffect(()=>{load()},[]);
 return <main className="dashboard"><div className="page-title"><div><p>OPERATIONS / REKYC</p><h1>Dashboard</h1><span>Overview of ReKYC accounts and change requests.</span></div><button className="refresh" onClick={load}><RefreshCw size={17} className={loading?'spin':''}/> Refresh</button></div>
 {error&&<div className="error-box" style={{marginBottom:16}}>Could not load stats: {error}</div>}
 <div className="stats-grid three"><StatCard label="Total Account Count" value={stats.totalAccounts} icon={Files} sub="All ReKYC accounts" tone="blue"/><StatCard label="Modified Account Count" value={stats.modifiedAccounts} icon={CheckCircle2} sub="Accounts with a change request" tone="green"/><StatCard label="Unmodified Account Count" value={stats.unmodifiedAccounts} icon={Clock3} sub="Accounts with no changes" tone="amber"/></div>
 </main>
}
