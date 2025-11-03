import React from "react";

const LanguageFilters = ({ selectedLanguage, setSelectedLanguage }) => {
  const languages = [
    { code: "te", label: "Telugu" },
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "ja", label: "Japanese" },  // added
    { code: "ml", label: "Malayalam" },
    
    { code: "ta", label: "Tamil" },
    // add more languages as needed
  ];

  return (
    <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
      <button
        className={`btn btn-sm ${selectedLanguage === "All" ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => setSelectedLanguage("All")}
      >
        All
      </button>

      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`btn btn-sm ${selectedLanguage === lang.code ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setSelectedLanguage(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageFilters;
