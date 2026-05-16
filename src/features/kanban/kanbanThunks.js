/**
 * kanbanThunks.js
 *
 * These are the "orchestration" thunks called by UI components.
 * They apply optimistic updates immediately, then persist to the API.
 * The underlying API thunks live in kanbanSlice.js.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
  addTaskOptimistic,
  moveTaskOptimistic,
  reorderTaskOptimistic,
  updateTaskOptimistic,
  deleteTaskOptimistic,
  setStatus,
  createTaskAPI,
  moveTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
} from './kanbanSlice';

// ─── Add Task ─────────────────────────────────────────────────────────────────
export const addTask = createAsyncThunk(
  'kanban/addTask',
  async (taskData, { dispatch, getState }) => {
    const { currentProjectId } = getState().kanban;
    try {
      // Optimistic add with temp id
      const tempId = `temp-${Date.now()}`;
      const optimisticTask = {
        ...taskData,
        id: tempId,
        _id: tempId,
        createdAt: new Date().toISOString(),
      };
      dispatch(addTaskOptimistic({ task: optimisticTask }));

      if (currentProjectId) {
        const result = await dispatch(createTaskAPI({ projectId: currentProjectId, task: taskData })).unwrap();
        toast.success('Task created');
        return result;
      } else {
        toast.success('Task created (local)');
        return optimisticTask;
      }
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  }
);

// ─── Move Task ────────────────────────────────────────────────────────────────
export const moveTask = createAsyncThunk(
  'kanban/moveTask',
  async ({ taskId, fromColId, toColId, toIndex }, { dispatch, getState }) => {
    try {
      // Optimistic update first (instant UI feedback)
      dispatch(moveTaskOptimistic({ taskId, fromColId, toColId, toIndex }));

      const { tasks } = getState().kanban;
      if (tasks[taskId]?._id && !taskId.startsWith('temp-')) {
        await dispatch(moveTaskAPI({ taskId, toColumnId: toColId, toIndex })).unwrap();
      }
    } catch (error) {
      toast.error('Failed to move task');
      throw error;
    }
  }
);

// ─── Reorder Task (same column) ───────────────────────────────────────────────
export const reorderTask = createAsyncThunk(
  'kanban/reorderTask',
  async ({ columnId, fromIndex, toIndex }, { dispatch }) => {
    try {
      dispatch(reorderTaskOptimistic({ columnId, fromIndex, toIndex }));
      // Could call a reorder API here in future
    } catch (error) {
      toast.error('Failed to reorder task');
      throw error;
    }
  }
);

// ─── Update Task ──────────────────────────────────────────────────────────────
export const updateTask = createAsyncThunk(
  'kanban/updateTask',
  async ({ taskId, updates }, { dispatch }) => {
    try {
      dispatch(updateTaskOptimistic({ taskId, updates }));

      if (!taskId.startsWith('temp-')) {
        await dispatch(updateTaskAPI({ taskId, updates })).unwrap();
      }
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  }
);

// ─── Delete Task ──────────────────────────────────────────────────────────────
export const deleteTask = createAsyncThunk(
  'kanban/deleteTask',
  async ({ taskId, columnId }, { dispatch }) => {
    try {
      dispatch(deleteTaskOptimistic({ taskId, columnId }));

      if (!taskId.startsWith('temp-')) {
        await dispatch(deleteTaskAPI(taskId)).unwrap();
      }
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  }
);

