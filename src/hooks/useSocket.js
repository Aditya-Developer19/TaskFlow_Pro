import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { socketTaskMoved, socketTaskCreated, socketTaskUpdated, socketTaskDeleted } from '../features/kanban/kanbanSlice';

export const useSocket = (projectId) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const socketRef   = useRef(null);
  const dispatch    = useDispatch();

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  useEffect(() => {
    if (!accessToken || !projectId) return;

    socketRef.current = io('http://localhost:5000', {
      auth: { token: accessToken },
      transports: ['websocket'],
    });

    socketRef.current.emit('join:project', projectId);

    // Listen to real-time events and dispatch to Redux
    socketRef.current.on('task:moved',   (payload) => dispatch(socketTaskMoved(payload)));
    socketRef.current.on('task:created', (payload) => dispatch(socketTaskCreated(payload)));
    socketRef.current.on('task:updated', (payload) => dispatch(socketTaskUpdated(payload)));
    socketRef.current.on('task:deleted', (payload) => dispatch(socketTaskDeleted(payload)));

    return () => {
      socketRef.current.emit('leave:project', projectId);
      socketRef.current.disconnect();
    };
  }, [accessToken, projectId, dispatch]);

  return { socket: socketRef.current, emit };
};
