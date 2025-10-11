import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    const [highContrast, setHighContrast] = useState(() => {
        const saved = localStorage.getItem('highContrast');
        return saved ? saved === 'true' : false;
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        // Apply theme to document element for CSS variables
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        
        // Also apply to body for global styles
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('highContrast', String(highContrast));
        document.documentElement.classList.toggle('high-contrast', highContrast);
    }, [highContrast]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleHighContrast = () => {
        setHighContrast(prev => !prev);
    };

    const value = {
        theme,
        toggleTheme,
        isDark: theme === 'dark',
        highContrast,
        toggleHighContrast,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
