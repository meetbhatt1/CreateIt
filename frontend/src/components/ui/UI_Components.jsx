import { useRef, useState } from "react";

// Input Component (handles text/textarea)
export const Input = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  label,
  error,
  ...props
}) => {
  const baseClasses =
    "w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105";

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block mb-2 font-semibold text-purple-700">
          {label}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseClasses} min-h-[120px] resize-y`}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
          {...props}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// Dropdown Component
export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  label,
  error,
}) => {
  return (
    <div className={`mt-4 mb-4 ${className}`}>
      {label && (
        <label className="block mb-2 font-semibold text-purple-700">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:border-purple-500 focus:outline-none transition-all duration-300 focus:scale-105 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiA3ZTJiZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-no-repeat bg-[right_1rem_center]"
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// RadioButton Component
export const RadioButton = ({
  name,
  value,
  checked,
  onChange,
  label,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center space-x-3 cursor-pointer ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="absolute opacity-0 cursor-pointer"
        />
        <div
          className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${
            checked
              ? "border-purple-600 bg-purple-100"
              : "border-purple-200 hover:border-purple-400"
          }`}
        >
          {checked && (
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          )}
        </div>
      </div>
      <span className="text-lg font-medium text-gray-700">{label}</span>
    </label>
  );
};

export const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
}) => {
  const baseClasses =
    "px-6 py-3 rounded-3xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";
  const variants = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700",
    secondary:
      "bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// RadioGroup Component (for grouping radios)
export const RadioGroup = ({
  name,
  options,
  selectedValue,
  onChange,
  className = "",
  label,
  orientation = "vertical", // 'vertical' or 'horizontal'
}) => {
  return (
    <div className={className}>
      {label && (
        <legend className="block mb-3 font-semibold text-purple-700">
          {label}
        </legend>
      )}
      <div
        className={`flex ${
          orientation === "horizontal"
            ? "flex-row space-x-6"
            : "flex-col space-y-3"
        }`}
      >
        {options.map((option) => (
          <RadioButton
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={selectedValue === option.value}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export const MultiSelect = ({
  options,
  selectedValues = [],
  onChange,
  placeholder = "Select options...",
  className = "",
  label,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const toggleOption = (optionValue) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((val) => val !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newSelectedValues);
  };

  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)
    .join(", ");

  return (
    <div className={`mb-4 ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block mb-2 font-semibold text-purple-700">
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className="w-full p-4 border-3 border-purple-200 rounded-2xl text-lg font-medium focus:outline-none transition-all duration-300 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedValues.length > 0 ? selectedLabels : placeholder}
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border-3 border-purple-200 rounded-2xl shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`p-3 hover:bg-purple-50 cursor-pointer ${
                  selectedValues.includes(option.value) ? "bg-purple-100" : ""
                }`}
                onClick={() => toggleOption(option.value)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 border-2 rounded mr-3 ${
                      selectedValues.includes(option.value)
                        ? "border-purple-600 bg-purple-600"
                        : "border-purple-200"
                    }`}
                  >
                    {selectedValues.includes(option.value) && (
                      <svg
                        className="w-3 h-3 text-white ml-0.5 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span>{option.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// BADGE
const badgeStyles = {
  default:
    "inline-flex items-center rounded-full border border-transparent bg-blue-600 text-white px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
  secondary:
    "inline-flex items-center rounded-full border border-transparent bg-gray-200 text-gray-900 px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
  destructive:
    "inline-flex items-center rounded-full border border-transparent bg-red-600 text-white px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2",
  outline:
    "inline-flex items-center rounded-full border border-current text-black px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
};

export const Badge = ({ className = "", variant = "default", ...props }) => {
  const baseClass = badgeStyles[variant] || badgeStyles.default;
  const combinedClass = `${baseClass} ${className}`;

  return <div className={combinedClass} {...props} />;
};
