import socket from './index'

export async function Login() {
    const authId = sessionStorage.getItem('access_token')
    socket.emit('login', authId)
}

// Waiting Screen
export async function GetLobbyUpdates(gameId) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId
    }
    socket.emit('get-lobby-updates', authId, body)
}

export async function StartGame(gameId) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId
    }
    socket.emit('start-game', authId, body)
}

// Game common
export async function GetGameUpdates(gameId) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId
    }
    socket.emit('get-game-updates', authId, body)
}

export async function DropCards(gameId, selected, type) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId,
        selected: selected,
        type: type
    }
    socket.emit('drop-cards', authId, body)
}

export async function Declare(gameId) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId
    }
    socket.emit('declare', authId, body)
}

export async function LeaveGame(gameId) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId
    }
    socket.emit('leave-game', authId, body)
}

export async function Reactions(gameId, data) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId,
        data: data
    }
    socket.emit('reactions', authId, body)
}

// Game admin
export async function NextRound(gameId) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId
    }
    socket.emit('next-round', authId, body)
}

export async function RestartGame(gameId) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId
    }
    socket.emit('restart-game', authId, body)
}

export async function RemovePlayer(gameId, userId) {
    const authId = sessionStorage.getItem('access_token')
    const body = {
        gameId: gameId,
        userId: userId
    }
    socket.emit('remove-player', authId, body)
}