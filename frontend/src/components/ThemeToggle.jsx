import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
        >
            <div className={`theme-toggle-icon ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
                {theme === 'dark' ? (
                    <Moon size={18} />
                ) : (
                    <Sun size={18} />
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
