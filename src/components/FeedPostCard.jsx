import React from 'react';
import GlassCard from './GlassCard';
import { apiPost } from '../utils/api';
import { bridge } from '../utils/appInventorBridge';

const FeedPostCard = ({ post, onReact }) => {
  const handleReact = async (type) => {
    try {
      bridge.vibrate(100);
      await apiPost(`/feed/${post.id}/react`, { reaction_type: type });
      
      // Let the parent component know we reacted to refresh the counts
      if (onReact) {
        onReact();
      }
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const getBadgeTypeIcon = (type) => {
    switch (type) {
      case 'challenge_completed': return '⚡';
      case 'badge_unlocked': return '🏅';
      case 'streak_milestone': return '🔥';
      default: return '💪';
    }
  };

  const formattedDate = new Date(post.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <GlassCard className="p-5 flex flex-col space-y-4">
      {/* User Info & Post Details */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-md">
            {post.username ? post.username[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-white">{post.full_name || post.username || 'User'}</h4>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                {getBadgeTypeIcon(post.post_type)} {post.post_type.replace('_', ' ')}
              </span>
            </div>
            <span className="text-[10px] text-gray-500">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="text-gray-200 text-sm leading-relaxed">{post.message}</p>

    </GlassCard>
  );
};

export default FeedPostCard;
