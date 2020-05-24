import socket from './index'

var getMyCards = (gameId, cb) => {
    socket.on('currentCards', data => {
        cb(data.cardOnTop, data.previousDroppedCards, data.previousDroppedPlayer)
    })
    socket.emit('getGameStatus', gameId)
}

export default getMyCards;