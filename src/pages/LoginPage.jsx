import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {LockKeyhole,UserRound,ShieldCheck} from 'lucide-react';
import {api} from '../api';
export default function LoginPage(){
 const nav=useNavigate(); const [username,setUsername]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
 const submit=async(e)=>{e.preventDefault();setLoading(true);setError('');try{const d=await api.login(username,password);localStorage.setItem('rekyc_admin_token',d.token);localStorage.setItem('rekyc_admin_user',d.user.username);nav('/dashboard')}catch(e){setError(e.message)}finally{setLoading(false)}};
 return <div className="login-shell"><div className="login-glow g1"/><div className="login-glow g2"/><div className="login-card">
  <img src="/aionion-logo.png" className="login-logo"/><div className="login-badge"><ShieldCheck size={15}/> KYC Operations Portal</div>
  <h1>ReKYC Admin Dashboard</h1><p>Review client modification requests, validate verification checks and submit approved changes for further processing.</p>
  <form onSubmit={submit}><label>Username</label><div className="input-wrap"><UserRound size={18}/><input value={username} onChange={e=>setUsername(e.target.value)} /></div><label>Password</label><div className="input-wrap"><LockKeyhole size={18}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></div>{error&&<div className="error-box">{error}</div>}<button className="primary-btn full" disabled={loading}>{loading?'Signing in...':'Login to Dashboard'}</button></form>
 </div></div>
}
