import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Wrench, LayoutDashboard, ClipboardList, Boxes, LogOut, PlusCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Repairs from './pages/Repairs';
import Inventory from './pages/Inventory';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading FixFlow…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
function Shell() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/repairs', label: 'Repair orders', icon: ClipboardList },
    ...(user.role === 'admin' ? [{ to: '/inventory', label: 'Inventory', icon: Boxes }] : [])
  ];
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Wrench size={20}/></div><span>fixflow<span className="brand-dot">.</span></span><button className="mobile-close" onClick={() => setOpen(false)}><X/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)} className={({isActive})=>`nav-link ${isActive?'active':''}`}><Icon size={18}/>{label}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="profile"><div className="avatar">{user.name?.[0]?.toUpperCase()}</div><div className="profile-info"><b>{user.name}</b><span>{user.role}</span></div></div><button className="icon-btn logout" title="Sign out" onClick={()=>{signOut();navigate('/login')}}><LogOut size={18}/></button></div>
    </aside>
    <main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setOpen(true)}><Menu/></button><div><span className="eyebrow">SERVICE OPERATIONS</span><h2>Good work starts here.</h2></div><div className="topbar-right"><span className="online-dot"/> System online <div className="top-avatar">{user.name?.[0]?.toUpperCase()}</div></div></header><div className="page-content"><Routes><Route path="/" element={<Dashboard/>}/><Route path="/repairs" element={<Repairs/>}/><Route path="/inventory" element={user.role==='admin'?<Inventory/>:<Navigate to="/" replace/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></div></main>
  </div>;
}
export default function App() {
  const { user } = useAuth();
  return <Routes><Route path="/login" element={user?<Navigate to="/" replace/>:<Login/>}/><Route path="/*" element={<Protected><Shell/></Protected>}/></Routes>;
}
