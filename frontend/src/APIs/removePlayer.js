import socket from './index'

function removePlayer (userId, gameId, cb) {
    console.log(userId, gameId)
    socket.emit('removePlayer', userId, gameId)
}

export default removePlayer;