import socket from './index'

function getPlayers (gameId, cb) {
    socket.on('playersInGame', data => {
        cb(data.players, data.isStarted, data.createdUser)
    })
    socket.emit('getPlayers', gameId)
}

export default getPlayers;