import openSocket from 'socket.io-client';
import backendURL from '../constants/connection';

const  socket = openSocket(`${backendURL}:8000/`);

export default socket;