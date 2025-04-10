import React from "react";

const CustomButton = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
};

export default CustomButton;
