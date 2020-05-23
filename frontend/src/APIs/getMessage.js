import socket from './index'

function getValue (cb) {
    socket.on('playersInGame', data => {
        cb(null, data)
    })
    socket.emit('getPlayers', localStorage.getItem('GameUserId'))
}

export default getValue;