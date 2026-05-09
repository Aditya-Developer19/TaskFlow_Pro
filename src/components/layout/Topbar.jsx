import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Command } from 'cmdk';
import { Dialog } from '../ui/Dialog';

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const tasks = useSelector((state) => state.kanban.tasks);
  const taskList = Object.values(tasks);
  const filteredTasks = taskList.filter((task) => 
    searchQuery && (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Parse location for breadcrumbs
  const pathParts = location.pathname.split('/').filter(Boolean);
  let breadcrumb = 'Dashboard';
  if (pathParts[1] === 'board') breadcrumb = 'Board / Product Roadmap';
  else if (pathParts[1]) breadcrumb = pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const ThemeIcon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun;

  return (
    <>
      <header className="h-14 bg-white dark:bg-surface-cardDark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center">
          <h1 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {breadcrumb}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center text-sm text-gray-500 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            <span>Search...</span>
            <kbd className="ml-4 font-sans text-xs opacity-50">⌘K</kbd>
          </button>
          <button 
            onClick={cycleTheme}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md"
          >
            <ThemeIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen} title="Search" className="p-0 overflow-hidden">
        <Command className="w-full bg-transparent" shouldFilter={false}>
          <div className="px-3 border-b border-gray-200 dark:border-gray-800">
            <Command.Input 
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Search tasks..." 
              className="w-full bg-transparent border-0 h-12 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-500"
            />
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-2">
            {!searchQuery && <Command.Empty className="p-4 text-sm text-center text-gray-500">Type to search tasks.</Command.Empty>}
            {searchQuery && filteredTasks.length === 0 && <Command.Empty className="p-4 text-sm text-center text-gray-500">No tasks found.</Command.Empty>}
            
            {filteredTasks.length > 0 && (
              <Command.Group heading="Tasks" className="text-xs text-gray-500 px-2 py-1 mt-2">
                {filteredTasks.map(task => (
                  <Command.Item 
                    key={task.id} 
                    value={task.title}
                    onSelect={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      navigate('/app/board');
                    }}
                    className="px-2 py-2 text-sm text-gray-900 dark:text-white rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
                  >
                    <span>{task.title}</span>
                    <span className="text-xs text-gray-400 capitalize">{task.priority}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            
            {!searchQuery && (
              <Command.Group heading="Navigation" className="text-xs text-gray-500 px-2 py-1 mt-2">
                <Command.Item 
                  onSelect={() => { setSearchOpen(false); navigate('/app/dashboard'); }}
                  className="px-2 py-2 text-sm text-gray-900 dark:text-white rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Go to Dashboard
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setSearchOpen(false); navigate('/app/board'); }}
                  className="px-2 py-2 text-sm text-gray-900 dark:text-white rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Go to Kanban Board
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </Dialog>
    </>
  );
}
