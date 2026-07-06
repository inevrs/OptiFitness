import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BadgeToastContext = React.createContext({ showBadge: () => {} });

export function BadgeToastProvider({ children }) {
  const [badge, setBadge] = useState(null);

  const showBadge = useCallback((b) => {
    setBadge(b);
    setTimeout(() => setBadge(null), 4000);
  }, []);

  return (
    <BadgeToastContext.Provider value={{ showBadge }}>
      {children}
      <AnimatePresence>
        {badge && (
          <motion.div
            key="badge-toast"
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0,  opacity: 1, scale: 1   }}
            exit={{   y: 80, opacity: 0, scale: 0.9  }}
            className="fixed bottom-28 left-0 right-0 flex justify-center z-[100] px-6 pointer-events-none"
          >
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl max-w-sm w-full"
              style={{
                background: 'linear-gradient(135deg, rgba(255,42,133,0.95), rgba(192,132,252,0.95))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span className="text-3xl">🏅</span>
              <div>
                <p className="text-white font-bold text-sm">Badge Unlocked!</p>
                <p className="text-white/80 text-xs mt-0.5">{badge.name}</p>
              </div>
              <motion.div
                className="ml-auto w-1 h-10 rounded-full bg-white/30"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 4, ease: 'linear' }}
                style={{ transformOrigin: 'bottom' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BadgeToastContext.Provider>
  );
}
