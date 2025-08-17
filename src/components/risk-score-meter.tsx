
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MIN_SCORE = 0;
const MAX_SCORE = 10;
const SCORE_RANGE = MAX_SCORE - MIN_SCORE;

const scoreToPercent = (score: number) => {
  if (score < MIN_SCORE) return 0;
  if (score > MAX_SCORE) return 100;
  return ((score - MIN_SCORE) / SCORE_RANGE) * 100;
};

const labels = [
  { value: 0, text: "0 (LOW RISK)" },
  { value: 10, text: "10 (HIGH RISK)" },
];

export const RiskScoreMeter = ({ value }: { value: number }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const animation = setTimeout(() => setAnimatedValue(value), 300);
    return () => clearTimeout(animation);
  }, [value]);
  
  const percent = scoreToPercent(animatedValue);

  const getColor = (val: number) => {
    if (val <= 3) return "bg-green-500";
    if (val <= 6) return "bg-yellow-500";
    return "bg-red-500";
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4 px-4">
      <div className="relative h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="absolute top-0 left-0 h-full w-full flex">
          <div className="h-full bg-green-500" style={{ width: `30%` }}></div>
          <div className="h-full bg-yellow-500" style={{ width: `40%` }}></div>
          <div className="h-full bg-red-500" style={{ width: `30%` }}></div>
        </div>
        <motion.div
            className="absolute -top-1 -translate-x-1/2"
            initial={{ left: "0%" }}
            animate={{ left: `${scoreToPercent(value)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
        >
            <div className={`h-6 w-1 ${getColor(value)} rounded-full shadow-md`}></div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 h-2 w-2 ${getColor(value)} rounded-full"></div>
        </motion.div>
      </div>

      <div className="relative mt-2 flex justify-between font-bold text-xs text-muted-foreground">
        {labels.map((label) => (
          <span
            key={label.value}
            className={`absolute ${label.value === 0 ? 'left-0' : 'right-0'}`}
          >
            {label.text}
          </span>
        ))}
      </div>
    </div>
  );
};
