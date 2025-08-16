
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
  { value: 300 },
  { value: 550 },
  { value: 650 },
  { value: 750 },
  { value: 900 },
];

export const ScoreBar = ({ value }: { value: number }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const animation = setTimeout(() => setAnimatedValue(value), 500);
    return () => clearTimeout(animation);
  }, [value]);
  
  const percent = scoreToPercent(animatedValue);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative h-6 w-full rounded-full overflow-hidden bg-gray-300">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
          initial={{ width: "0%" }}
          animate={{ width: `${scoreToPercent(value)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className="absolute top-0 left-0 h-full w-full rounded-full bg-gray-800 mix-blend-color"></div>
         <motion.div
            className="absolute top-0 left-0 h-full w-full rounded-full bg-gray-800 mix-blend-hue"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      <div className="relative mt-2 flex justify-between font-bold text-sm">
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
