import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppState } from '../types.ts';

interface WeeklyStatsProps {
  appState: AppState;
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({ appState }) => {
  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const dayData = appState.history[key];
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      score: dayData ? Math.round(dayData.score) : 0,
    };
  });

  const activeDays = data.filter(d => d.score > 10).length;
  const avgScore = Math.round(data.reduce((acc, curr) => acc + curr.score, 0) / 7);

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Weekly Progress</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-bold uppercase">Consistency</p>
            <p className="text-3xl font-black text-brand-600 mt-2">{activeDays}/7 <span className="text-sm font-medium text-gray-400">days</span></p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-bold uppercase">Avg. Completion</p>
            <p className="text-3xl font-black text-emerald-500 mt-2">{avgScore}%</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 h-64">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Last 7 Days</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
                cursor={{fill: '#f3f4f6'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="score" radius={[4, 4, 4, 4]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#22c55e' : entry.score > 50 ? '#3b82f6' : '#cbd5e1'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">📌 Weekly Checklist</h3>
        <ul className="space-y-3">
            {['Exercised 5 days', 'Learned coding 7 days', 'Edited 5+ videos', 'Slept on time', 'Improved discipline'].map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-600 text-sm">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded mr-3"></div>
                    {item}
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default WeeklyStats;