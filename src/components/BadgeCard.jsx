import React from 'react';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';

const getBadgeIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('streak') || n.includes('fire') || n.includes('warrior')) return '🔥';
  if (n.includes('points') || n.includes('century') || n.includes('master') || n.includes('elite') || n.includes('started')) return '👑';
  if (n.includes('first') || n.includes('steps')) return '🏃';
  return '🏅';
};

const BadgeCard = ({ badge }) => {
  const isUnlocked = badge.unlocked;

  return (
    <GlassCard 
      className={`flex flex-col items-center justify-center text-center p-4 transition-all duration-300 ${
        !isUnlocked ? 'opacity-40 grayscale border-white/5' : 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5'
      }`}
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-4xl mb-2.5 drop-shadow-md"
      >
        {getBadgeIcon(badge.name)}
      </motion.div>
      <h3 className="text-sm font-bold text-white truncate w-full">{badge.name}</h3>
      <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{badge.description}</p>
      
      {!isUnlocked && (
        <span className="text-[9px] text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full mt-2 uppercase tracking-wider">
          Locked
        </span>
      )}
    </GlassCard>
  );
};

export default BadgeCard;
