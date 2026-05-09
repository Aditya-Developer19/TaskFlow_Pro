import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import kanbanReducer from '../features/kanban/kanbanSlice';
import workspaceReducer from '../features/workspace/workspaceSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import focusReducer from '../features/focus/focusSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kanban: kanbanReducer,
    workspace: workspaceReducer,
    analytics: analyticsReducer,
    focus: focusReducer,
  },
});
