import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, X } from 'lucide-react';

export default function ZenFocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            playSound();
            if (mode === 'focus') {
              setSessions(prev => prev + 1);
              setMode('break');
              setMinutes(breakDuration);
            } else {
              setMode('focus');
              setMinutes(focusDuration);
            }
            setSeconds(0);
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode, focusDuration, breakDuration]);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setMinutes(focusDuration);
    setSeconds(0);
  };

  const progress = mode === 'focus' 
    ? ((focusDuration * 60 - (minutes * 60 + seconds)) / (focusDuration * 60)) * 100
    : ((breakDuration * 60 - (minutes * 60 + seconds)) / (breakDuration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center p-4 font-sans">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2m98OScTgwOUKbh8bllHQU2jtryzn0vBSR1xe/glEILElyx6OyrWBUIRp3e8sFuJAUqfsrw3I4+CRZnuvDmnVEMDU6k4PK8aB8GM4/Y8tGBMgYlcsXv4ZhECxFYr+ftrV0WB0Kb3PLDcSYEKHzH8N+SQQsQVrLl67RgGQU0jNXx1IU2Bydwwu3jm0cLDlOo4PG8aiAFMYzW8dKFOAYmb7/s5Z5JCw5Qp+Dyvmkgg" />
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-wide">Zen Focus</h1>
          <p className="text-slate-500 text-sm font-light">
            {mode === 'focus' ? 'Deep work session' : 'Take a mindful break'}
          </p>
        </div>

        {/* Main Timer Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 mb-8 relative overflow-hidden">
          {/* Progress bar background */}
          <div className="absolute top-0 left-0 h-1 w-full bg-slate-100">
            <div 
              className={`h-full transition-all duration-1000 ${mode === 'focus' ? 'bg-slate-700' : 'bg-emerald-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="text-8xl font-extralight text-slate-800 tracking-tight mb-4">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className={`inline-block px-4 py-1 rounded-full text-xs font-medium tracking-wide ${
              mode === 'focus' 
                ? 'bg-slate-100 text-slate-700' 
                : 'bg-emerald-50 text-emerald-700'
            }`}>
              {mode === 'focus' ? 'FOCUS TIME' : 'BREAK TIME'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={resetTimer}
              className="p-4 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
              aria-label="Reset"
            >
              <RotateCcw size={24} />
            </button>
            
            <button
              onClick={toggleTimer}
              className={`p-6 rounded-full transition-all shadow-lg ${
                mode === 'focus'
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
              aria-label={isActive ? 'Pause' : 'Play'}
            >
              {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-4 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
              aria-label="Settings"
            >
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* Sessions Counter */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full">
            <span className="text-slate-600 text-sm font-light">Sessions completed today</span>
            <span className="text-2xl font-light text-slate-800">{sessions}</span>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-slate-800">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Focus Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={focusDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 25;
                      setFocusDuration(val);
                      if (mode === 'focus' && !isActive) {
                        setMinutes(val);
                        setSeconds(0);
                      }
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={breakDuration}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 5;
                      setBreakDuration(val);
                      if (mode === 'break' && !isActive) {
                        setMinutes(val);
                        setSeconds(0);
                      }
                    }}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
