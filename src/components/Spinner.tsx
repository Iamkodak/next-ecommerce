// components/Spinner.tsx
import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

const Spinner: React.FC<SpinnerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${textSize[size]}`}
    >
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-transparent border-indigo-600`}
      ></div>
      <span className="mt-2 text-gray-600">Loading...</span>
    </div>
  );
};

export default Spinner;
