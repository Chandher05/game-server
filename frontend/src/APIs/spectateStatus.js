import socket from './index'

var spectateStatus = (gameId, userId, cb) => {
    socket.on('spectate', data => {
        cb(data)
    })
    socket.emit('getGameStatus', gameId, userId)
}

export default spectateStatus;