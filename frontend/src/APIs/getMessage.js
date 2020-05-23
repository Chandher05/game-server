import socket from './index'

function getValue (cb) {
    socket.on('result', data => {
        cb(null, data)
    })
    socket.emit('getValue', 1000)
}

export default getValue;