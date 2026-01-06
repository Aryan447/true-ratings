"use client";
import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Brush
    // ReferenceLine
} from "recharts";

import { Episode } from "../types";

interface RatingChartProps {
    seasons: { [key: number]: Episode[] };
    comparisonSeasons?: { [key: number]: Episode[] };
    comparisonTitle?: string;
}

export default function RatingChart({ seasons, comparisonSeasons, comparisonTitle }: RatingChartProps) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const isRetro = theme === 'retro';

    const chartRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!chartRef.current) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(chartRef.current, {
                backgroundColor: isRetro ? "#000000" : "#121212", // Dark bg for premium look
                scale: 2,
                logging: false,
                useCORS: true
            });
            const link = document.createElement("a");
            link.download = `true-ratings-chart-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Download failed", err);
        }
        setDownloading(false);
    };

    const getChartColor = (rating: number) => {
        if (isRetro) return "#c5a059";
        if (rating >= 9) return "#10b981";
        if (rating >= 7.5) return "#f59e0b";
        if (rating >= 6) return "#f97316";
        return "#ef4444";
    };

    const data = React.useMemo(() => {
        const points: any[] = [];
        let globalIndex = 1;

        Object.entries(seasons).forEach(([season, episodes]) => {
            episodes.forEach(ep => {
                const rating = parseFloat(ep.imdbRating);
                if (!isNaN(rating)) {
                    points.push({
                        name: `S${season}E${ep.Episode}`,
                        title: ep.Title,
                        rating: rating,
                        season: Number(season),
                        episode: Number(ep.Episode),
                        index: globalIndex++,
                        // Original series data
                        ratingA: rating
                    });
                }
            });
        });

        // Merge comparison data if available
        if (comparisonSeasons) {
            let compIndex = 1;
            Object.entries(comparisonSeasons).forEach(([season, episodes]) => {
                episodes.forEach(ep => {
                    const rating = parseFloat(ep.imdbRating);
                    // Match by global index (episode count)
                    if (!isNaN(rating)) {
                        if (points[compIndex - 1]) {
                            points[compIndex - 1].ratingB = rating;
                            points[compIndex - 1].titleB = ep.Title;
                        } else {
                            // If comparison is longer, add new points
                            points.push({
                                name: `S${season}E${ep.Episode}`, // Might be misleading if seasons mismatch, but acceptable for comparison
                                title: `(Comp) ${ep.Title}`,
                                season: Number(season),
                                episode: Number(ep.Episode),
                                index: compIndex,
                                ratingB: rating
                            });
                        }
                        compIndex++;
                    }
                });
            });
        }

        return points;
    }, [seasons, comparisonSeasons]);

    if (data.length === 0) return null;

    if (isRetro) {
        return (
            <div ref={chartRef} className="retro-box p-6 mb-12 w-full max-w-6xl mx-auto h-[400px] bg-black border-2 border-[var(--neon-green)] shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                <div className="flex justify-between items-center mb-6 border-b border-[#00ff00] pb-2">
                    <h3 className="text-xl font-bold text-[#00ff00] font-mono uppercase tracking-widest flex items-center gap-4">
                        <span>OSCILLOSCOPE_READING</span>
                        <span className="animate-pulse text-sm">● LIVE</span>
                    </h3>
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="text-[#00ff00] hover:bg-[#003300] px-3 py-1 text-sm font-mono uppercase border border-[#00ff00] transition-colors"
                    >
                        {downloading ? "CAPTURING..." : "[ SAVE_IMG ]"}
                    </button>
                </div>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#003300" />
                        <XAxis
                            dataKey="name"
                            hide={!isRetro}
                            stroke={isRetro ? "#8a0c0c" : "#666"}
                            tick={{ fill: isRetro ? "#c5a059" : "#999", fontSize: 10 }}
                        />
                        <YAxis
                            domain={[0, 10]}
                            ticks={[0, 2, 4, 6, 8, 10]}
                            stroke={isRetro ? "#8a0c0c" : "#666"}
                            tick={{ fill: isRetro ? "#c5a059" : "#999" }}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload;
                                    return (
                                        <div className={`p-3 border rounded shadow-lg ${isRetro ? 'bg-black border-[#c5a059] text-[#c5a059]' : 'bg-gray-900 border-gray-700 text-white'}`}>
                                            <p className="font-bold border-b border-gray-700 mb-2 pb-1">{d.name}</p>

                                            {/* Series A */}
                                            {d.ratingA !== undefined && (
                                                <div className="mb-1">
                                                    <span className="text-xs opacity-70">Main: </span>
                                                    <span style={{ color: isRetro ? '#c5a059' : '#10b981' }}>{d.title}</span>
                                                    <div className="font-mono font-bold text-lg">{d.ratingA} ★</div>
                                                </div>
                                            )}

                                            {/* Series B */}
                                            {d.ratingB !== undefined && (
                                                <div className="mt-2 pt-2 border-t border-gray-700/50">
                                                    <span className="text-xs opacity-70">Comp: </span>
                                                    <span style={{ color: isRetro ? '#ef4444' : '#3b82f6' }}>{d.titleB || "Ep " + d.index}</span>
                                                    <div className="font-mono font-bold text-lg" style={{ color: isRetro ? '#ef4444' : '#3b82f6' }}>
                                                        {d.ratingB} ★
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="ratingA" // Changed from 'rating'
                            stroke={isRetro ? "#c5a059" : "#10b981"}
                            strokeWidth={isRetro ? 2 : 3}
                            dot={{ r: isRetro ? 2 : 0, fill: isRetro ? "#c5a059" : "#10b981" }}
                            activeDot={{ r: 6, fill: isRetro ? "#fff" : "#fff" }}
                            animationDuration={1500}
                        />
                        {comparisonSeasons && (
                            <Line
                                type="monotone"
                                dataKey="ratingB"
                                stroke={isRetro ? "#ef4444" : "#3b82f6"} // Red or Blue for contrast
                                strokeWidth={isRetro ? 2 : 3}
                                dot={{ r: 0 }}
                                activeDot={{ r: 6 }}
                                animationDuration={1500}
                                connectNulls
                            />
                        )}
                        <Brush
                            dataKey="index"
                            height={30}
                            stroke={isRetro ? "#c5a059" : "#888888"}
                            fill={isRetro ? "#1a0505" : "#1f2937"}
                            tickFormatter={() => ""}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div ref={chartRef} className="glass rounded-xl p-6 mb-12 w-full max-w-6xl mx-auto h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
                <h3 className="text-xl font-bold text-white">
                    Rating Trend
                </h3>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs md:text-sm font-medium text-gray-300 hover:text-white transition-colors border border-white/5"
                >
                    {downloading ? (
                        <span className="animate-pulse">Saving...</span>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Chart
                        </>
                    )}
                </button>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="name"
                        hide={true} // Hide labels for cleaner look if many episodes
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        stroke="rgba(255,255,255,0.5)"
                        fontSize={12}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fbbf24' }}
                        labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="url(#gradientStroke)"
                        strokeWidth={3}
                        dot={{ r: 2, fill: '#fbbf24', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#fff' }}
                        animationDuration={1500}
                    />
                    <Brush
                        dataKey="name"
                        height={30}
                        stroke="#fbbf24"
                        fill="#1a1a1a"
                        tickFormatter={() => ""}
                    />
                    <defs>
                        <linearGradient id="gradientStroke" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
