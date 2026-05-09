import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  boards: {},
  columns: [
    { id: 'todo', title: 'To Do', taskIds: [] },
    { id: 'inprogress', title: 'In Progress', taskIds: [] },
    { id: 'review', title: 'In Review', taskIds: [] },
    { id: 'done', title: 'Done', taskIds: [] },
  ],
  tasks: {},
  status: 'idle',
  error: null,
  currentBoardId: null,
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.boards = action.payload;
    },
    setCurrentBoardId: (state, action) => {
      state.currentBoardId = action.payload;
    },
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTaskOptimistic: (state, action) => {
      const { task } = action.payload;
      state.tasks[task.id] = task;
      const col = state.columns.find(c => c.id === task.columnId);
      if (col) col.taskIds.push(task.id);
    },
    moveTaskOptimistic: (state, action) => {
      const { taskId, fromColId, toColId, toIndex } = action.payload;
      
      const fromCol = state.columns.find(c => c.id === fromColId);
      if (fromCol) {
        fromCol.taskIds = fromCol.taskIds.filter(id => id !== taskId);
      }
      
      const toCol = state.columns.find(c => c.id === toColId);
      if (toCol) {
        toCol.taskIds.splice(toIndex, 0, taskId);
      }
      
      if (state.tasks[taskId]) {
        state.tasks[taskId].columnId = toColId;
      }
    },
    reorderTaskOptimistic: (state, action) => {
      const { columnId, fromIndex, toIndex } = action.payload;
      const col = state.columns.find(c => c.id === columnId);
      if (col) {
        const [movedId] = col.taskIds.splice(fromIndex, 1);
        col.taskIds.splice(toIndex, 0, movedId);
      }
    },
    updateTaskOptimistic: (state, action) => {
      const { taskId, updates } = action.payload;
      if (state.tasks[taskId]) {
        state.tasks[taskId] = { ...state.tasks[taskId], ...updates };
      }
    },
    deleteTaskOptimistic: (state, action) => {
      const { taskId, columnId } = action.payload;
      delete state.tasks[taskId];
      const col = state.columns.find(c => c.id === columnId);
      if (col) {
        col.taskIds = col.taskIds.filter(id => id !== taskId);
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setBoards, setCurrentBoardId, setColumns, setTasks,
  addTaskOptimistic, moveTaskOptimistic, reorderTaskOptimistic,
  updateTaskOptimistic, deleteTaskOptimistic,
  setStatus,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
