import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { apiGet, apiPost, apiDelete } from '../utils/api';
import { bridge } from '../utils/appInventorBridge';

const exerciseTypes = [
  { value: 'Running',      label: '🏃 Running'      },
  { value: 'Walking',      label: '🚶 Walking'       },
  { value: 'Weightlifting',label: '🏋️ Weightlifting' },
  { value: 'Yoga',         label: '🧘 Yoga'          },
  { value: 'Cycling',      label: '🚴 Cycling'       },
  { value: 'Swimming',     label: '🏊 Swimming'      },
  { value: 'Other',        label: '💪 Other Workout' },
];

export default function ExerciseLog() {
  const [logs, setLogs] = useState([]);
  const [exercise, setExercise] = useState('Running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const fetchHistory = async () => {
    try { setLogs(await apiGet('/exercise/history')); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
  fetchHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exercise || !duration) return;
    try {
      await apiPost('/exercise/log', {
        activity_type: exercise,
        duration_minutes: parseInt(duration),
        calories_burned: calories ? parseInt(calories) : Math.round(parseInt(duration) * 8),

      });
      bridge.notify('Workout logged! 💪');
      setDuration(''); setCalories('');
      fetchHistory();
    } catch (err) { console.error(err); }
  };

  return (
    <>
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundImage: "url('src/assets/workout_images/hero-bg.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#0a0a0a',
      zIndex: -1,
    }} />

    <div className="page">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Exercise Log</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track your workouts and stay consistent</p>
        </div>

        <GlassCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-500 mb-1.5 font-semibold uppercase tracking-widest">Activity Type</label>
              <select value={exercise} onChange={e => setExercise(e.target.value)} className="zf-input">
                {exerciseTypes.map(t => (
                  <option key={t.value} value={t.value} className="bg-[#111]">{t.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1.5 font-semibold uppercase tracking-widest">Duration (mins)</label>
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)}
                  placeholder="30" required className="zf-input" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1.5 font-semibold uppercase tracking-widest">Calories</label>
                <input type="number" value={calories} onChange={e => setCalories(e.target.value)}
                  placeholder="optional" className="zf-input" />
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.96 }} type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-black mt-1"
              style={{ background: '#ff2a85' }}>
              Log Exercise
            </motion.button>
          </form>
        </GlassCard>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading workouts...</div>
        ) : logs.length === 0 ? (
          <GlassCard className="p-8 text-center flex flex-col items-center space-y-3">
            <span className="text-3xl">🏋️</span>
            <div>
              <h3 className="font-semibold">No exercises logged yet</h3>
              <p className="text-gray-500 text-sm mt-0.5">Time to get moving! Your records will appear here.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">Recent Activity (Tap to expand)</p>
            {logs.map(log => {
              const isExpanded = expandedLogId === log.id;
              return (
                <GlassCard
                  key={log.id}
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors relative overflow-hidden"
                >
                  {/* Summary Row */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {exerciseTypes.find(t => t.value === log.activity_type)?.label || `💪 ${log.activity_type}`}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs mt-0.5">
                        {new Date(log.logged_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-semibold block">{log.duration_minutes} mins</span>
                      {log.calories_burned && (
                        <span className="text-xs" style={{ color: '#ff2a85' }}>{log.calories_burned} kcal</span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content Section */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/5 space-y-4"
                      onClick={(e) => e.stopPropagation()} // stop collapsing on modal click
                    >
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                          Log ID: #{log.id}
                        </span>
                        
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this workout log?')) {
                              try {
                                await apiDelete(`/exercise/${log.id}`);
                                bridge.notify('Workout log deleted! 🗑️');
                                fetchHistory();
                              } catch (err) {
                                console.error('Failed to delete log:', err);
                              }
                            }
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/20 px-3 py-1.5 rounded-lg transition"
                        >
                          Delete Log
                        </button>
                      </div>
                    </motion.div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
