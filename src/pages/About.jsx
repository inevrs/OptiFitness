import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

const highlights = [
  'Track daily water, meals, and workouts in one place.',
  'Stay motivated with challenges, streaks, and community goals.',
  'Build healthy habits with simple progress that feels rewarding.',
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">About OptiFitness</h1>
          <p className="text-gray-500 text-sm">A smarter way to stay active and balanced</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigate('/dashboard')}
          className="text-xs text-gray-500 hover:text-[#ff2a85] transition px-3 py-1.5 rounded-lg border border-white/10"
        >
          Back
        </motion.button>
      </div>

      <GlassCard className="p-6 space-y-4">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ background: 'rgba(255,42,133,0.12)', color: '#ff2a85' }}>
          Fitness Made Simple
        </div>

        <h2 className="text-xl font-semibold text-white">
          OptiFitness helps you turn everyday wellness into a lifestyle.
        </h2>

        <p className="text-sm leading-7 text-gray-400">
          This app is built for people who want to feel stronger, healthier, and more consistent without making fitness feel overwhelming. From tracking water and meals to logging workouts and joining challenges, OptiFitness gives you a clear view of your progress and keeps you motivated every step of the way.
        </p>
      </GlassCard>

      <div className="mt-4 space-y-3">
        {highlights.map((item) => (
          <GlassCard key={item} className="p-4 flex items-start gap-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, #ff2a85, #c084fc)' }} />
            <p className="text-sm text-gray-300">{item}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
