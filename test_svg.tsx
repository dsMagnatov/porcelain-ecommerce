import React from 'react';
import { motion } from 'framer-motion';

export const TestSvg = () => (
  <motion.svg viewBox="0 0 400 100" className="w-[400px] h-[100px]">
    <motion.text
      x="10"
      y="70"
      fontFamily="'Herr Von Muellerhoff', cursive"
      fontSize="70"
      stroke="#333333"
      strokeWidth="1"
      initial={{ strokeDasharray: 1000, strokeDashoffset: 1000, fill: "transparent" }}
      animate={{ strokeDashoffset: 0, fill: "#333333" }}
      transition={{ 
        strokeDashoffset: { duration: 4, ease: "easeInOut" },
        fill: { duration: 1, delay: 3 }
      }}
    >
      H. Takahashi
    </motion.text>
  </motion.svg>
);
