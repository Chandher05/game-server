import socket from './index'
import { getIdTokenOfUser } from '../Firebase/config'

export async function Login() {
    const authId = await getIdTokenOfUser();
    socket.emit('login', authId)
}

// Waiting Screen
export async function GetLobbyUpdates(gameId) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId
    }
    socket.emit('get-lobby-updates', authId, body)
}

export async function StartGame(gameId) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId
    }
    socket.emit('start-game', authId, body)
}

// Game common
export async function GetGameUpdates(gameId) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId
    }
    socket.emit('get-game-updates', authId, body)
}

export async function DropCards(gameId, selected, type) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId,
        selected: selected,
        type: type
    }
    socket.emit('drop-cards', authId, body)
}

export async function Declare(gameId) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId
    }
    socket.emit('declare', authId, body)
}

export async function LeaveGame(gameId) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId
    }
    socket.emit('leave-game', authId, body)
}

export async function Reactions(gameId, data) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId,
        data: data
    }
    socket.emit('reactions', authId, body)
}

// Game admin
export async function NextRound(gameId) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId
    }
    socket.emit('next-round', authId, body)
}

export async function RestartGame(gameId) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId
    }
    socket.emit('restart-game', authId, body)
}

export async function RemovePlayer(gameId, userId) {
    const authId = await getIdTokenOfUser();
    const body = {
        gameId: gameId,
        userId: userId
    }
    socket.emit('remove-player', authId, body)
}