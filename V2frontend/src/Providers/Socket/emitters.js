import socket from './index'
import { useStoreState } from 'easy-peasy';

export function GetLobbyUpdates(gameId) {
    const authId = useStoreState((state) => state.authId);
    const body = {
        gameId: gameId
    }
    socket.emit('get-lobby-updates', authId, body)
}

export function Login() {
    const authId = useStoreState((state) => state.authId);
    socket.emit('login', authId)
}
