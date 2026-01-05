import React from "react";
import { useTheme } from "../context/ThemeContext";

export default function SeriesSkeleton() {
    const { theme } = useTheme();
    const isRetro = theme === "retro";

    return (
        <div className="w-full max-w-7xl mx-auto animate-pulse">
            {/* Series Info Skeleton */}
            <div className={`p-6 mb-8 rounded-xl flex flex-col md:flex-row gap-8 ${isRetro ? "border-2 border-dashed border-gray-700 bg-black" : "bg-white/5"}`}>
                {/* Poster */}
                <div className="w-48 h-72 bg-gray-700/50 rounded-lg flex-shrink-0 mx-auto md:mx-0" />

                {/* Info */}
                <div className="flex-1 space-y-4">
                    <div className="h-10 bg-gray-700/50 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                    <div className="h-24 bg-white/5 rounded w-full" />
                    <div className="flex gap-4">
                        <div className="h-8 bg-gray-700/50 rounded w-24" />
                        <div className="h-8 bg-gray-700/50 rounded w-24" />
                    </div>
                </div>
            </div>

            {/* Chart Skeleton */}
            <div className="w-full h-64 bg-white/5 rounded-xl mb-12" />

            {/* Grid Skeleton */}
            <div className="space-y-8">
                {[1, 2].map((i) => (
                    <div key={i}>
                        <div className="h-8 bg-gray-700/50 rounded w-32 mb-4" />
                        <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 ${isRetro ? "flex overflow-x-auto" : ""}`}>
                            {[...Array(10)].map((_, j) => (
                                <div key={j} className="aspect-[3/4] bg-white/5 rounded-md" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
