import { Settings, ListTodo, Play, Pause, Square } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { startTimer, pauseTimer, resetTimer, setTime } from '../features/focus/focusSlice';
import { Button } from '../components/ui/Button';

export default function WorkspacePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { timeLeft, timerRunning: isRunning, sessionDuration } = useSelector((state) => state.focus);

  const toggleTimer = () => {
    if (isRunning) dispatch(pauseTimer());
    else dispatch(startTimer());
  };

  const reset = () => dispatch(resetTimer());

  const configureTime = () => {
    const mins = window.prompt("Enter focus time in minutes:", Math.floor(sessionDuration / 60));
    if (mins && !isNaN(mins) && parseInt(mins) > 0) {
      dispatch(setTime(parseInt(mins) * 60));
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionDuration - timeLeft) / sessionDuration) * 100;
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-surface-light dark:bg-surface-dark overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Timer Circle */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center mb-12">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle 
              cx="50" cy="50" r="46" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="4" 
              className="text-gray-200 dark:text-brand-900/20" 
            />
            {/* Progress Circle */}
            <circle 
              cx="50" cy="50" r="46" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-brand-500 transition-all duration-1000 ease-linear" 
            />
          </svg>
          <div className="z-10 flex flex-col items-center">
            <span className="text-xl font-medium text-brand-600 dark:text-brand-400 mb-2">Focus</span>
            <span className="text-6xl sm:text-7xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4 mb-12">
          <Button 
            size="lg" 
            className={`px-8 h-14 text-lg rounded-full shadow-lg ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand-600 hover:bg-brand-700'}`}
            onClick={toggleTimer}
          >
            {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isRunning ? 'Pause Session' : 'Start Focus Session'}
          </Button>
          <Button 
            size="lg" 
            variant="secondary" 
            className="w-14 h-14 rounded-full p-0 flex items-center justify-center bg-white dark:bg-surface-cardDark shadow-lg border border-gray-200 dark:border-gray-800"
            onClick={reset}
          >
            <Square className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={configureTime} className="bg-white/50 dark:bg-surface-cardDark/50 border-gray-200 dark:border-gray-800 rounded-lg">
            <Settings className="w-4 h-4 mr-2 text-gray-500" /> Configure
          </Button>
          <Button variant="outline" onClick={() => navigate('/app/board')} className="bg-white/50 dark:bg-surface-cardDark/50 border-gray-200 dark:border-gray-800 rounded-lg">
            <ListTodo className="w-4 h-4 mr-2 text-gray-500" /> Todo
          </Button>
        </div>
      </div>
    </div>
  );
}
