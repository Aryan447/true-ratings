"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useTheme } from "./ThemeContext";

interface Toast {
    id: number;
    message: string;
    type: "success" | "error" | "info";
}

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)} // Allow manual dismiss if pointer-events allow
                        className={`
              pointer-events-auto cursor-pointer animate-slide-up
              px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md transition-all
              ${isRetro
                                ? 'bg-black border-2 border-yellow-500 text-yellow-500 font-mono tracking-widest uppercase'
                                : 'bg-white/10 border border-white/20 text-white'}
              ${toast.type === 'error' && !isRetro ? 'bg-red-500/20 border-red-500/50' : ''}
              ${toast.type === 'success' && !isRetro ? 'bg-emerald-500/20 border-emerald-500/50' : ''}
            `}
                    >
                        {/* Icon */}
                        {toast.type === 'success' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        {toast.type === 'error' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
