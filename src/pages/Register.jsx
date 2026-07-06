import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import heroBg from '../assets/workout_images/hero-bg.png';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '', username: '', password: '',
    weight_kg: '', height_cm: '', age: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register({
      full_name: form.full_name,
      username: form.username,
      password: form.password,
      weight_kg: parseFloat(form.weight_kg),
      height_cm: parseFloat(form.height_cm),
      age: parseInt(form.age),
    });
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed. Is the backend running?');
    }
  };

  return (
    <div
      className="min-h-screen text-white flex items-center justify-center p-6 relative"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 z-0" style={{ background: 'rgba(13,13,13,0.82)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm py-6"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-lime-grad">OptiFitness</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account to get started</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(24px)' }}
        >
          {error && (
            <div className="mb-4 p-3 rounded-xl text-red-300 text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Username */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'full_name', label: 'Full Name',  placeholder: 'John Doe' },
                { name: 'username',  label: 'Username',   placeholder: 'johndoe'  },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-[10px] text-gray-500 mb-1.5 font-semibold uppercase tracking-widest">{f.label}</label>
                  <input
                    type="text" name={f.name} value={form[f.name]}
                    onChange={handleChange} placeholder={f.placeholder} required
                    className="zf-input text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] text-gray-500 mb-1.5 font-semibold uppercase tracking-widest">Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required
                className="zf-input"
              />
            </div>

            {/* Weight + Height + Age */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'weight_kg', label: 'Weight (kg)', placeholder: '70'  },
                { name: 'height_cm', label: 'Height (cm)', placeholder: '175' },
                { name: 'age',       label: 'Age',         placeholder: '25'  },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-[10px] text-gray-500 mb-1.5 font-semibold uppercase tracking-widest">{f.label}</label>
                  <input
                    type="number" name={f.name} value={form[f.name]}
                    onChange={handleChange} placeholder={f.placeholder} required
                    className="zf-input text-sm px-3 py-2.5"
                  />
                </div>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full font-bold rounded-xl py-3.5 mt-2 text-black transition disabled:opacity-60"
              style={{ background: '#ff2a85' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:opacity-80 transition" style={{ color: '#ff2a85' }}>
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
