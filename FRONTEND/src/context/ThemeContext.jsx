import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // --- වෙනස් කළ කොටස (Correction) ---
  // useState එක ඇතුලෙම function එකක් දාලා මුලින්ම local storage check කරනවා.
  // එතකොට page එක refresh වුණ ගමන් පරණ theme එකම එනවා.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light'; // කලින් එකක් නැත්නම් විතරක් 'light' ගන්නවා
  });

  // පළවෙනි useEffect එක දැන් අවශ්‍ය නෑ, මොකද අපි උඩදීම ඒ වැඩේ කළා.

  useEffect(() => {
    // HTML root element එකේ class එක මාරු කරනවා
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Local storage එක update කරනවා
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);