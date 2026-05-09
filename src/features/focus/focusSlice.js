import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessions: [],
  streak: 0,
  bestStreak: 0,
  timerRunning: false,
  timeLeft: 25 * 60,
  sessionDuration: 25 * 60,
  totalFocusedToday: 0, // Accumulated time in seconds
};

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.timerRunning = true;
    },
    pauseTimer: (state) => {
      state.timerRunning = false;
    },
    resetTimer: (state) => {
      state.timerRunning = false;
      state.timeLeft = 25 * 60;
    },
    setTime: (state, action) => {
      state.timerRunning = false;
      state.timeLeft = action.payload;
      state.sessionDuration = action.payload;
    },
    tickTimer: (state) => {
      if (state.timerRunning && state.timeLeft > 0) {
        state.timeLeft -= 1;
        state.totalFocusedToday += 1;
      } else if (state.timerRunning && state.timeLeft === 0) {
        state.timerRunning = false;
        state.sessions.push({
          id: `session-${Date.now()}`,
          duration: state.sessionDuration,
          date: new Date().toISOString(),
          completed: true,
        });
        if (state.streak === 0) {
          state.streak = 1;
        }
        if (state.streak > state.bestStreak) {
          state.bestStreak = state.streak;
        }
      }
    }
  },
});

export const { startTimer, pauseTimer, resetTimer, setTime, tickTimer } = focusSlice.actions;
export default focusSlice.reducer;
