import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', onClick }) => {
  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? { whileTap: { scale: 0.98 }, onClick } : {};

  return (
    <Component
      {...motionProps}
      className={`rounded-2xl border backdrop-blur-xl shadow-md ${className}`}
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
