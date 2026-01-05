import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav.tsx';
import DailySchedule from './components/DailySchedule.tsx';
import ChallengePath from './components/ChallengePath.tsx';
import ProfileSettings from './components/ProfileSettings.tsx';
import WeeklyStats from './components/WeeklyStats.tsx';
import { AppState, WorkMode, UserSettings, CustomTask } from './types.ts';
import { loadState, saveState, getTodayKey } from './services/storageService.ts';
import { MORNING_ROUTINE, WORK_WFH, WORK_OFFICE, EVENING_ROUTINE } from './constants.ts';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(loadState());

  useEffect(() => {
    saveState(appState);
  }, [appState]);

  const updateTaskCompletion = (taskId: string, completed: boolean) => {
    const todayKey = getTodayKey();
    const currentDay = appState.history[todayKey] || { 
        date: todayKey, 
        completedTaskIds: [], 
        dailyNote: '', 
        score: 0 
    };

    let newCompletedIds = [...currentDay.completedTaskIds];
    if (completed) {
      if (!newCompletedIds.includes(taskId)) newCompletedIds.push(taskId);
    } else {
      newCompletedIds = newCompletedIds.filter(id => id !== taskId);
    }

    const workRoutine = appState.settings.workMode === WorkMode.WFH ? WORK_WFH : WORK_OFFICE;
    const customTasksCount = appState.customTasks.length;
    const totalTasks = MORNING_ROUTINE.length + workRoutine.length + EVENING_ROUTINE.length + customTasksCount;
    const score = totalTasks > 0 ? (newCompletedIds.length / totalTasks) * 100 : 0;

    const newHistory = {
      ...appState.history,
      [todayKey]: {
        ...currentDay,
        completedTaskIds: newCompletedIds,
        score
      }
    };

    setAppState({ ...appState, history: newHistory });
  };

  const updateDailyNote = (note: string) => {
    const todayKey = getTodayKey();
    const currentDay = appState.history[todayKey] || { 
        date: todayKey, 
        completedTaskIds: [], 
        dailyNote: '', 
        score: 0 
    };

    const newHistory = {
        ...appState.history,
        [todayKey]: {
            ...currentDay,
            dailyNote: note
        }
    };
    setAppState({ ...appState, history: newHistory });
  };

  const updateSettings = (settings: UserSettings) => {
    setAppState({ ...appState, settings });
  };

  const addCustomTask = (task: Omit<CustomTask, 'id'>) => {
    const newTask: CustomTask = {
        ...task,
        id: `custom-${Date.now()}`
    };
    setAppState({
        ...appState,
        customTasks: [...appState.customTasks, newTask]
    });
  };

  const removeCustomTask = (id: string) => {
    setAppState({
        ...appState,
        customTasks: appState.customTasks.filter(t => t.id !== id)
    });
  };

  const resetApp = () => {
    const defaultState: AppState = {
        settings: {
            name: '',
            goal: '',
            workMode: WorkMode.WFH,
            startDate: new Date().toISOString()
        },
        history: {},
        customTasks: []
    };
    setAppState(defaultState);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
          <Routes>
            <Route 
                path="/" 
                element={
                    <DailySchedule 
                        appState={appState} 
                        updateTaskCompletion={updateTaskCompletion}
                        updateDailyNote={updateDailyNote}
                        addCustomTask={addCustomTask}
                        removeCustomTask={removeCustomTask}
                    />
                } 
            />
            <Route 
                path="/challenge" 
                element={<ChallengePath appState={appState} />} 
            />
            <Route 
                path="/stats" 
                element={<WeeklyStats appState={appState} />} 
            />
            <Route 
                path="/profile" 
                element={
                    <ProfileSettings 
                        appState={appState} 
                        updateSettings={updateSettings}
                        resetApp={resetApp}
                    />
                } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </div>
      </div>
    </Router>
  );
};

export default App;