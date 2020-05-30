import socket from './index'

var gameStatus = (gameId, userId, cb) => {
    socket.on('status', data => {
        cb(data)
    })
    socket.emit('getGameStatus', gameId, userId)
}

export default gameStatus;