import socket from './index'

function spectateGame (userId, gameId, cb) {
    socket.emit('spectateGame', userId, gameId)
}

export default spectateGame;