// components/MultiSelectDropdown.js
import { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";

export default function MultiSelectDropdown({ options, label }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const isSelected = (option) => selectedOptions.includes(option);

  const toggleDropDown = () => setShowDropDown(!showDropDown);

  return (
    <div className="relative">
      <button
        onClick={toggleDropDown}
        className="border flex justify-between gap-3 border-gray-300 rounded px-2 py-1 items-center text-sm cursor-pointer bg-white"
      >
        {label}

        {showDropDown ? (
          <MdArrowDropUp className="text-xl text-gray-600" />
        ) : (
          <MdArrowDropDown className="text-xl text-gray-600" />
        )}
      </button>
      {showDropDown && (
        <div className="min-w-48 max-h-80 overflow-auto absolute top-full mt-1 w-full bg-white border border-gray-300 rounded shadow">
          {options.map((option, idx) => (
            <div
              key={idx.toString()}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                isSelected(option) ? "bg-blue-100" : ""
              }`}
              onClick={() => toggleOption(option)}
            >
              <input
                type="checkbox"
                checked={isSelected(option)}
                className="mr-2"
                onChange={() => toggleOption(option)}
              />
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
