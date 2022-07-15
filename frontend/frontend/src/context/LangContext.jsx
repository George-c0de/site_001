import React, { createContext, useState, useEffect, useMemo } from 'react';

export const LangContext = createContext({
  lang: 'en',
  updateLang: () => {},
});

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const updateLang = (value) => {
    setLang(value);
  };

  const value = useMemo(() => ({ lang, updateLang }), [lang]);

  return (
    <LangContext.Provider value={value}>{children}</LangContext.Provider>
  );
};
