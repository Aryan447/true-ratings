"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!visible) return null;

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 
                ${isRetro
                    ? 'bg-[#8a0c0c] text-[#c5a059] border-2 border-[#c5a059] hover:bg-[#a01515]'
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
                }`}
            aria-label="Back to Top"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    );
}
