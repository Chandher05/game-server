import socket from './index'
import { showNotification } from '@mantine/notifications';
let errorTime = {
    LobbyListener: Date.now(),
    CommonGameData: Date.now(),
    CardsInHand: Date.now(),
    Reactions: Date.now()
}

export function LobbyListener(cb) {
    socket.on('lobby-listener', (status, data) => {
        if (status == "ERROR" && Date.now() - errorTime.LobbyListener > 1000) {
            errorTime.LobbyListener = Date.now()
            showNotification({
                variant: 'outline',
                color: 'red',
                title: 'Something went wrong!',
                message: data
            })
        } else {
            cb(status, data)
        }
    })
}

export function CommonGameData(cb) {
    socket.on('common-game-data', (status, data) => {
        if (status == "ERROR" && Date.now() - errorTime.CommonGameData > 1000) {
            errorTime.CommonGameData = Date.now()
            showNotification({
                variant: 'outline',
                color: 'red',
                title: 'Something went wrong!',
                message: data
            })
        } else {
            cb(status, data)
        }
    })
}

export function CardsInHand(cb) {
    socket.on('cards-in-hand', (status, data) => {
        if (status == "ERROR" && Date.now() - errorTime.CardsInHand > 1000) {
            errorTime.CardsInHand = Date.now()
            showNotification({
                variant: 'outline',
                color: 'red',
                title: 'Something went wrong!',
                message: data
            })
        } else {
            cb(status, data)
        }
    })
}

export function Reactions(cb) {
    socket.on('reactions', (status, data) => {
        if (status == "ERROR" && Date.now() - errorTime.Reactions > 1000) {
            errorTime.Reactions = Date.now()
            showNotification({
                variant: 'outline',
                color: 'red',
                title: 'Something went wrong!',
                message: data
            })
        } else {
            console.log(status);
            cb(status, data)
        }
    })
}