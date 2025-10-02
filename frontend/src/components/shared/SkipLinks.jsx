import React from 'react';

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
                <a
                    key={index}
                    href={link.to}
                    className="skip-link"
                    tabIndex={1}
                >
                    {link.label}
                </a>
            ))}
        </div>
    );
};

export default SkipLinks;
