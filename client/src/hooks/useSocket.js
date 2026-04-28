import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import CONFIG from '../config'; // Use config instead of env

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Connect to the socket server using the API_BASE_URL (removing '/api')
      const socketUrl = CONFIG.API_BASE_URL.replace('/api', '');
      const newSocket = io(socketUrl, {
        transports: ['websocket', 'polling']
      });

      // Once connected, join the user's specific room
      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        newSocket.emit('join_room', user._id);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return socket;
};
