import React,{useEffect,useState} from 'react';
import {NavLink,Outlet,useLocation} from 'react-router-dom';
import {Bell,LogOut,ChevronDown,LayoutGrid,Users,CreditCard,Upload,UserCog,FileText,Trash2,Menu,X} from 'lucide-react';
export const NAV=[{to:'/dashboard',label:'Dashboard',icon:LayoutGrid},{to:'/clients',label:'ReKYC Client',icon:Users},{to:'/payments',label:'Payment',icon:CreditCard},{to:'/upload',label:'Upload',icon:Upload},{to:'/users',label:'User Management',icon:UserCog},{to:'/audit-logs',label:'Audit Log',icon:FileText},{to:'/trash',label:'Trash',icon:Trash2}];
export default function Layout(){const [open,setOpen]=useState(false);const {pathname}=useLocation();useEffect(()=>setOpen(false),[pathname]);
 const logout=()=>{localStorage.removeItem('rekyc_admin_token');location.href='/login'};
 return <div className={`layout${open?' nav-open':''}`}>
  <aside className="sidebar"><div className="sidebar-logo"><img src="/aionion-logo.png" alt="Aionion Capital"/><button className="sidebar-close" onClick={()=>setOpen(false)} aria-label="Close menu"><X size={20}/></button></div>
   <nav>{NAV.map(({to,label,icon:Icon})=><NavLink key={to} to={to} className={({isActive})=>`nav-item${isActive?' active':''}`}><Icon size={19}/><span>{label}</span></NavLink>)}</nav></aside>
  <div className="sidebar-backdrop" onClick={()=>setOpen(false)}/>
  <div className="layout-main"><header className="topbar"><div className="brand"><button className="menu-btn" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={20}/></button><div><b>AEON ReKYC Admin</b><span>KYC Operations & Verification</span></div></div><div className="top-actions"><button className="bell"><Bell size={19}/><i/></button><div className="admin-chip"><div>A</div><span><b>Admin</b><small>KYC Team</small></span><ChevronDown size={16}/></div><button className="logout" onClick={logout}><LogOut size={17}/> Logout</button></div></header>
   <Outlet/></div>
 </div>
}
