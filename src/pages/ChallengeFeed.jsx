import React, { useState, useEffect } from 'react';
import FeedPostCard from '../components/FeedPostCard';
import { apiGet } from '../utils/api';
import GlassCard from '../components/GlassCard';

export default function ChallengeFeed() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try { setPosts(await apiGet('/feed')); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFeed(); }, []);

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
          <h1 className="text-2xl font-bold">Activity Feed</h1>
          <p className="text-gray-500 text-sm mt-0.5">See what your community is achieving</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-600">Loading feed…</div>
        ) : posts.length === 0 ? (
          <GlassCard className="p-8 text-center flex flex-col items-center space-y-4">
            <span className="text-4xl">📣</span>
            <div>
              <h3 className="font-semibold text-lg">No activities yet</h3>
              <p className="text-gray-500 text-sm mt-1">No one has started their workout yet — you could be first!</p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <FeedPostCard key={post.id} post={post} onReact={fetchFeed} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
