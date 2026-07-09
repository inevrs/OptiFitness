import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import { apiGet, apiPost, apiDelete } from '../utils/api';
import { bridge } from '../utils/appInventorBridge';
import { AuthContext } from '../context/AuthContext';
import bgSquad from '../assets/workout_images/workout-squad.jpg';

export default function SquadPage() {
  const [mySquadData, setMySquadData] = useState(null); // { squad: {}, members: [] } or null
  const [allSquads, setAllSquads] = useState([]);
  const [newSquadName, setNewSquadName] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const isLeader = mySquadData?.squad?.created_by === user?.id;

  const fetchData = async () => {
    try {
      setLoading(true);
      const mySquad = await apiGet('/squads/my-squad');
      setMySquadData(mySquad);

      if (!mySquad) {
        // If not in a squad, fetch all available squads they can join
        const squadsList = await apiGet('/squads');
        setAllSquads(squadsList);
      }
    } catch (err) {
      console.error('Failed to fetch squad data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSquad = async (e) => {
    e.preventDefault();
    if (!newSquadName.trim()) return;
    try {
      await apiPost('/squads', { name: newSquadName });
      bridge.speak(`You successfully created the squad: ${newSquadName}`);
      setNewSquadName('');
      fetchData();
    } catch (err) {
      console.error('Failed to create squad:', err);
    }
  };

  const handleJoinSquad = async (squadId, name) => {
    try {
      await apiPost(`/squads/${squadId}/join`);
      bridge.playSound('squad_join');
      bridge.notify(`You joined ${name}! 🏆`);
      bridge.speak(`Welcome to ${name}!`);
      fetchData();
    } catch (err) {
      console.error('Failed to join squad:', err);
    }
  };

  const handleLeaveSquad = async () => {
    if (!mySquadData) return;
    try {
      await apiPost(`/squads/${mySquadData.squad.id}/leave`);
      bridge.speak('You left your squad');
      fetchData();
    } catch (err) {
      console.error('Failed to leave squad:', err);
    }
  };

  const handleDeleteSquad = async () => {
  if (!mySquadData) return;
  const confirmed = window.confirm(`Delete "${mySquadData.squad.name}"? This can't be undone.`);
  if (!confirmed) return;
  try {
    await apiDelete(`/squads/${mySquadData.squad.id}`);
    bridge.speak('Squad deleted');
    fetchData();
  } catch (err) {
    console.error('Failed to delete squad:', err);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center">
        <span className="text-gray-500">Loading squad details...</span>
      </div>
    );
  }

  return (
    <>
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundImage: `url(${bgSquad})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#0a0a0a',
      zIndex: -1,
    }} />
    <div className="page">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Squads</h1>
          <p className="text-gray-400 text-sm mt-0.5">Train together, achieve together</p>
        </div>

        {mySquadData ? (
          /* Active Squad View */
          <div className="space-y-6">
            <GlassCard className="p-6 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">My Active Squad</span>
                  <h2 className="text-2xl font-bold text-white mt-1.5">{mySquadData.squad.name}</h2>
                </div>
                <span className="text-3xl">👥</span>
              </div>
            </GlassCard>

            {/* Member List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs text-gray-400 uppercase tracking-widest pl-1">Squad Members</p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/leaderboard'}
                  className="text-xs font-semibold px-3 py-1 rounded-full text-emerald-400 bg-emerald-500/10"
                >
                  View Leaderboard
                </motion.button>
              </div>
              {mySquadData.members.map((member, i) => (
                <GlassCard key={member.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-sm">
                      {member.username[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-white">{member.full_name || member.username}</span>
                  </div>
                  {member.id === mySquadData.squad.created_by && (
                    <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">Leader</span>
                  )}
                </GlassCard>
              ))}
            </div>

            {/* Leave button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleLeaveSquad}
              className="w-full py-3.5 bg-red-500/40 hover:bg-red-500/20 border border-red-500/20 text-white rounded-2xl font-semibold transition"
            >
              Leave Squad
            </motion.button>

            {isLeader && (
            <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleDeleteSquad}
            className="w-full py-3.5 bg-red-500/40 hover:bg-red-600/30 border border-red-600/40 text-white rounded-2xl font-semibold transition"
         >
            Delete Squad
          </motion.button>
            )}
          </div>
        ) : (
          /* Not in Squad View */
          <div className="space-y-6">
            {/* Create Squad Card */}
            <GlassCard className="p-6">
              <h3 className="font-semibold text-lg mb-3">Create a Squad</h3>
              <form onSubmit={handleCreateSquad} className="flex gap-2">
                <input 
                  type="text" 
                  value={newSquadName} 
                  onChange={e => setNewSquadName(e.target.value)} 
                  placeholder="e.g. Zen Warriors" 
                  required
                  className="zf-input flex-1" 
                />
                <motion.button 
                  whileTap={{ scale: 0.96 }} 
                  type="submit"
                  className="px-6 py-3 font-bold rounded-xl text-black transition whitespace-nowrap"
                  style={{ background: '#ff2a85' }}
                >
                  Create
                </motion.button>
              </form>
            </GlassCard>

            {/* List of squads they can join */}
            <div className="space-y-3">
              <p className="text-xs text-gray-400 uppercase tracking-widest pl-1">Join a Squad</p>
              {allSquads.length === 0 ? (
                <GlassCard className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                  <span className="text-3xl">🛡️</span>
                  <div>
                    <h3 className="font-semibold text-base text-gray-250">No squads found</h3>
                    <p className="text-gray-400 text-sm mt-0.5">No squads have been created yet. Be the leader and create the first squad!</p>
                  </div>
                </GlassCard>
              ) : (
                allSquads.map(s => (
                  <GlassCard key={s.id} className="p-5 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-base text-white">{s.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{s.member_count || 0} members</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleJoinSquad(s.id, s.name)}
                      className="px-4 py-2 bg-white/10 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-semibold text-emerald-400 transition"
                    >
                      Join
                    </motion.button>
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
