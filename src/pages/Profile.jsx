import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { apiGet, apiPut } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const fetchWrapper = async (endpoint, options = {}) => {
  const token = localStorage.getItem('zf_token');
  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Biometric state
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({ full_name: '', weight_kg: '', height_cm: '', age: '' });

  // Security state
  const [securityOpen, setSecurityOpen] = useState(false);
  const [secTab, setSecTab] = useState('username'); // 'username' | 'password'
  const [usernameForm, setUsernameForm] = useState({ new_username: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [secSaving, setSecSaving] = useState(false);
  const [secMsg, setSecMsg] = useState({ text: '', ok: true });

  // General success
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProfile = async () => {
    try {
      const data = await apiGet('/profile');
      setForm({ full_name: data.full_name || '', weight_kg: data.weight_kg || '', height_cm: data.height_cm || '', age: data.age || '' });
      const bmi = data.weight_kg && data.height_cm
        ? (data.weight_kg / ((data.height_cm / 100) ** 2)).toFixed(1)
        : null;
      setStats({ ...data, bmi });
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPut('/profile', {
        full_name: form.full_name,
        weight_kg: parseFloat(form.weight_kg) || null,
        height_cm: parseFloat(form.height_cm) || null,
        age: parseInt(form.age) || null,
      });
      setSuccessMsg('Biometrics updated!');
      setTimeout(() => setSuccessMsg(''), 2500);
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    setSecSaving(true);
    setSecMsg({ text: '', ok: true });
    try {
      await fetchWrapper('/auth/username', { method: 'PUT', body: JSON.stringify(usernameForm) });
      setSecMsg({ text: '✓ Username updated! Please log in again.', ok: true });
      setUsernameForm({ new_username: '', password: '' });
      setTimeout(() => { logout(); navigate('/login'); }, 2000);
    } catch (err) {
      setSecMsg({ text: err.message, ok: false });
    } finally {
      setSecSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setSecMsg({ text: 'Passwords do not match', ok: false });
      return;
    }
    setSecSaving(true);
    setSecMsg({ text: '', ok: true });
    try {
      await fetchWrapper('/auth/password', { method: 'PUT', body: JSON.stringify({ current_password: passwordForm.current_password, new_password: passwordForm.new_password }) });
      setSecMsg({ text: '✓ Password updated successfully!', ok: true });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setSecMsg({ text: err.message, ok: false });
    } finally {
      setSecSaving(false);
    }
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { label: 'N/A', color: 'text-gray-400' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-purple-400' };
    if (bmi < 25)   return { label: 'Normal ✓',    color: 'text-[#ff2a85]' };
    if (bmi < 30)   return { label: 'Overweight',  color: 'text-purple-400' };
    return           { label: 'Obese',             color: 'text-purple-300' };
  };

  const bmiCat = getBMICategory(stats?.bmi);

  return (
    <>
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#0a0a0a',
      zIndex: -1,
    }} />

    <div className="page">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-500 text-sm">Your health identity</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => { logout(); navigate('/login'); }}
          className="text-xs text-gray-500 hover:text-red-400 transition px-3 py-1.5 rounded-lg border border-white/10"
        >
          Sign out
        </motion.button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading profile...</div>
      ) : (
        <div className="space-y-5">

          {/* Avatar & Name */}
          <GlassCard className="p-6 flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #ff2a85, #c084fc)' }}
            >
              {form.full_name ? form.full_name[0].toUpperCase() : user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{form.full_name || user?.username}</h2>
              <p className="text-gray-500 text-sm">@{user?.username}</p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: 'rgba(255,42,133,0.1)', color: '#ff2a85' }}>
                OptiFitness Member
              </span>
            </div>
          </GlassCard>

          {/* BMI Overview */}
          {stats?.bmi && (
            <GlassCard className="p-5 grid grid-cols-3 divide-x divide-white/10 text-center">
              {[
                { label: 'BMI',    value: stats.bmi,                          sub: bmiCat.label,  color: bmiCat.color },
                { label: 'Weight', value: form.weight_kg ? `${form.weight_kg}` : '—', sub: 'kg', color: 'text-[#c084fc]' },
                { label: 'Height', value: form.height_cm ? `${form.height_cm}` : '—', sub: 'cm', color: 'text-[#ff2a85]' },
              ].map(s => (
                <div key={s.label} className="px-2 flex flex-col items-center">
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1 font-semibold">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </GlassCard>
          )}


          {/* Success Message */}
          <AnimatePresence>
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-center text-sm font-semibold text-[#ff2a85] py-2">
                ✓ {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Biometric Info ────────────────────────── */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-base text-white">Biometric Info</h3>
              {!editing && (
                <motion.button whileTap={{ scale: 0.94 }} onClick={() => setEditing(true)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,42,133,0.12)', color: '#ff2a85' }}>
                  Edit
                </motion.button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">Full Name</label>
                  <input type="text" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="zf-input" placeholder="Your Name" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'weight_kg', label: 'Weight (kg)', placeholder: '70' },
                    { key: 'height_cm', label: 'Height (cm)', placeholder: '175' },
                    { key: 'age',       label: 'Age',         placeholder: '25' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">{f.label}</label>
                      <input type="number" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="zf-input text-sm px-3 py-2.5" placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-1">
                  <motion.button whileTap={{ scale: 0.96 }} type="submit" disabled={saving}
                    className="flex-1 py-3 rounded-xl font-bold text-black transition disabled:opacity-60"
                    style={{ background: '#ff2a85' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.96 }} type="button" onClick={() => setEditing(false)}
                    className="px-5 py-3 rounded-xl font-semibold text-gray-400 border border-white/10 hover:bg-white/5 transition">
                    Cancel
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: form.full_name || '—' },
                  { label: 'Weight',    value: form.weight_kg ? `${form.weight_kg} kg` : '—' },
                  { label: 'Height',    value: form.height_cm ? `${form.height_cm} cm` : '—' },
                  { label: 'Age',       value: form.age       ? `${form.age} years`    : '—' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-500 text-sm">{r.label}</span>
                    <span className="text-white font-medium text-sm">{r.value}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* ── Security Settings ─────────────────────── */}
          <GlassCard className="p-6">
            <button className="w-full flex justify-between items-center" onClick={() => { setSecurityOpen(o => !o); setSecMsg({ text: '', ok: true }); }}>
              <h3 className="font-semibold text-base text-white">Security Settings</h3>
              <span className="text-gray-500 text-lg">{securityOpen ? '−' : '+'}</span>
            </button>

            <AnimatePresence>
              {securityOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="pt-5 space-y-4">

                    {/* Tab switcher */}
                    <div className="flex rounded-xl overflow-hidden border border-white/10">
                      {['username', 'password'].map(tab => (
                        <button key={tab} onClick={() => { setSecTab(tab); setSecMsg({ text: '', ok: true }); }}
                          className="flex-1 py-2.5 text-xs font-bold capitalize transition"
                          style={{ background: secTab === tab ? '#ff2a85' : 'transparent', color: secTab === tab ? '#000' : 'rgba(255,255,255,0.4)' }}>
                          Change {tab}
                        </button>
                      ))}
                    </div>

                    {/* Status message */}
                    <AnimatePresence>
                      {secMsg.text && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className={`text-xs font-semibold text-center py-1.5 rounded-lg px-3 ${secMsg.ok ? 'text-[#ff2a85] bg-pink-500/10' : 'text-red-400 bg-red-500/10'}`}>
                          {secMsg.text}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Change Username */}
                    {secTab === 'username' && (
                      <form onSubmit={handleUsernameChange} className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">New Username</label>
                          <input type="text" value={usernameForm.new_username}
                            onChange={e => setUsernameForm({ ...usernameForm, new_username: e.target.value })}
                            className="zf-input" placeholder="new_username" required />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">Current Password (to confirm)</label>
                          <input type="password" value={usernameForm.password}
                            onChange={e => setUsernameForm({ ...usernameForm, password: e.target.value })}
                            className="zf-input" placeholder="••••••••" required />
                        </div>
                        <motion.button whileTap={{ scale: 0.96 }} type="submit" disabled={secSaving}
                          className="w-full py-3 rounded-xl font-bold text-black disabled:opacity-60"
                          style={{ background: '#c084fc' }}>
                          {secSaving ? 'Updating...' : 'Update Username'}
                        </motion.button>
                      </form>
                    )}

                    {/* Change Password */}
                    {secTab === 'password' && (
                      <form onSubmit={handlePasswordChange} className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widests mb-1.5 font-semibold">Current Password</label>
                          <input type="password" value={passwordForm.current_password}
                            onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                            className="zf-input" placeholder="••••••••" required />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">New Password</label>
                          <input type="password" value={passwordForm.new_password}
                            onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                            className="zf-input" placeholder="min. 6 characters" required />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">Confirm New Password</label>
                          <input type="password" value={passwordForm.confirm_password}
                            onChange={e => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                            className="zf-input" placeholder="••••••••" required />
                        </div>
                        <motion.button whileTap={{ scale: 0.96 }} type="submit" disabled={secSaving}
                          className="w-full py-3 rounded-xl font-bold text-black disabled:opacity-60"
                          style={{ background: '#c084fc' }}>
                          {secSaving ? 'Updating...' : 'Update Password'}
                        </motion.button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* Quick links */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'My Badges',     icon: '🏅', path: '/badges', color: '#c084fc' },
              { label: 'My Squad',      icon: '👥', path: '/squad',  color: '#ff2a85' },
              { label: 'Leaderboard',   icon: '🏆', path: '/leaderboard', color: '#c084fc' },
              { label: 'Water Tracker', icon: '💧', path: '/water',  color: '#ff2a85' },
            ].map(q => (
              <motion.button key={q.path} whileTap={{ scale: 0.95 }} onClick={() => navigate(q.path)}
                className="flex items-center space-x-3 p-4 rounded-2xl border border-white/8 text-left hover:bg-white/5 transition"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="text-xl">{q.icon}</span>
                <span className="text-sm font-semibold text-white">{q.label}</span>
              </motion.button>
            ))}
          </div>

        </div>
      )}
    </div>
    </>
  );
}
