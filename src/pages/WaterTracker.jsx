import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressRing from '../components/ProgressRing';
import GlassCard from '../components/GlassCard';
import { apiGet, apiPost, apiDelete } from '../utils/api';
import { bridge } from '../utils/appInventorBridge';
import { BadgeToastContext } from '../context/BadgeToastContext';

export default function WaterTracker() {
  const { showBadge } = useContext(BadgeToastContext);
  const [glasses, setGlasses] = useState(0);
  const [goal, setGoal] = useState(8);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false); // spam guard
  const progress = Math.min((glasses / goal) * 100, 100);

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  const goalReached = glasses >= goal;

  const fetchWater = async () => {
    try {
      const data = await apiGet('/water/today');
      setGlasses(data.count || 0);
      setGoal(data.goal || 8);
      setEntries(data.entries || []);
    } catch (err) { /* offline fallback */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWater(); }, []);

  const addGlass = async () => {
    if (isAdding) return; // prevent spam
    setIsAdding(true);
    try {
      const res = await apiPost('/water/log', {});
      
      if (res.newlyUnlocked && res.newlyUnlocked.length > 0) {
        bridge.playSound('badge_unlock');
        bridge.vibrateBadge();
        res.newlyUnlocked.forEach(b => {
          showBadge(b);
          bridge.notify(`Unlocked Badge: ${b.name}! 🏅`);
        });
      } else {
        bridge.playSound('water_drop');
      }

      await fetchWater();
      const next = glasses + 1;
      if (next >= goal) {
        bridge.speak('Amazing! You hit your water goal for today!');
      }
    } catch (err) { console.error(err); }
    finally { setIsAdding(false); }
  };

  const undo = async () => {
    try {
      await apiDelete('/water/log/latest');
      fetchWater();
    } catch { fetchWater(); }
  };

  const reset = async () => {
    try {
      await apiPost('/water/reset', {});
      fetchWater();
    } catch { fetchWater(); }
  };



  return (
  <>
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundImage: "url('src/assets/workout_images/workout-water.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#0a0a0a',
      zIndex: -1,
    }} />

    <div className="page">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Hydration</h1>
          <p className="text-white text-sm mt-0.5">Stay hydrated throughout the day</p>
        </div>

        {/* Ring card */}
        <GlassCard className="p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <ProgressRing
              progress={progress} size={180} strokeWidth={13}
              color={goalReached ? '#ff2a85' : '#60a5fa'}
              hidePercentText={true}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={glasses}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-bold"
                >
                  {glasses}
                </motion.span>
              </AnimatePresence>
              <span className="text-white text-sm">of {goal} glasses</span>
            </div>
          </div>
          {goalReached && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-semibold text-sm" style={{ color: '#ff2a85' }}>
              🎉 Daily goal reached!
            </motion.p>
          )}
        </GlassCard>

        {/* Segment bar */}
        <div className="flex gap-1.5">
          {Array.from({ length: goal }).map((_, i) => (
            <motion.div key={i} animate={{ scaleY: i < glasses ? 1.3 : 1 }}
              className="flex-1 h-2.5 rounded-full transition-all duration-300"
              style={{ background: i < glasses ? '#60a5fa' : 'rgba(255,255,255,0.08)' }}
            />
          ))}
        </div>

        {/* Add button */}
        <motion.button
          whileTap={isAdding ? {} : { scale: 0.96 }}
          onClick={addGlass}
          disabled={isAdding}
          className="w-full py-5 rounded-2xl font-bold text-xl shadow-lg transition"
          style={{
            background: isAdding ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #60a5fa, #818cf8)',
            color: isAdding ? 'rgba(255,255,255,0.3)' : '#fff',
            cursor: isAdding ? 'not-allowed' : 'pointer',
          }}>
          {isAdding ? 'Logging...' : '💧 + 1 Glass'}
        </motion.button>

        {/* Undo / Reset */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button whileTap={{ scale: 0.96 }} onClick={undo}
            className="py-3.5 rounded-2xl font-medium transition border"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)', color: '#d1d5db' }}>
            ↩ Undo
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={reset}
            className="py-3.5 rounded-2xl font-medium transition"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            Reset Day
          </motion.button>
        </div>

        {/* Log list */}
        {entries.length > 0 && (
          <GlassCard className="p-5">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 font-semibold">Today's Log</p>
            <div className="space-y-2">
              {entries.map((entry, i) => (
                <div key={entry.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-gray-300 text-sm">💧 Glass {i + 1}</span>
                  <span className="text-xs font-medium" style={{ color: '#ff2a85' }}>
                    {formatTime(entry.logged_at)}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
    </>
  );
}
