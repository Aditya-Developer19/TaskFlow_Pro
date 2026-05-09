import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentWorkspace: null,
  members: [],
  status: 'idle',
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
    },
  },
});

export const { setWorkspace, setMembers } = workspaceSlice.actions;
export default workspaceSlice.reducer;
