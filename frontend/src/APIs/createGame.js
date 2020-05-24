import socket from './index'

function getPlayers (gameId, cb) {
    socket.on('playersInGame', data => {
        cb(null, data.players, data.isStarted)
    })
    socket.emit('getPlayers', gameId)
}

export default getPlayers;