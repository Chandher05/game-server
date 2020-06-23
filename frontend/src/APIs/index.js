import openSocket from 'socket.io-client';
import backendURL from '../constants/connection';

const  socket = openSocket(`${backendURL}:8000/`);

socket.on('connect', () => {
    socket.emit('sendUserId', localStorage.getItem('GameUserId'))
})

export default socket;