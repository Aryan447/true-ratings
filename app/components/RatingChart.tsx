"use client";
import React from "react";
import { useTheme } from "../context/ThemeContext";
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
}

export default function RatingChart({ seasons }: RatingChartProps) {
    const data = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const points: any[] = [];
        Object.entries(seasons).forEach(([seasonStr, episodes]) => {
            episodes.forEach((ep) => {
                const rating = parseFloat(ep.imdbRating);
                if (!isNaN(rating)) {
                    points.push({
                        name: `S${seasonStr}E${ep.Episode}`,
                        rating: rating,
                        title: ep.Title,
                        season: parseInt(seasonStr),
                        episode: parseInt(ep.Episode)
                    });
                }
            });
        });
        return points;
    }, [seasons]);

    const { theme } = useTheme();
    const isRetro = theme === 'retro';

    if (data.length === 0) return null;

    if (isRetro) {
        return (
            <div className="retro-box p-6 mb-12 w-full max-w-6xl mx-auto h-[400px] bg-black border-2 border-[var(--neon-green)] shadow-[0_0_15px_rgba(0,255,0,0.2)]">
                <h3 className="text-xl font-bold mb-6 text-[#00ff00] border-b border-[#00ff00] pb-2 font-mono uppercase tracking-widest flex justify-between">
                    <span>OSCILLOSCOPE_READING</span>
                    <span className="animate-pulse">● LIVE</span>
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#003300" />
                        <XAxis
                            dataKey="name"
                            hide={true}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            domain={['dataMin - 0.5', 'dataMax + 0.5']}
                            stroke="#00ff00"
                            fontSize={12}
                            tick={{ fill: '#00ff00', fontFamily: 'monospace' }}
                            tickLine={{ stroke: '#00ff00' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#000',
                                border: '1px solid #00ff00',
                                fontFamily: 'monospace',
                                color: '#00ff00'
                            }}
                            itemStyle={{ color: '#00ff00' }}
                            labelStyle={{ color: '#00cc00', marginBottom: '0.25rem' }}
                            cursor={{ stroke: '#00ff00', strokeWidth: 1 }}
                        />
                        <Line
                            type="step"
                            dataKey="rating"
                            stroke="#00ff00"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#00ff00' }}
                            animationDuration={500}
                        />
                        <Brush dataKey="name" height={30} stroke="#8884d8" alwaysShowText={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className="glass rounded-xl p-6 mb-12 w-full max-w-6xl mx-auto h-[400px]">
            <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">
                Rating Trend
            </h3>
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
