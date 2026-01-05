import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, X } from 'lucide-react';
import { AppState, WorkMode, TaskItem, CustomTask } from '../types.ts';
import { MORNING_ROUTINE, WORK_OFFICE, WORK_WFH, EVENING_ROUTINE } from '../constants.ts';
import { getTodayKey } from '../services/storageService.ts';

interface DailyScheduleProps {
  appState: AppState;
  updateTaskCompletion: (taskId: string, completed: boolean) => void;
  updateDailyNote: (note: string) => void;
  addCustomTask: (task: Omit<CustomTask, 'id'>) => void;
  removeCustomTask: (id: string) => void;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ 
  appState, 
  updateTaskCompletion, 
  updateDailyNote,
  addCustomTask,
  removeCustomTask
}) => {
  const todayKey = getTodayKey();
  const todayData = appState.history[todayKey] || { completedTaskIds: [], dailyNote: '' };
  
  const [isAddingTask, setIsAddingTask] = useState<'morning' | 'work' | 'evening' | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  const workRoutine = appState.settings.workMode === WorkMode.WFH ? WORK_WFH : WORK_OFFICE;

  const handleAddTask = (category: 'morning' | 'work' | 'evening') => {
    if (!newTaskTitle.trim()) return;
    addCustomTask({
        title: newTaskTitle,
        timeRange: newTaskTime || 'Anytime',
        category
    });
    setNewTaskTitle('');
    setNewTaskTime('');
    setIsAddingTask(null);
  };

  const renderSection = (title: string, tasks: Omit<TaskItem, 'isCompleted'>[], category: 'morning' | 'work' | 'evening', colorClass: string) => {
    const customTasks = appState.customTasks.filter(t => t.category === category);
    const allTasks = [...tasks, ...customTasks];
    
    return (
        <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`px-4 py-3 ${colorClass} font-bold text-white uppercase tracking-wide text-sm flex justify-between items-center`}>
            <span>{title}</span>
            <div className="flex items-center gap-3">
                <span className="text-xs opacity-90 font-normal">
                    {allTasks.filter(t => todayData.completedTaskIds.includes(t.id)).length} / {allTasks.length}
                </span>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsAddingTask(category); }}
                    className="bg-white/20 p-1 rounded-md hover:bg-white/30 transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
        <div className="divide-y divide-gray-100">
            {allTasks.map((task) => {
            const isCompleted = todayData.completedTaskIds.includes(task.id);
            const isCustom = task.id.startsWith('custom-');
            
            return (
                <div 
                    key={task.id} 
                    className={`flex items-center p-4 group transition-colors cursor-pointer ${isCompleted ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}
                >
                    <div 
                        onClick={() => updateTaskCompletion(task.id, !isCompleted)}
                        className="flex-1 flex items-center"
                    >
                        <div className={`mr-4 transition-transform ${isCompleted ? 'scale-110' : ''}`}>
                            {isCompleted ? (
                                <CheckCircle2 className="text-emerald-500 w-6 h-6" fill="currentColor" stroke="white" />
                            ) : (
                                <Circle className="text-gray-300 w-6 h-6" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-semibold text-gray-800 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                                {task.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{task.timeRange}</p>
                        </div>
                    </div>
                    {isCustom && (
                        <button 
                            onClick={() => removeCustomTask(task.id)}
                            className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            );
            })}
        </div>
        
        {isAddingTask === category && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">Add Custom Task</h4>
                    <button onClick={() => setIsAddingTask(null)} className="text-gray-400"><X size={16}/></button>
                </div>
                <input 
                    autoFocus
                    type="text" 
                    placeholder="Task name (e.g. Meditate)" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <input 
                    type="text" 
                    placeholder="Time (e.g. 6:00 - 6:30)" 
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <button 
                    onClick={() => handleAddTask(category)}
                    className="w-full py-2 bg-brand-600 text-white text-sm font-bold rounded-lg shadow-sm"
                >
                    Confirm Task
                </button>
            </div>
        )}
        </div>
    );
  };

  const customTasksCount = appState.customTasks.length;
  const totalTasks = MORNING_ROUTINE.length + workRoutine.length + EVENING_ROUTINE.length + customTasksCount;
  const completedCount = todayData.completedTaskIds.length;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="pb-32 pt-4 px-4 max-w-md mx-auto no-scrollbar overflow-y-auto h-full">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Today's Focus</h1>
          <p className="text-gray-500 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="text-right">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
           <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-brand-600">{progress}%</span>
           </div>
        </div>
      </div>

      <div className="h-2 w-full bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div 
            className="h-full bg-brand-500 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
        />
      </div>

      {renderSection('🌅 Morning', MORNING_ROUTINE, 'morning', 'bg-gradient-to-r from-orange-400 to-rose-400')}
      {renderSection(appState.settings.workMode === WorkMode.WFH ? '🏠 Work (WFH)' : '🏢 Work (Office)', workRoutine, 'work', 'bg-slate-700')}
      {renderSection('🌇 Evening', EVENING_ROUTINE, 'evening', 'bg-indigo-600')}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">✍️ Daily Note</h3>
        <p className="text-xs text-gray-500 mb-2">"What did I complete today?"</p>
        <textarea
          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none min-h-[80px]"
          placeholder="Reflect on your progress..."
          value={todayData.dailyNote || ''}
          onChange={(e) => updateDailyNote(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DailySchedule;