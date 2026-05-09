import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageTransition from './PageTransition';
import { useContext, useEffect } from 'react';
import { PreferencesContext } from '../../context/PreferencesContext';
import { useDispatch, useSelector } from 'react-redux';
import { tickTimer } from '../../features/focus/focusSlice';

export default function AppShell() {
  const { sidebarCollapsed } = useContext(PreferencesContext);
  const dispatch = useDispatch();
  const timerRunning = useSelector(state => state.focus.timerRunning);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, dispatch]);
  
  return (
    <div className="flex h-screen overflow-hidden bg-surface-light dark:bg-surface-dark">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface-light dark:bg-surface-dark relative">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
