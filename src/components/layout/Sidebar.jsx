import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  BarChart3, 
  Settings, 
  Users, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { PreferencesContext } from '../../context/PreferencesContext';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

const navItems = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Boards', path: '/app/board/b-1', icon: KanbanSquare },
  { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  { name: 'Workspace', path: '/app/workspace', icon: Users },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useContext(PreferencesContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-surface-sidebarLight dark:bg-surface-sidebarDark border-r border-gray-200 dark:border-gray-800 transition-all duration-300 relative",
      sidebarCollapsed ? "w-[72px]" : "w-[240px]"
    )}>
      {/* Logo Area */}
      <a href="/" className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 shrink-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <img src="/favicon.svg" alt="Logo" className="w-8 h-8 shrink-0" />
        {!sidebarCollapsed && (
          <span className="ml-3 font-semibold text-gray-900 dark:text-white truncate">TaskFlow Pro</span>
        )}
      </a>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md transition-colors group",
                isActive 
                  ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300" 
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
              )}
            >
              <Icon className={cn("shrink-0", sidebarCollapsed ? "w-6 h-6 mx-auto" : "w-5 h-5 mr-3")} />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Dropdown
          align={sidebarCollapsed ? "left" : "right"}
          trigger={
            <button className="flex items-center w-full focus:outline-none">
              <Avatar 
                src={user?.photoURL} 
                initials={user?.displayName || user?.email} 
                size="md"
              />
              {!sidebarCollapsed && (
                <div className="ml-3 flex-1 text-left truncate">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              )}
            </button>
          }
        >
          <DropdownItem onClick={() => navigate('/app/settings')} icon={Settings}>
            Settings
          </DropdownItem>
          <DropdownItem onClick={handleSignOut} icon={LogOut} className="text-red-600 dark:text-red-400">
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-16 bg-white dark:bg-surface-cardDark border border-gray-200 dark:border-gray-800 rounded-full p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-sm z-10"
      >
        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
