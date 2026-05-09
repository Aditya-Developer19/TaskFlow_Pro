import { createAsyncThunk } from '@reduxjs/toolkit';
import { addTaskOptimistic, moveTaskOptimistic, reorderTaskOptimistic, updateTaskOptimistic, deleteTaskOptimistic, setStatus } from './kanbanSlice';
// We mock Firebase functions for now, the real ones would use db and doc
import toast from 'react-hot-toast';

export const addTask = createAsyncThunk(
  'kanban/addTask',
  async (taskData, { dispatch }) => {
    try {
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      dispatch(addTaskOptimistic({ task: newTask }));
      
      if (import.meta.env.VITE_USE_SEED_DATA !== 'true') {
        // await addDoc(collection(db, 'tasks'), newTask);
      }
      toast.success('Task created');
      return newTask;
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  }
);

export const moveTask = createAsyncThunk(
  'kanban/moveTask',
  async ({ taskId, fromColId, toColId, toIndex }, { dispatch }) => {
    try {
      dispatch(moveTaskOptimistic({ taskId, fromColId, toColId, toIndex }));
      
      if (import.meta.env.VITE_USE_SEED_DATA !== 'true') {
        // await updateDoc(doc(db, 'tasks', taskId), { columnId: toColId });
        // update column arrays in firebase if needed
      }
    } catch (error) {
      toast.error('Failed to move task');
      throw error;
    }
  }
);

export const reorderTask = createAsyncThunk(
  'kanban/reorderTask',
  async ({ columnId, fromIndex, toIndex }, { dispatch }) => {
    try {
      dispatch(reorderTaskOptimistic({ columnId, fromIndex, toIndex }));
      
      if (import.meta.env.VITE_USE_SEED_DATA !== 'true') {
        // save new order to backend
      }
    } catch (error) {
      toast.error('Failed to reorder task');
      throw error;
    }
  }
);

export const updateTask = createAsyncThunk(
  'kanban/updateTask',
  async ({ taskId, updates }, { dispatch }) => {
    try {
      dispatch(updateTaskOptimistic({ taskId, updates }));
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  }
);

export const deleteTask = createAsyncThunk(
  'kanban/deleteTask',
  async ({ taskId, columnId }, { dispatch }) => {
    try {
      dispatch(deleteTaskOptimistic({ taskId, columnId }));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  }
);
