import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

// ─── Async Thunks (API) ──────────────────────────────────────────────────────

export const fetchTasks = createAsyncThunk('kanban/fetchTasks', async (projectId) => {
  const { data } = await api.get(`/tasks/project/${projectId}`);
  // Normalize: convert array to { id: task } map + rebuild column taskIds
  return data.data;
});

export const fetchProjects = createAsyncThunk('kanban/fetchProjects', async () => {
  const { data } = await api.get('/projects');
  return data.data;
});

export const createProjectAPI = createAsyncThunk('kanban/createProject', async (projectData) => {
  const { data } = await api.post('/projects', projectData);
  return data.data;
});

export const createTaskAPI = createAsyncThunk(
  'kanban/createTask',
  async ({ projectId, task }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/tasks/project/${projectId}`, task);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

export const moveTaskAPI = createAsyncThunk(
  'kanban/moveTask',
  async ({ taskId, toColumnId, toIndex }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}/move`, { toColumnId, toIndex });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to move task');
    }
  }
);

export const updateTaskAPI = createAsyncThunk(
  'kanban/updateTaskAPI',
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}`, updates);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTaskAPI = createAsyncThunk(
  'kanban/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      return taskId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_COLUMNS = [
  { id: 'todo',       title: 'To Do',       taskIds: [] },
  { id: 'inprogress', title: 'In Progress',  taskIds: [] },
  { id: 'review',     title: 'In Review',    taskIds: [] },
  { id: 'done',       title: 'Done',         taskIds: [] },
];

/** Rebuild columns.taskIds from a flat tasks array */
function buildColumns(tasks, baseColumns) {
  const cols = baseColumns.map((c) => ({ ...c, taskIds: [] }));
  const sorted = [...tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  sorted.forEach((t) => {
    const col = cols.find((c) => c.id === (t.columnId || 'todo'));
    if (col) col.taskIds.push(t._id || t.id);
  });
  return cols;
}

/** Convert tasks array to { id: task } map */
function toTasksMap(tasks) {
  return tasks.reduce((acc, t) => {
    const id = t._id || t.id;
    acc[id] = { ...t, id };
    return acc;
  }, {});
}

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState = {
  boards: {},
  projects: [],
  columns: DEFAULT_COLUMNS,
  tasks: {},
  status: 'idle',
  error: null,
  currentBoardId: null,
  currentProjectId: null,
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
    setCurrentProjectId: (state, action) => {
      state.currentProjectId = action.payload;
    },
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },

    // ─── Optimistic UI reducers (for drag-and-drop) ─────────────────────────
    addTaskOptimistic: (state, action) => {
      const { task } = action.payload;
      const id = task._id || task.id;
      state.tasks[id] = { ...task, id };
      const col = state.columns.find((c) => c.id === task.columnId);
      if (col) col.taskIds.push(id);
    },
    moveTaskOptimistic: (state, action) => {
      const { taskId, fromColId, toColId, toIndex } = action.payload;
      const fromCol = state.columns.find((c) => c.id === fromColId);
      if (fromCol) fromCol.taskIds = fromCol.taskIds.filter((id) => id !== taskId);
      const toCol = state.columns.find((c) => c.id === toColId);
      if (toCol) toCol.taskIds.splice(toIndex, 0, taskId);
      if (state.tasks[taskId]) state.tasks[taskId].columnId = toColId;
    },
    reorderTaskOptimistic: (state, action) => {
      const { columnId, fromIndex, toIndex } = action.payload;
      const col = state.columns.find((c) => c.id === columnId);
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
      const col = state.columns.find((c) => c.id === columnId);
      if (col) col.taskIds = col.taskIds.filter((id) => id !== taskId);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    // ─── Socket.io real-time reducers ───────────────────────────────────────
    socketTaskMoved: (state, action) => {
      const { taskId, toColumnId } = action.payload;
      const id = taskId?.toString?.() ?? taskId;
      if (state.tasks[id]) {
        const fromColId = state.tasks[id].columnId;
        const fromCol = state.columns.find((c) => c.id === fromColId);
        if (fromCol) fromCol.taskIds = fromCol.taskIds.filter((t) => t !== id);
        const toCol = state.columns.find((c) => c.id === toColumnId);
        if (toCol && !toCol.taskIds.includes(id)) toCol.taskIds.push(id);
        state.tasks[id].columnId = toColumnId;
      }
    },
    socketTaskCreated: (state, action) => {
      const task = action.payload;
      const id = task._id?.toString?.() ?? task._id;
      if (!state.tasks[id]) {
        state.tasks[id] = { ...task, id };
        const col = state.columns.find((c) => c.id === task.columnId);
        if (col && !col.taskIds.includes(id)) col.taskIds.push(id);
      }
    },
    socketTaskUpdated: (state, action) => {
      const task = action.payload;
      const id = task._id?.toString?.() ?? task._id;
      if (state.tasks[id]) state.tasks[id] = { ...state.tasks[id], ...task, id };
    },
    socketTaskDeleted: (state, action) => {
      const { taskId } = action.payload;
      const id = taskId?.toString?.() ?? taskId;
      if (state.tasks[id]) {
        const colId = state.tasks[id].columnId;
        const col = state.columns.find((c) => c.id === colId);
        if (col) col.taskIds = col.taskIds.filter((t) => t !== id);
        delete state.tasks[id];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.status = 'succeeded';
        state.tasks   = toTasksMap(payload);
        state.columns = buildColumns(payload, DEFAULT_COLUMNS);
      })
      .addCase(fetchTasks.rejected, (state, { error }) => {
        state.status = 'failed';
        state.error  = error.message;
      })
      // fetchProjects
      .addCase(fetchProjects.fulfilled, (state, { payload }) => {
        state.projects = payload;
      })
      // createProjectAPI
      .addCase(createProjectAPI.fulfilled, (state, { payload }) => {
        state.projects.push(payload);
      })
      // createTaskAPI
      .addCase(createTaskAPI.fulfilled, (state, { payload }) => {
        const id = payload._id?.toString?.() ?? payload._id;
        state.tasks[id] = { ...payload, id };
        const col = state.columns.find((c) => c.id === payload.columnId);
        if (col && !col.taskIds.includes(id)) col.taskIds.push(id);
      })
      // moveTaskAPI
      .addCase(moveTaskAPI.fulfilled, (state, { payload }) => {
        const id = payload._id?.toString?.() ?? payload._id;
        if (state.tasks[id]) state.tasks[id] = { ...state.tasks[id], ...payload, id };
      })
      // updateTaskAPI
      .addCase(updateTaskAPI.fulfilled, (state, { payload }) => {
        const id = payload._id?.toString?.() ?? payload._id;
        if (state.tasks[id]) state.tasks[id] = { ...state.tasks[id], ...payload, id };
      })
      // deleteTaskAPI
      .addCase(deleteTaskAPI.fulfilled, (state, { payload: taskId }) => {
        if (state.tasks[taskId]) {
          const colId = state.tasks[taskId].columnId;
          const col = state.columns.find((c) => c.id === colId);
          if (col) col.taskIds = col.taskIds.filter((id) => id !== taskId);
          delete state.tasks[taskId];
        }
      });
  },
});

export const {
  setBoards, setCurrentBoardId, setCurrentProjectId, setColumns, setTasks,
  addTaskOptimistic, moveTaskOptimistic, reorderTaskOptimistic,
  updateTaskOptimistic, deleteTaskOptimistic,
  setStatus,
  socketTaskMoved, socketTaskCreated, socketTaskUpdated, socketTaskDeleted,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;

