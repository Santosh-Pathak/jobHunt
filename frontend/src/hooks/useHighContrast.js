import { useState, useEffect } from 'react';

const useHighContrast = () => {
    const [prefersHighContrast, setPrefersHighContrast] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-contrast: high)');
        
        const handleChange = (e) => {
            setPrefersHighContrast(e.matches);
        };

        // Set initial value
        setPrefersHighContrast(mediaQuery.matches);

        // Listen for changes
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return prefersHighContrast;
};

export default useHighContrast;
