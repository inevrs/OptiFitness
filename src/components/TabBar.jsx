import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon, SquadsIcon, WaterIcon, BadgeIcon, ProfileIcon, InfoIcon } from './Icons';

const tabs = [
  { path: '/dashboard', label: 'Home',    Icon: HomeIcon    },
  { path: '/squad',     label: 'Squads',  Icon: SquadsIcon  },
  { path: '/water',     label: 'Water',   Icon: WaterIcon   },
  { path: '/badges',    label: 'Badges',  Icon: BadgeIcon   },
  { path: '/profile',   label: 'Profile', Icon: ProfileIcon },
  { path: '/about',     label: 'About',   Icon: InfoIcon },
];

const TabBar = () => (
  <div className="fixed bottom-5 left-0 right-0 flex justify-center z-50 px-4">
    <div
      className="flex items-center justify-around w-full max-w-sm rounded-[32px] px-2 py-2"
      style={{
        background: 'rgba(18,18,18,0.88)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {tabs.map(({ path, label, Icon }) => (
        <NavLink key={path} to={path} className="flex-1">
          {({ isActive }) => (
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all"
              style={isActive ? { background: 'rgba(255,42,133,0.12)' } : {}}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.6}
                color={isActive ? '#ff2a85' : 'rgba(255,255,255,0.3)'}
              />
              <span
                className="text-[9px] font-semibold mt-1 tracking-wide"
                style={{ color: isActive ? '#ff2a85' : 'rgba(255,255,255,0.3)' }}
              >
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tabDot"
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: '#ff2a85' }}
                />
              )}
            </motion.div>
          )}
        </NavLink>
      ))}
    </div>
  </div>
);

export default TabBar;
