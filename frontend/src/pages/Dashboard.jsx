import { useEffect, useState } from 'react';
import { ClipboardList, Activity, CheckCircle2, IndianRupee, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n||0);
export default function Dashboard(){
  const {user}=useAuth(); const [data,setData]=useState(null); const [repairs,setRepairs]=useState([]); const [error,setError]=useState('');
  useEffect(()=>{api.get('/repairs').then(r=>setRepairs(r.data.slice(0,5))).catch(e=>setError(e.response?.data?.message||'Unable to load repairs')); if(user.role!=='customer')api.get('/dashboard/summary').then(r=>setData(r.data)).catch(()=>{});},[]);
  const stats=user.role==='customer'?[
    {label:'My repair requests',value:repairs.length,icon:ClipboardList,tone:'blue'},
    {label:'In progress',value:repairs.filter(x=>['Diagnosing','In Progress','Waiting for Parts'].includes(x.status)).length,icon:Activity,tone:'orange'},
    {label:'Completed',value:repairs.filter(x=>x.status==='Completed').length,icon:CheckCircle2,tone:'green'}
  ]:[
    {label:'Total repair orders',value:data?.total??'—',icon:ClipboardList,tone:'blue'},
    {label:'Active jobs',value:data?.active??'—',icon:Activity,tone:'orange'},
    {label:'Completed jobs',value:data?.completed??'—',icon:CheckCircle2,tone:'green'},
    {label:'Completed value',value:data?money(data.revenue):'—',icon:IndianRupee,tone:'purple'}
  ];
  const chart=(data?.byStatus||[]).map(x=>({status:x._id,count:x.count}));
  return <><div className="page-heading"><div><span className="eyebrow">OVERVIEW / DASHBOARD</span><h1>{user.role==='customer'?'Your service overview':'Operations overview'}</h1><p>Here’s what’s happening across your service desk today.</p></div><div className="date-chip">{new Date().toLocaleDateString('en-IN',{weekday:'short',day:'2-digit',month:'short',year:'numeric'})}</div></div>
    {error&&<div className="error-box">{error}</div>}
    <div className={`stats-grid ${stats.length===3?'three':''}`}>{stats.map((s,i)=><div className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><s.icon size={19}/></div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div><div className="stat-foot"><span className="tiny-dot"/> Updated just now</div></div>)}</div>
    {user.role!=='customer'&&<div className="dashboard-grid"><section className="panel chart-panel"><div className="panel-head"><div><h3>Repair pipeline</h3><p>Work orders by current status</p></div><span className="panel-tag">LIVE DATA</span></div>{chart.length?<ResponsiveContainer width="100%" height={250}><BarChart data={chart} margin={{top:10,right:10,left:-18,bottom:5}}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f4"/><XAxis dataKey="status" tick={{fontSize:11,fill:'#7c8798'}} axisLine={false} tickLine={false}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:'#7c8798'}} axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="count" fill="#4f75e8" radius={[6,6,0,0]} barSize={36}/></BarChart></ResponsiveContainer>:<div className="empty-chart">No repair data yet. Create your first repair order.</div>}</section><section className="panel alert-panel"><div className="panel-head"><div><h3>Inventory watch</h3><p>Items that need attention</p></div><AlertTriangle size={19} color="#d99134"/></div><div className="alert-number">{data?.lowStock??'—'}</div><p className="muted">Items at or below their reorder level.</p><div className="alert-note">Review stock levels before accepting new jobs.</div></section></div>}
    <section className="panel recent-panel"><div className="panel-head"><div><h3>{user.role==='customer'?'Your recent repairs':'Recent repair orders'}</h3><p>Latest activity from your workspace</p></div><a className="text-link" href="/repairs">View all <ArrowUpRight size={15}/></a></div><RepairTable rows={repairs}/></section>
  </>;
}
function RepairTable({rows}){
 return rows.length?<div className="table-wrap"><table><thead><tr><th>TRACKING ID</th><th>DEVICE</th><th>ISSUE</th><th>STATUS</th><th>CREATED</th></tr></thead><tbody>{rows.map(r=><tr key={r._id}><td className="tracking">{r.trackingId}</td><td><b>{r.device}</b><small>{r.category}</small></td><td>{r.issue}</td><td><span className={`status status-${r.status.toLowerCase().replaceAll(' ','-')}`}>{r.status}</span></td><td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div>:<div className="empty-state"><ClipboardList size={28}/><b>No repair requests yet</b><span>Your repair activity will appear here.</span></div>;
}
