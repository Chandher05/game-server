import socket from './index'

var pushCommonData = (gameId) => {
    socket.emit('pushCommonData', gameId, localStorage.getItem('GameUserId'))
}

export default pushCommonData;