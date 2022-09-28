import socket from './index'
import { showNotification } from '@mantine/notifications';

export function LobbyListener(cb) {
    socket.on('lobby-listener', (status, data, err) => {
        if (data == "ERROR") {
            showNotification({
                variant: 'outline',
                color: 'red',
                title: 'Something went wrong!',
                message: err
            })
        } else {
            cb(status, data)
        }
    })
}

export function CommonGameData(cb) {
    socket.on('common-game-data', (status, data, err) => {
        if (data == "ERROR") {
            showNotification({
                variant: 'outline',
                color: 'red',
                title: 'Something went wrong!',
                message: err
            })
        } else {
            cb(status, data)
        }
    })
}

export function CardsInHand(cb) {
    socket.on('cards-in-hand', (status, data, err) => {
        if (data == "ERROR") {
            showNotification({
                variant: 'outline',
                color: 'red',
                title: 'Something went wrong!',
                message: err
            })
        } else {
            cb(status, data)
        }
    })
}

export function Reactions(cb) {
    socket.on('reactions', (status, data, err) => {
        if (data == "ERROR") {
            showNotification({
                variant: 'outline',
                color: 'red',
                title: 'Something went wrong!',
                message: err
            })
        } else {
            cb(status, data)
        }
    })
}