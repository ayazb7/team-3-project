import React from "react";

const Button = ({ className, label }) => {
  return (
    <button
      className={`w-25 h-10  text-white !bg-blue-500  rounded-lg ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
