import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { apiGet } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { ProfileIcon, SquadsIcon } from '../components/Icons';

export default function Leaderboard() {
  const [view, setView]       = useState('global');
  const [leaders, setLeaders] = useState([]);
  const [mySquad, setMySquad] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (view === 'global') {
          setLeaders(await apiGet('/leaderboard/global'));
        } else {
          setLeaders(await apiGet('/leaderboard/squads'));
        }
      } catch (err) { 
        console.error(err);
        setLeaders([]); 
      }
      finally { setLoading(false); }
    };
    load();
  }, [view]);

  return (
    <div className="page">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Ranks</h1>
          <p className="text-gray-500 text-sm mt-0.5">Top athletes and squads</p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-2xl p-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {['global', 'squads'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm transition capitalize flex justify-center items-center gap-2"
              style={view === v
                ? { background: '#ff2a85', color: '#111' }
                : { color: 'rgba(255,255,255,0.35)' }}>
              {v === 'global' ? <ProfileIcon size={16} /> : <SquadsIcon size={16} />}
              {v}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading standings…</div>
        ) : leaders.length === 0 ? (
          <GlassCard className="p-8 text-center flex flex-col items-center space-y-3">
            {view === 'global' ? <ProfileIcon size={36} color="rgba(255,255,255,0.2)" /> : <SquadsIcon size={36} color="rgba(255,255,255,0.2)" />}
            <div>
              <h3 className="font-semibold">No points earned yet</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                {view === 'global' ? 'Be the first to complete a challenge!' : 'Create a squad and earn points!'}
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, i) => (
              <GlassCard key={view === 'global' ? leader.username : leader.name} className="p-4 flex items-center justify-between"
                style={i === 0 ? { borderColor: 'rgba(255,42,133,0.3)', background: 'rgba(255,42,133,0.05)' } : {}}>
                <div className="flex items-center">
                  <span className="w-8 text-center text-xl font-bold flex-shrink-0">
                    {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-gray-600 text-base">{i + 1}</span>}
                  </span>
                  
                  {/* Icon Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 ml-1 flex-shrink-0"
                       style={i === 0 ? { background: 'rgba(255,42,133,0.1)' } : {}}>
                    {view === 'global' ? (
                      <ProfileIcon size={20} color={i === 0 ? '#ff2a85' : 'rgba(255,255,255,0.4)'} />
                    ) : (
                      <SquadsIcon size={20} color={i === 0 ? '#ff2a85' : 'rgba(255,255,255,0.4)'} />
                    )}
                  </div>

                  <div className="ml-3 truncate">
                    <span className="font-semibold text-white text-sm truncate block">
                      {view === 'global' ? (leader.full_name || leader.username) : leader.name}
                    </span>
                    <p className="text-gray-600 text-[10px] truncate block">
                      {view === 'global' ? `@${leader.username}` : `${leader.member_count || 0} members`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 pl-2">
                  <span className="font-bold text-lg" style={{ color: '#ff2a85' }}>{leader.total_points || 0}</span>
                  <span className="text-gray-600 text-xs">pts</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
