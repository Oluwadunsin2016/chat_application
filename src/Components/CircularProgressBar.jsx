import React, { useEffect, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgressBar = ({ setIsCompleted, isuploading }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (isuploading) {
      if (percentage < 100) {
        setTimeout(() => {
          setPercentage(percentage + 1);
        }, 20);
      } else if (percentage === 100) {
        setIsCompleted(true);
      }
    }
  }, [percentage, isuploading]);

  return (
    <div className="relative w-[10rem] h-[10rem]">
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={8}
        styles={buildStyles({
          pathTransition: "stroke-dashoffset 0.5s ease 0s",
          pathColor: `rgba(16, 185, 129, ${percentage / 100})`,
          trailColor: "rgba(229, 231, 235, 0.2)",
          textColor: "#f8fafc",
          textSize: "24px",
          fontWeight: "600",
        })}
      />
      
      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-full animate-ping opacity-20 border-2 border-emerald-500" />
    </div>
  );
};

export default CircularProgressBar;