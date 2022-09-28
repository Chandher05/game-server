import socket from './index'
import { useStoreState } from 'easy-peasy';


export function Login() {
    const authId = useStoreState((state) => state.authId);
    socket.emit('login', authId)
}

// Waiting Screen
export function GetLobbyUpdates(gameId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId
    }
    socket.emit('get-lobby-updates', authId, body)
}

export function StartGame(gameId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId
    }
    socket.emit('start-game', authId, body)
}

// Game common
export function GetGameUpdates(gameId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId
    }
    socket.emit('get-game-updates', authId, body)
}

export function DropCards(gameId, selected, type) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId,
        selected: selected,
        type: type
    }
    socket.emit('drop-cards', authId, body)
}

export function Declare(gameId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId
    }
    socket.emit('declare', authId, body)
}

export function LeaveGame(gameId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId
    }
    socket.emit('leave-game', authId, body)
}

export function Reactions(gameId, data) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId,
        data: data
    }
    socket.emit('reactions', authId, body)
}

// Game admin
export function NextRound(gameId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId
    }
    socket.emit('next-round', authId, body)
}

export function RestartGame(gameId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId
    }
    socket.emit('restart-game', authId, body)
}

export function RemovePlayer(gameId, userId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId,
        userId: userId
    }
    socket.emit('remove-player', authId, body)
}