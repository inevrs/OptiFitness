import React, { useState, useEffect } from 'react';
import BadgeCard from '../components/BadgeCard';
import { apiGet } from '../utils/api';
import GlassCard from '../components/GlassCard';

export default function BadgeGallery() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await apiGet('/badges');
        setBadges(data);
      } catch (err) {
        console.error('Failed to fetch badges:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  return (
    <>
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0a0a0a',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      zIndex: -1,
    }} />
    <div className="page">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Badges</h1>
          <p className="text-gray-400 text-sm mt-0.5">Collect trophies for your achievements</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading gallery...</div>
        ) : badges.length === 0 ? (
          <GlassCard className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-3xl">🏅</span>
            <div>
              <h3 className="font-semibold text-lg">No badges available</h3>
              <p className="text-gray-400 text-sm mt-0.5">Check back later for new challenges and rewards.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {badges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
