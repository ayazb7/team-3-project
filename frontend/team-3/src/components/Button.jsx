import React from "react";

const Button = ({ className, label, onClick }) => {
  return (
    <button
      className={`w-15 h-10  text-white !bg-blue-500  rounded-lg ${className} cursor-pointer hover:!bg-blue-600`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
