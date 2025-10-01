import { useEffect, useCallback } from 'react';

const useKeyboardNavigation = (shortcuts = {}) => {
    const handleKeyDown = useCallback((event) => {
        const { key, ctrlKey, altKey, shiftKey, metaKey } = event;
        
        // Create shortcut key
        const shortcut = [
            ctrlKey && 'ctrl',
            altKey && 'alt',
            shiftKey && 'shift',
            metaKey && 'meta',
            key.toLowerCase()
        ].filter(Boolean).join('+');

        // Check if there's a handler for this shortcut
        const handler = shortcuts[shortcut];
        if (handler) {
            event.preventDefault();
            handler(event);
        }
    }, [shortcuts]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return {
        handleKeyDown
    };
};

export default useKeyboardNavigation;
