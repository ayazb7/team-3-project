import React, { useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "ar", label: "Arabic" },
];

const LanguageDropDown = ({ onChange }) => {
  const [selected, setSelected] = useState("en");

  const handleChange = (e) => {
    setSelected(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="rounded px-3 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageDropDown;