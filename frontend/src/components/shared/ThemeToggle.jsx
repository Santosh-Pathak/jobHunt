import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '', size = 'icon', showLabel = false }) => {
    const { theme, toggleTheme, isDark } = useTheme();

    const getIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="h-5 w-5" />;
            case 'dark':
                return <Moon className="h-5 w-5" />;
            default:
                return <Monitor className="h-5 w-5" />;
        }
    };

    const getLabel = () => {
        switch (theme) {
            case 'light':
                return 'Switch to dark mode';
            case 'dark':
                return 'Switch to light mode';
            default:
                return 'Switch theme';
        }
    };

    const getAriaLabel = () => {
        return `Toggle theme. Currently ${theme} mode.`;
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Button
                variant="ghost"
                size={size}
                onClick={toggleTheme}
                className={`${className} ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                aria-label={getAriaLabel()}
                title={getLabel()}
            >
                {getIcon()}
                {showLabel && (
                    <span className="ml-2 text-sm font-medium">
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </span>
                )}
            </Button>
        </motion.div>
    );
};

export default ThemeToggle;
