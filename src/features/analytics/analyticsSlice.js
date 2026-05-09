import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
  status: 'idle',
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalyticsData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setAnalyticsData } = analyticsSlice.actions;
export default analyticsSlice.reducer;
