import openSocket from 'socket.io-client';
import uuid from 'react-uuid';

const  socket = openSocket(import.meta.env.VITE_SOCKET, {
    extraHeaders: {
        sysid: uuid()
    }
});

export default socket;