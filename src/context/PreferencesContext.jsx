import { createContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const PreferencesContext = createContext({
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  defaultView: 'kanban',
  setDefaultView: () => {},
  notificationsEnabled: true,
  setNotificationsEnabled: () => {},
});

export function PreferencesProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const [defaultView, setDefaultView] = useLocalStorage('default-view', 'kanban');
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notifications', true);

  return (
    <PreferencesContext.Provider value={{
      sidebarCollapsed, setSidebarCollapsed,
      defaultView, setDefaultView,
      notificationsEnabled, setNotificationsEnabled
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}
