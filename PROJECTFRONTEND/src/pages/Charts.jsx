// ==================================================
// CHARTS.JSX — Allocation Trend Line Chart
// ==================================================
// This component draws the line chart you see on the Dashboard page.
// It shows how many students were allocated rooms over time (day by day).
//
// HOW IT WORKS:
//   - It receives an array of data points like: [{ day: "Mon", count: 12 }, ...]
//   - It uses the "recharts" library to draw the chart
//   - ResponsiveContainer makes the chart resize to fit any screen
//   - LineChart draws the actual chart with axes and a tooltip
//
// USED IN:
//   - admindashboard.jsx (Dashboard Overview page - allocation trend section)

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../chart.css';

// The AllocationTrend component
// Props:
//   data - array of objects with { day: "Mon", count: 5 } format
const AllocationTrend = ({ data }) => {
    return (
        <div className="trend-container">
            {/* Chart title */}
            <h3 className="trend-title">Allocation Trend</h3>

            {/* Chart wrapper - makes the chart responsive */}
            <div className="chart-wrapper">
                {/* ResponsiveContainer automatically adjusts chart size to fit the parent */}
                <ResponsiveContainer width="100%" height="100%">
                    {/* LineChart: the main chart component */}
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        {/* CartesianGrid: the light gray grid lines in the background */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

                        {/* XAxis: the horizontal axis (shows days) */}
                        <XAxis
                            dataKey="day"     // Which field from the data to use for labels
                            stroke="#888"
                            fontSize={12}
                            tickLine={false}  // Hide small tick marks
                            axisLine={false}  // Hide the axis line
                        />

                        {/* YAxis: the vertical axis (shows count numbers) */}
                        <YAxis
                            stroke="#888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />

                        {/* Tooltip: the popup that appears when you hover over a point */}
                        <Tooltip
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />

                        {/* Line: the actual data line on the chart */}
                        <Line
                            type="monotone"        // Smooth curve between points
                            dataKey="count"        // Which field from the data to plot
                            stroke="#6F55E3"        // Purple line color
                            strokeWidth={3}        // Line thickness
                            dot={{ r: 4, fill: '#6F55E3', strokeWidth: 2, stroke: '#fff' }}        // Circle dots at data points
                            activeDot={{ r: 8, strokeWidth: 0 }}  // Bigger dot on hover
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Export so it can be imported in admindashboard.jsx
export default AllocationTrend;