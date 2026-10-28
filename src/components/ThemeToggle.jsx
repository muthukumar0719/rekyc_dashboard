import React,{useEffect,useState} from 'react';
import {Sun,Moon} from 'lucide-react';
// Theme lives on <html data-theme>; index.html sets it before first paint from the saved choice, else the system setting.
const KEY='rekyc_theme';
const current=()=>document.documentElement.dataset.theme==='dark'?'dark':'light';
export default function ThemeToggle(){const [theme,setTheme]=useState(current);
 useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem(KEY,theme)}catch{}},[theme]);
 const dark=theme==='dark',Icon=dark?Moon:Sun;
 return <button className="theme-toggle" onClick={()=>setTheme(dark?'light':'dark')} title={`Switch to ${dark?'light':'dark'} mode`} aria-label={`Switch to ${dark?'light':'dark'} mode`}><Icon size={17}/> {dark?'Dark Mode':'Light Mode'}</button>}
