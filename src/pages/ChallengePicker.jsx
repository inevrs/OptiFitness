import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { apiGet, apiPost } from '../utils/api';
import { bridge } from '../utils/appInventorBridge';
import { BadgeToastContext } from '../context/BadgeToastContext';

import cardioImg from '../assets/workout_images/workout-cardio.jpg';
import stretchImg from '../assets/workout_images/workout-stretch.jpg';
import yogaImg from '../assets/workout_images/workout-yoga.jpg';

const getWorkoutImage = (title) => {
  const t = title.toLowerCase();
  if (t.includes('stretch') || t.includes('wall sit') || t.includes('calf') || t.includes('superman')) return stretchImg;
  if (t.includes('yoga') || t.includes('plank') || t.includes('sit-up') || t.includes('stretch')) return yogaImg;
  return cardioImg; // Default for cardio workouts (burpees, jacks, run, etc.)
};

export default function ChallengePicker() {
  const { showBadge } = useContext(BadgeToastContext);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const fetchChallenges = async () => {
    try {
      const data = await apiGet('/challenges/today');
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load today\'s challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const completeChallenge = async (id, title) => {
    try {
      const res = await apiPost(`/challenges/${id}/complete`);
      if (res.newly_unlocked_badges && res.newly_unlocked_badges.length > 0) {
        bridge.playSound('badge_unlock');
        bridge.vibrateBadge();
        res.newly_unlocked_badges.forEach(b => {
          showBadge(b);
          bridge.notify(`Unlocked Badge: ${b.name}! 🏅`);
        });
        const badgeNames = res.newly_unlocked_badges.map(b => b.name).join(', ');
        bridge.speak(`Congratulations! You unlocked the badge: ${badgeNames}!`);
      } else {
        bridge.playSound('success_chime');
        bridge.speak(`Awesome job completing ${title}!`);
      }
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      fetchChallenges();
    } catch (err) {
      console.error('Failed to complete challenge:', err);
    }
  };

  return (
    <div className="page relative overflow-hidden">
      {/* Celebration gif */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="w-full h-full bg-[url('https://cdn.jsdelivr.net/gh/catdad/canvas-confetti/confetti.gif')] bg-cover opacity-60" />
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Daily Challenges</h1>
          <p className="text-gray-400 text-sm mt-0.5">Complete tasks to earn points and keep streaks</p>
        </div>
 
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading daily tasks...</div>
        ) : challenges.length === 0 ? (
          <GlassCard className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h3 className="font-semibold text-lg">All caught up!</h3>
              <p className="text-gray-400 text-sm mt-0.5">No challenges available today. Check back tomorrow!</p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {challenges.map(challenge => {
              const isCompleted = challenge.completed;
              return (
                <div key={challenge.id} className="relative rounded-2xl overflow-hidden shadow-lg border border-white/10">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getWorkoutImage(challenge.title)})` }}
                  >
                    <div className="absolute inset-0 bg-gray-950/70" />
                  </div>
                  
                  {/* Card overlay */}
                  <GlassCard className="relative z-10 p-5 flex justify-between items-center bg-transparent border-0">
                    <div className="pr-4">
                      <h3 className="font-bold text-lg text-white drop-shadow-md">{challenge.title}</h3>
                      <p className="text-xs text-gray-300 mt-1 line-clamp-2">{challenge.description}</p>
                      <p className="text-xs text-emerald-400 font-semibold mt-2 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                        +{challenge.points || 10} pts
                      </p>
                    </div>
                    
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => completeChallenge(challenge.id, challenge.title)}
                      disabled={isCompleted}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition whitespace-nowrap ${
                        isCompleted 
                          ? 'bg-white/10 text-gray-400 border border-white/5' 
                          : 'text-black'
                      }`}
                      style={!isCompleted ? { background: '#ff2a85' } : {}}
                    >
                      {isCompleted ? 'Done ✓' : 'Complete'}
                    </motion.button>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
