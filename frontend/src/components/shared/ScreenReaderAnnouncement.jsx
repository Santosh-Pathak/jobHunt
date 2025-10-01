import React, { useEffect, useRef } from 'react';

const ScreenReaderAnnouncement = ({ message, priority = 'polite' }) => {
    const announcementRef = useRef(null);

    useEffect(() => {
        if (message && announcementRef.current) {
            // Clear previous message
            announcementRef.current.textContent = '';
            
            // Set new message
            setTimeout(() => {
                if (announcementRef.current) {
                    announcementRef.current.textContent = message;
                }
            }, 100);
        }
    }, [message]);

    return (
        <div
            ref={announcementRef}
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
            role="status"
        />
    );
};

export default ScreenReaderAnnouncement;
