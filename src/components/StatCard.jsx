import React from 'react';
export default function StatCard({label,value,icon:Icon,sub,tone='blue'}){return <div className={`stat-card ${tone}`}><div className="stat-icon"><Icon size={20}/></div><div><span>{label}</span><strong>{value??0}</strong><small>{sub}</small></div></div>}
