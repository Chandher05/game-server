import socket from './index'

function getAllPlayers (gameId, cb) {
    socket.on('allPlayers', data => {
        cb(data.currentPlayer, data.playerCards, data.hostPlayer, data.gameStatus, data.player, data.action)
    })
    socket.emit('getOtherPlayers', gameId)
}

export default getAllPlayers;