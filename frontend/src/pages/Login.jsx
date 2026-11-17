import { useState } from 'react';
import { Wrench, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { signIn, register } = useAuth();
  const [mode,setMode]=useState('login');
  const [form,setForm]=useState({name:'',email:'',password:''});
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const navigate=useNavigate();
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){
    e.preventDefault();setError('');setBusy(true);
    try { if(mode==='login') await signIn(form.email,form.password); else await register(form); navigate('/'); }
    catch(err){setError(err.response?.data?.message || 'Could not connect. Check that the API is running.');}
    finally{setBusy(false);}
  }
  return <div className="auth-page"><div className="auth-visual"><div className="auth-brand"><div className="brand-mark"><Wrench/></div>fixflow<span className="brand-dot">.</span></div><div className="visual-copy"><div className="pill"><span className="online-dot"/> SERVICE DESK, REIMAGINED</div><h1>Every repair.<br/><em>Under control.</em></h1><p>One clear workspace for your team, your customers and every device that needs a little care.</p><div className="visual-stats"><div><b>01</b><span>Track every job</span></div><div><b>02</b><span>Manage your team</span></div><div><b>03</b><span>Grow with insight</span></div></div></div><div className="auth-foot">BUILT FOR BETTER SERVICE OPERATIONS</div></div><div className="auth-form-wrap"><form className="auth-card" onSubmit={submit}><div className="form-icon"><ShieldCheck/></div><span className="eyebrow">WELCOME TO FIXFLOW</span><h2>{mode==='login'?'Sign in to your workspace':'Create your account'}</h2><p className="muted">{mode==='login'?'Enter your details to continue.':'Start by creating a customer account.'}</p>{mode==='register'&&<label>Full name<input name="name" value={form.name} onChange={change} placeholder="Your name" required/></label>}<label>Email address<input type="email" name="email" value={form.email} onChange={change} placeholder="you@example.com" required/></label><label>Password<input type="password" name="password" value={form.password} onChange={change} placeholder="At least 8 characters" minLength="8" required/></label>{error&&<div className="error-box">{error}</div>}<button className="primary-btn full" disabled={busy}>{busy?'Please wait…':mode==='login'?'Sign in':'Create account'} <ArrowRight size={17}/></button><p className="switch-auth">{mode==='login'?"New to FixFlow?":"Already have an account?"} <button type="button" onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}}>{mode==='login'?'Create account':'Sign in'}</button></p><div className="demo-box"><b>Demo access</b><span>Admin: admin@fixflow.demo / Admin123!</span><span>Tech: tech@fixflow.demo / Tech123!</span><span>Customer: customer@fixflow.demo / Customer123!</span></div></form></div></div>;
}
