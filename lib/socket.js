// lib/socket.ts
import { io } from 'socket.io-client';

const socket = io('https://task-manager-server-kjip.onrender.com', {
  transports: ['websocket'],
  autoConnect: true,
  path: '/socket.io', // Default path
});

socket.on('connect', () => {
  console.log('✅ Socket connected from client:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ Socket connection error:', err.message);
});

export default socket;
