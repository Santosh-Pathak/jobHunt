import React from 'react';
import { Link } from 'react-router-dom';

const SkipLinks = () => {
    const skipLinks = [
        { to: '#main-content', label: 'Skip to main content' },
        { to: '#navigation', label: 'Skip to navigation' },
        { to: '#search', label: 'Skip to search' },
        { to: '#footer', label: 'Skip to footer' }
    ];

    return (
        <div className="skip-links">
            {skipLinks.map((link, index) => (
                <Link
                    key={index}
                    to={link.to}
                    className="skip-link"
                    tabIndex={1}
                >
                    {link.label}
                </Link>
            ))}
        </div>
    );
};

export default SkipLinks;
