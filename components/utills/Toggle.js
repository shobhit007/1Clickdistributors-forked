import React from "react";

const Toggle = ({ toggle, handleClick }) => {
  const toggleClass = "transform translate-x-0 delay-100";
  return (
    <div
      className={`md:w-14 md:h-7 delay-100 w-12 h-6 flex   border-2 items-center ${
        toggle === false
          ? "bg-red-400 justify-start "
          : "bg-lime-500 justify-end"
      } rounded-full p-1 cursor-pointer`}
      onClick={handleClick}
    >
      {/* Switch */}
      <div
        className={
          "bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform duration-300 ease-in-out" +
          (toggle ? toggleClass : null)
        }
      ></div>
    </div>
  );
};

export default Toggle;
