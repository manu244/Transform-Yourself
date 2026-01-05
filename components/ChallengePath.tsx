import React from 'react';
import { Lock, Check } from 'lucide-react';
import { AppState } from '../types.ts';
import { CHALLENGE_PHASES } from '../constants.ts';
import { calculateDaysSinceStart } from '../services/storageService.ts';

interface ChallengePathProps {
  appState: AppState;
}

const ChallengePath: React.FC<ChallengePathProps> = ({ appState }) => {
  const currentDay = calculateDaysSinceStart(appState.settings.startDate);
  
  const isDayCompleted = (dayNum: number) => {
    const startDate = new Date(appState.settings.startDate);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + (dayNum - 1));
    const dateKey = targetDate.toISOString().split('T')[0];
    
    const dayData = appState.history[dateKey];
    if (!dayData) return false;
    return dayData.score > 50;
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">30-Day Path</h1>
        <p className="text-gray-500 text-sm">Day {Math.max(1, Math.min(30, currentDay))} of 30</p>
      </div>

      <div className="space-y-8">
        {CHALLENGE_PHASES.map((phase) => (
            <div key={phase.phase} className={`relative rounded-3xl p-5 border-2 ${phase.borderColor} ${phase.bgLight} overflow-hidden`}>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded text-white ${phase.color} mb-2 inline-block`}>
                            DAYS {phase.days[0]}–{phase.days[1]}
                        </span>
                        <h2 className={`text-xl font-bold ${phase.textColor}`}>{phase.title}</h2>
                    </div>
                </div>
                
                <p className="text-sm text-gray-700 font-medium mb-1">Goal: {phase.goal}</p>
                <p className="text-xs text-gray-500 italic mb-4">"{phase.prompt}"</p>

                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: phase.days[1] - phase.days[0] + 1 }, (_, i) => {
                        const dayNum = phase.days[0] + i;
                        const isPast = dayNum < currentDay;
                        const isToday = dayNum === currentDay;
                        const completed = isDayCompleted(dayNum);

                        let bgClass = "bg-white";
                        let icon = <span className="text-xs font-bold text-gray-400">{dayNum}</span>;
                        let borderClass = "border-gray-200";

                        if (isToday) {
                            bgClass = phase.color;
                            borderClass = phase.borderColor;
                            icon = <span className="text-xs font-bold text-white">{dayNum}</span>;
                        } else if (completed) {
                            bgClass = "bg-emerald-100";
                            borderClass = "border-emerald-300";
                            icon = <Check size={14} className="text-emerald-600" />;
                        } else if (isPast) {
                            bgClass = "bg-red-50";
                            borderClass = "border-red-200";
                            icon = <span className="text-xs font-bold text-red-300">{dayNum}</span>;
                        } else {
                            icon = <Lock size={12} className="text-gray-300" />;
                        }

                        return (
                            <div 
                                key={dayNum}
                                className={`aspect-square rounded-xl border ${borderClass} ${bgClass} flex items-center justify-center shadow-sm transition-transform ${isToday ? 'scale-110 shadow-md z-10' : ''}`}
                            >
                                {icon}
                            </div>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengePath;