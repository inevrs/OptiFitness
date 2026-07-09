import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import ProgressRing from '../components/ProgressRing';
import { AuthContext } from '../context/AuthContext';
import { apiGet } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { DumbbellIcon, MealIcon, ScaleIcon, BadgeIcon, FlameIcon, StarIcon, LightningIcon, WaterIcon, FeedIcon, ChevronRight, CheckCircleIcon } from '../components/Icons';
import bgStrength from '../assets/workout_images/workout-strength.jpg';

const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const item = {
  hidden:  { y: 22, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } }
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [water, setWater]  = useState({ count: 0, goal: 8 });
  const [points, setPoints] = useState({ total_points: 0, current_streak: 0 });

  const loadData = async () => {
    try {
      const [w, profile] = await Promise.all([
        apiGet('/water/today'),
        apiGet('/profile')
      ]);
      setWater(w);
      setPoints({
        total_points: profile.total_points || 0,
        current_streak: profile.current_streak || 0
      });
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, user?.total_points, user?.current_streak]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const waterPct = Math.min((water.count / water.goal) * 100, 100);

return (
  <>
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundImage: `url(${bgStrength})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#0a0a0a',
      zIndex: -1,
    }} />
  
    <div className="page">
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">

        {/* Header */}
        <motion.div variants={item}>
          <p className="text-white text-sm">{today}</p>
          <h1 className="text-2xl font-bold mt-0.5">
            {greeting()},{' '}
            <span className="text-lime-grad">{user?.full_name?.split(' ')[0] || user?.username || 'Athlete'}</span> 👋
          </h1>
        </motion.div>

        {/* Streak + Points */}
        <motion.div variants={item} className="grid grid-cols-2 gap-4">
          <GlassCard className="p-5 text-center glow-lime">
            <p className="text-white text-[10px] uppercase tracking-widest mb-2 font-semibold">Streak</p>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <FlameIcon size={26} color="#ff2a85" strokeWidth={2} />
              <p className="text-3xl font-bold" style={{ color: '#ff2a85' }}>{points.current_streak}</p>
            </div>
            <p className="text-white text-[10px]">days</p>
          </GlassCard>
          <GlassCard className="p-5 text-center glow-purple">
            <p className="text-white text-[10px] uppercase tracking-widest mb-2 font-semibold">Points</p>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <StarIcon size={22} color="#c084fc" strokeWidth={2} />
              <p className="text-3xl font-bold" style={{ color: '#c084fc' }}>{points.total_points}</p>
            </div>
            <p className="text-white text-[10px]">earned</p>
          </GlassCard>
        </motion.div>

        {/* Water Card */}
        <motion.div variants={item}>
          <GlassCard
            className="p-5 flex items-center justify-between cursor-pointer"
            onClick={() => navigate('/water')}
          >
            <div className="flex-1 pr-4">
              <p className="text-[10px] text-white uppercase tracking-widest mb-1 font-semibold">Hydration</p>
              <h3 className="text-xl font-bold text-white">{water.count} / {water.goal} glasses</h3>
              <p className="text-white text-sm mt-1 flex items-center gap-1.5">
                {water.count >= water.goal ? (
                  <><CheckCircleIcon size={16} color="#4ade80" /> Goal reached!</>
                ) : `${water.goal - water.count} more to go`}
              </p>
            </div>
            {/* Color matched to theme (Pastel Purple c084fc) */}
            <ProgressRing
              progress={waterPct}
              size={68}
              strokeWidth={6}
              color="#c084fc"
              hidePercentText={true}
            />
          </GlassCard>
        </motion.div>

        {/* Today's Workout Banner */}
        <motion.div variants={item}>
          <GlassCard
            className="p-5 flex items-center justify-between cursor-pointer overflow-hidden relative border-purple-500/20"
            onClick={() => navigate('/challenges')}
            style={{ background: 'rgba(192,132,252,0.03)' }}
          >
            {/* Accent blob */}
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-15 blur-xl"
              style={{ background: '#c084fc' }} />
            <div className="relative z-10">
              <p className="text-[10px] text-white uppercase tracking-widest mb-1 font-semibold">Daily Challenges</p>
              <h3 className="text-lg font-bold text-white">Daily Workout</h3>
              <p className="text-white text-sm mt-0.5">Tap to start your tasks</p>
            </div>
            <div className="relative z-10">
              <LightningIcon size={36} color="#c084fc" strokeWidth={1.5} />
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <p className="text-white text-[10px] uppercase tracking-widest mb-3 pl-1 font-semibold">Quick Access</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Exercise', Icon: DumbbellIcon, path: '/exercise' },
              { label: 'Meals',    Icon: MealIcon,     path: '/meals'    },
              { label: 'Ranks',    Icon: StarIcon,     path: '/leaderboard' },
              { label: 'Badges',   Icon: BadgeIcon,    path: '/badges'   },
            ].map(a => (
              <motion.div
                key={a.path}
                whileTap={{ scale: 0.91 }}
                onClick={() => navigate(a.path)}
                className="flex flex-col items-center gap-2 py-3.5 rounded-2xl cursor-pointer border border-white/8 hover:bg-white/5 transition"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <a.Icon size={22} color="rgba(255,255,255,0.55)" strokeWidth={1.7} />
                <span className="text-[9px] text-gray-500 font-semibold">{a.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social teaser */}
        <motion.div variants={item}>
          <GlassCard
            className="p-5 flex items-center justify-between cursor-pointer"
            onClick={() => navigate('/feed')}
          >
            <div>
              <p className="text-[10px] text-white uppercase tracking-widest mb-1 font-semibold">Community Feed</p>
              <h3 className="text-base font-semibold text-white">See what's happening</h3>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,0.25)" />
          </GlassCard>
        </motion.div>

      </motion.div>
    </div>
  </>
  );
}