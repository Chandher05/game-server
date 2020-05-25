import socket from './index'

var gameScores = (gameId, cb) => {
    socket.on('score', data => {
        cb(data)
    })
    socket.emit('getScores', gameId)
}

export default gameScores;