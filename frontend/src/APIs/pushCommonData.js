import socket from './index'

var pushCommonData = (gameId) => {
    socket.emit('pushCommonData', gameId)
}

export default pushCommonData;