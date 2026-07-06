import React from 'react';
import { motion } from 'framer-motion';

const ProgressRing = ({ 
  size = 80, 
  strokeWidth = 8, 
  radius, 
  stroke, 
  progress = 0, 
  color = '#4ade80',
  hidePercentText = false 
}) => {
  // Normalize sizes (support both size/strokeWidth and radius/stroke APIs)
  const actualSize = size || (radius ? radius * 2 : 80);
  const actualStroke = strokeWidth || stroke || 8;
  const actualRadius = actualSize / 2;
  const normalizedRadius = actualRadius - actualStroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={actualSize} width={actualSize} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          stroke="rgba(255,255,255,0.06)"
          fill="transparent"
          strokeWidth={actualStroke}
          r={normalizedRadius}
          cx={actualRadius}
          cy={actualRadius}
        />
        {/* Foreground (Progress) Circle */}
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={actualStroke}
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={actualRadius}
          cy={actualRadius}
        />
      </svg>
      {!hidePercentText && (
        <div className="absolute flex items-center justify-center text-xs font-semibold text-gray-300">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
