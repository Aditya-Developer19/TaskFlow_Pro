import { useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import { Clock, CheckCircle2, Flame, Trophy } from 'lucide-react';

export default function AnalyticsPage() {
  const { sessions, streak, bestStreak } = useSelector((state) => state.focus);
  
  // Calculate today's metrics
  const today = new Date().toDateString();
  const todaysSessions = sessions.filter(s => new Date(s.date).toDateString() === today);
  const todayFocusTime = todaysSessions.reduce((acc, curr) => acc + curr.duration, 0);
  
  // Calculate total metrics
  const totalFocusTime = sessions.reduce((acc, curr) => acc + curr.duration, 0);
  
  const uniqueDays = new Set(sessions.map(s => new Date(s.date).toDateString())).size;
  const avgFocusDay = uniqueDays > 0 ? totalFocusTime / uniqueDays : 0;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // Calendar Heatmap Logic
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const calendarGrid = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = new Date(year, month, i).toDateString();
    const hasFocus = sessions.some(s => new Date(s.date).toDateString() === dateStr);
    calendarGrid.push({ day: i, hasFocus });
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 overflow-y-auto h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500">Track your focus and productivity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        
        {/* Left Column: Today's Focus & Streaks */}
        <div className="lg:col-span-1 space-y-6">
          
          <Card className="p-6 bg-surface-card dark:bg-[#1C212B] border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center text-brand-500 mb-4">
              <Clock className="w-5 h-5 mr-2" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Today&apos;s Focus</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-50 dark:bg-[#1A2235] p-4 rounded-xl flex flex-col items-center justify-center border border-brand-100 dark:border-brand-900/30">
                <Clock className="w-5 h-5 text-brand-500 mb-2" />
                <span className="text-sm text-brand-600 dark:text-brand-400 mb-1 text-center">Focus Time</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white text-center">{formatTime(todayFocusTime)}</span>
              </div>
              <div className="bg-brand-50 dark:bg-[#1A2235] p-4 rounded-xl flex flex-col items-center justify-center border border-brand-100 dark:border-brand-900/30">
                <CheckCircle2 className="w-5 h-5 text-brand-500 mb-2" />
                <span className="text-sm text-brand-600 dark:text-brand-400 mb-1 text-center">Sessions</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white text-center">{todaysSessions.length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-surface-card dark:bg-[#1C212B] border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center text-orange-500 mb-4">
              <Flame className="w-5 h-5 mr-2" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Streaks</h2>
            </div>
            {todayFocusTime > 0 ? (
              <p className="text-sm text-green-600 dark:text-green-400 mb-6 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" /> Today&apos;s focus goal complete! Streak is secure.
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-6">Complete a session today to keep your streak alive.</p>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-[#2A1D16] p-4 rounded-xl flex flex-col items-center justify-center border border-orange-100 dark:border-orange-900/30">
                <Flame className="w-5 h-5 text-orange-500 mb-2" />
                <span className="text-sm text-orange-600 dark:text-orange-400 mb-1 text-center">Current Streak</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white text-center">{streak} day{streak !== 1 && 's'}</span>
              </div>
              <div className="bg-yellow-50 dark:bg-[#2A2416] p-4 rounded-xl flex flex-col items-center justify-center border border-yellow-100 dark:border-yellow-900/30">
                <Trophy className="w-5 h-5 text-yellow-500 mb-2" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400 mb-1 text-center">Best Streak</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white text-center">{bestStreak} days</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Calendar Heatmap */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-surface-card dark:bg-[#1C212B] border-gray-200 dark:border-gray-800 h-full flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-8">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 pb-2">
                  {day}
                </div>
              ))}
              
              {calendarGrid.map((cell, index) => (
                <div 
                  key={index} 
                  className={`aspect-square rounded-md flex items-center justify-center text-sm
                    ${!cell ? 'bg-transparent' : 
                      cell.hasFocus ? 'bg-brand-500 text-white font-medium shadow-sm ring-1 ring-brand-600/50' : 
                      'bg-gray-100 dark:bg-[#2A3142] text-gray-600 dark:text-gray-400'}
                  `}
                >
                  {cell?.day || ''}
                </div>
              ))}
            </div>

            <div className="mt-auto grid grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-[#162A1F] p-4 rounded-xl flex flex-col items-center justify-center border border-green-100 dark:border-green-900/30">
                <span className="text-xs text-green-600 dark:text-green-400 mb-1 text-center">Days Focused</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white text-center">{uniqueDays} of {daysInMonth}</span>
              </div>
              <div className="bg-green-50 dark:bg-[#162A1F] p-4 rounded-xl flex flex-col items-center justify-center border border-green-100 dark:border-green-900/30">
                <span className="text-xs text-green-600 dark:text-green-400 mb-1 text-center">Avg Focus Day</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white text-center">{formatTime(avgFocusDay)}</span>
              </div>
              <div className="bg-green-50 dark:bg-[#162A1F] p-4 rounded-xl flex flex-col items-center justify-center border border-green-100 dark:border-green-900/30">
                <span className="text-xs text-green-600 dark:text-green-400 mb-1 text-center">Total Focus</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white text-center">{formatTime(totalFocusTime)}</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
