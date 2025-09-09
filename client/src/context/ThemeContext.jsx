import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.background = 'linear-gradient(135deg, #000000 0%, rgba(99, 61, 155, 0.1) 100%)';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = '#FFFFFF';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.background = 'linear-gradient(135deg, #000000 0%, rgba(99, 61, 155, 0.1) 100%)';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = '#FFFFFF';
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
