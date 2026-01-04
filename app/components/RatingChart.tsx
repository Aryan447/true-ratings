"use client";
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
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
        <div className="retro-box p-6 mb-12 w-full max-w-6xl mx-auto h-[400px] bg-black border-2 border-[var(--neon-green)] shadow-[0_0_15px_rgba(0,255,0,0.2)]">
            <h3 className="text-xl font-bold mb-6 text-[var(--neon-green)] border-b border-[var(--neon-green)] pb-2 font-mono uppercase tracking-widest flex justify-between">
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
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
