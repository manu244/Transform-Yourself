import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Briefcase, Home, Download } from 'lucide-react';
import { AppState, WorkMode } from '../types.ts';

interface ProfileSettingsProps {
  appState: AppState;
  updateSettings: (settings: any) => void;
  resetApp: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ appState, updateSettings, resetApp }) => {
  const [name, setName] = useState(appState.settings.name);
  const [goal, setGoal] = useState(appState.settings.goal);
  const [isEditing, setIsEditing] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  const handleSave = () => {
    updateSettings({ ...appState.settings, name, goal });
    setIsEditing(false);
  };

  const toggleWorkMode = (mode: WorkMode) => {
    updateSettings({ ...appState.settings, workMode: mode });
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile & Settings</h1>

      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="w-full mb-6 bg-gradient-to-r from-brand-600 to-brand-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-lg"><Download size={24} /></div>
             <div className="text-left">
                <p className="font-bold text-sm">Install App</p>
                <p className="text-xs opacity-90">Add to Home Screen</p>
             </div>
          </div>
          <span className="bg-white text-brand-600 text-xs font-bold px-3 py-1.5 rounded-full">Install</span>
        </button>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Name</label>
          {isEditing ? (
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b-2 border-brand-500 py-1 text-lg font-semibold focus:outline-none"
            />
          ) : (
            <p className="text-lg font-semibold text-gray-800">{appState.settings.name || 'Your Name'}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Main Goal</label>
           {isEditing ? (
            <input 
              type="text" 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)}
              className="w-full border-b-2 border-brand-500 py-1 text-base text-gray-700 focus:outline-none"
            />
          ) : (
            <p className="text-base text-gray-700">{appState.settings.goal || 'No goal set yet.'}</p>
          )}
        </div>

        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${isEditing ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          {isEditing ? <><Save size={18} /> Save Profile</> : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Work Mode</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => toggleWorkMode(WorkMode.WFH)}
            className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${appState.settings.workMode === WorkMode.WFH ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-400'}`}
          >
            <Home size={24} />
            <span className="text-sm font-bold">WFH</span>
          </button>
          <button 
            onClick={() => toggleWorkMode(WorkMode.OFFICE)}
            className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${appState.settings.workMode === WorkMode.OFFICE ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-400'}`}
          >
            <Briefcase size={24} />
            <span className="text-sm font-bold">Office</span>
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <button 
          onClick={() => {
            if(window.confirm('Are you sure? This will delete all progress.')) {
              resetApp();
            }
          }}
          className="w-full py-4 text-red-500 font-medium text-sm flex items-center justify-center gap-2 opacity-80 hover:opacity-100"
        >
          <RefreshCw size={16} />
          Reset All Data
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;