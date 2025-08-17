
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MIN_SCORE = 300;
const MAX_SCORE = 900;
const SCORE_RANGE = MAX_SCORE - MIN_SCORE;

const scoreToPercent = (score: number) => {
  if (score < MIN_SCORE) return 0;
  if (score > MAX_SCORE) return 100;
  return ((score - MIN_SCORE) / SCORE_RANGE) * 100;
};

const labels = [
  { value: 300, color: "#ef4444" },
  { value: 550, color: "#f97316" },
  { value: 650, color: "#eab308" },
  { value: 750, color: "#84cc16" },
  { value: 900, color: "#22c55e" },
];

export const AltScoreMeter = ({ value }: { value: number }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const animation = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(animation);
  }, [value]);
  
  const percent = scoreToPercent(animatedValue);

  return (
    <div className="w-full max-w-md mx-auto mt-4 px-4">
      <div className="relative h-4 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <div className="absolute top-0 left-0 h-full w-full flex">
          <div className="h-full bg-red-500" style={{ width: `${scoreToPercent(550)}%` }}></div>
          <div className="h-full bg-orange-500" style={{ width: `${scoreToPercent(650) - scoreToPercent(550)}%` }}></div>
          <div className="h-full bg-yellow-500" style={{ width: `${scoreToPercent(750) - scoreToPercent(650)}%` }}></div>
          <div className="h-full bg-green-500" style={{ width: `${100 - scoreToPercent(750)}%` }}></div>
        </div>
        <motion.div
            className="absolute -top-1 -translate-x-1/2"
            initial={{ left: "0%" }}
            animate={{ left: `${scoreToPercent(value)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
        >
            <div className="h-6 w-1 bg-foreground rounded-full shadow-md"></div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 h-2 w-2 bg-foreground rounded-full"></div>
        </motion.div>
      </div>

      <div className="relative mt-2 flex justify-between font-bold text-xs text-muted-foreground">
        {labels.map((label) => (
          <span
            key={label.value}
            className="absolute -translate-x-1/2"
            style={{ left: `${scoreToPercent(label.value)}%` }}
          >
            {label.value}
          </span>
        ))}
      </div>
    </div>
  );
};
