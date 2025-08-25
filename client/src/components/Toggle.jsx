// Toggle.jsx
import { motion } from "framer-motion";
import { useState } from "react";

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const Toggle = ({ options = ["Option 1", "Option 2"], onChange }) => {
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (value) => {
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div
      className={`grid h-[200px] place-content-center px-4 transition-colors`}
    >
      <SliderToggle
        options={options}
        selected={selected}
        setSelected={handleSelect}
      />
    </div>
  );
};

const SliderToggle = ({ options, selected, setSelected }) => {
  return (
    <div className="relative flex w-fit items-center rounded-full border border-gray-300 dark:border-gray-600">
      {options.map((option, index) => (
        <button
          key={option}
          className={`${TOGGLE_CLASSES} ${
            selected === option
              ? "text-white"
              : "text-slate-800 dark:text-slate-300"
          }`}
          onClick={() => setSelected(option)}
        >
          <span className="relative z-10">{option}</span>
        </button>
      ))}

      <div
        className={`absolute inset-0 z-0 flex ${
          selected === options[1] ? "justify-end" : "justify-start"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", damping: 15, stiffness: 250 }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
        />
      </div>
    </div>
  );
};

export default Toggle;
