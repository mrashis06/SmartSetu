"use client";

import { motion } from "framer-motion";

const MAX_SCORE = 900;
const MIN_SCORE = 300;
const SCORE_RANGE = MAX_SCORE - MIN_SCORE;

// Angle constants for the gauge (from -120 to 120 degrees)
const MIN_ANGLE = -120;
const MAX_ANGLE = 120;
const ANGLE_RANGE = MAX_ANGLE - MIN_ANGLE;

const scoreToAngle = (score: number) => {
  const normalizedScore = (score - MIN_SCORE) / SCORE_RANGE;
  return MIN_ANGLE + normalizedScore * ANGLE_RANGE;
};

const GaugeMeter = ({ value }: { value: number }) => {
  const angle = scoreToAngle(value);

  const colors = [
    "#ef4444", // red-500
    "#f87171", // red-400
    "#fb923c", // orange-400
    "#fbbf24", // amber-400
    "#fde047", // yellow-300
    "#a3e635", // lime-400
    "#4ade80", // green-400
    "#22c55e", // green-500
  ];

  const arcWidth = 240 / colors.length;

  return (
    <div className="relative w-64 h-48 md:w-80 md:h-60">
      <svg viewBox="0 0 200 130" className="w-full h-full">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="#000"
              floodOpacity="0.1"
            />
          </filter>
        </defs>

        {/* Gauge background arcs */}
        <g transform="translate(100, 100)">
          {colors.map((color, i) => (
            <path
              key={color}
              d={`M ${-80 * Math.cos(Math.PI * (MIN_ANGLE + i * arcWidth) / 180)} ${-80 * Math.sin(Math.PI * (MIN_ANGLE + i * arcWidth) / 180)} 
                 A 80 80 0 0 1 ${-80 * Math.cos(Math.PI * (MIN_ANGLE + (i + 1) * arcWidth) / 180)} ${-80 * Math.sin(Math.PI * (MIN_ANGLE + (i + 1) * arcWidth) / 180)}`}
              fill="none"
              stroke={color}
              strokeWidth="20"
              strokeLinecap="butt"
            />
          ))}
        </g>

        {/* Gauge labels */}
        <text
          x="15"
          y="115"
          textAnchor="middle"
          className="font-bold text-lg fill-current"
        >
          {MIN_SCORE}
        </text>
        <text
          x="185"
          y="115"
          textAnchor="middle"
          className="font-bold text-lg fill-current"
        >
          {MAX_SCORE}
        </text>
        <text
          x="45"
          y="30"
          textAnchor="middle"
          className="font-bold text-lg fill-current"
        >
          550
        </text>
        <text
          x="100"
          y="15"
          textAnchor="middle"
          className="font-bold text-lg fill-current"
        >
          650
        </text>
        <text
          x="155"
          y="30"
          textAnchor="middle"
          className="font-bold text-lg fill-current"
        >
          750
        </text>

        {/* Needle */}
        <g transform="translate(100, 100)" style={{ filter: "url(#shadow)" }}>
          <motion.g
            initial={{ rotate: MIN_ANGLE }}
            animate={{ rotate: angle }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
          >
            <path d="M -70 0 L 0 -5 L 0 5 Z" fill="hsl(var(--foreground))" />
            <circle cx="0" cy="0" r="8" fill="hsl(var(--foreground))" />
          </motion.g>
        </g>
      </svg>
    </div>
  );
};

export { GaugeMeter };
