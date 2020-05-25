import socket from './index'

function getCurrentPlayer (gameId, userId, cb) {
    socket.on('currentPlayer', data => {
        cb(data.currentPlayer, data.playerCards)
    })
    socket.emit('getGameStatus', gameId, userId)
}

export default getCurrentPlayer;