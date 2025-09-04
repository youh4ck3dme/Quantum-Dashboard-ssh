
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { QuantumBackend } from '../types';

interface BackendStatusChartProps {
    backends: QuantumBackend[];
}

export const BackendStatusChart: React.FC<BackendStatusChartProps> = ({ backends }) => {
    const chartData = backends.map(b => ({
        name: b.name.replace('ibm_', '').replace('ibmq_', ''),
        queue: b.queue,
    }));
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(44, 103, 242, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid rgba(44, 103, 242, 0.3)',
                        color: '#d1d5db',
                    }}
                    labelStyle={{ color: '#00d1ff' }}
                />
                <Bar dataKey="queue" fill="#2c67f2" />
            </BarChart>
        </ResponsiveContainer>
    );
};
