import socket from './index'

export function LobbyListener(cb) {
    socket.on('lobby-listener', (status, data, err) => {
        cb(status, data, err)
    })
}

export function CommonGameData(cb) {
    socket.on('common-game-data', (arg1, arg2, arg3) => {
        console.log(arg1)
        console.log(arg2)
        console.log(arg3)
    })
}