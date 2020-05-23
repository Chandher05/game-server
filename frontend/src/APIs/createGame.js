import socket from './index'

function getPlayers (gameId, cb) {
    socket.on('playersInGame', data => {
        cb(null, data)
    })
    socket.emit('getPlayers', gameId)
}

export default getPlayers;