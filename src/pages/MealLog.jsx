import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { apiGet, apiPost } from '../utils/api';

export default function MealLog() {
  const [meals, setMeals] = useState([]);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMeals = async () => {
    try { setMeals(await apiGet('/meal/history')); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMeals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealName || !calories) return;
    try {
      await apiPost('/meal/log', { meal_name: mealName, calories: parseInt(calories) });
      setMealName(''); setCalories('');
      fetchMeals();
    } catch (err) { console.error(err); }
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayTotal = meals
    .filter(m => new Date(m.logged_at).toISOString().slice(0, 10) === today)
    .reduce((sum, m) => sum + (m.calories || 0), 0);

  return (
    <>
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundImage: "url('src/assets/workout_images/workout-meal.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#0a0a0a',
      zIndex: -1,
    }} />

    <div className="page">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Nutrition Log</h1>
          <p className="text-white text-sm mt-0.5">Track your meals and calories</p>
        </div>

        {/* Today's calories hero */}
        <GlassCard className="p-5 flex justify-between items-center"
          style={{ background: 'rgba(255,42,133,0.06)', borderColor: 'rgba(255,42,133,0.15)' }}>
          <div>
            <p className="text-[10px] text-white uppercase tracking-widest font-semibold">Today's Calories</p>
            <h3 className="text-3xl font-bold mt-1" style={{ color: '#ff2a85' }}>
              {todayTotal} <span className="text-sm font-normal text-gray-500">kcal</span>
            </h3>
          </div>
          <span className="text-4xl">🥗</span>
        </GlassCard>

        {/* Form */}
        <GlassCard className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-white mb-1.5 font-semibold uppercase tracking-widest">Meal / Food Name</label>
              <input type="text" value={mealName} onChange={e => setMealName(e.target.value)}
                placeholder="Avocado Toast, Oatmeal…" required className="zf-input" />
            </div>
            <div>
              <label className="block text-[10px] text-white mb-1.5 font-semibold uppercase tracking-widest">Calories (kcal)</label>
              <input type="number" value={calories} onChange={e => setCalories(e.target.value)}
                placeholder="350" required className="zf-input" />
            </div>
            <motion.button whileTap={{ scale: 0.96 }} type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-black mt-1"
              style={{ background: '#ff2a85' }}>
              Log Meal
            </motion.button>
          </form>
        </GlassCard>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading meals…</div>
        ) : meals.length === 0 ? (
          <GlassCard className="p-8 text-center flex flex-col items-center space-y-3">
            <span className="text-3xl">🍲</span>
            <div>
              <h3 className="font-semibold">No meals logged yet</h3>
              <p className="text-gray-500 text-sm mt-0.5">Your nutrition log will appear here.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] text-white font-bold uppercase tracking-widest pl-1">Recent Meals</p>
            {meals.map(meal => (
              <GlassCard key={meal.id} className="p-4 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-white">{meal.meal_name}</span>
                  <p className="text-whitetext-xs mt-0.5">
                    {new Date(meal.logged_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <span className="font-semibold text-sm" style={{ color: '#ff2a85' }}>{meal.calories} kcal</span>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
