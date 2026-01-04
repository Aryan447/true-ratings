"use client";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from "recharts";

interface Episode {
    Episode: string;
    imdbRating: string;
    Title: string;
    season?: number;
}

interface RatingChartProps {
    seasons: { [key: number]: Episode[] };
}

export default function RatingChart({ seasons }: RatingChartProps) {
    const data = React.useMemo(() => {
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

    if (data.length === 0) return null;

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
