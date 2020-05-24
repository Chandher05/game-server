`use strict`

import mongoose from 'mongoose'

const Game = new mongoose.Schema({
    players: [mongoose.Types.ObjectId],
    isStarted: {
        type: Boolean,
        required: true,
        default: false
    },
    isEnded: {
        type: Boolean,
        required: true,
        default: false
    },
    gameId: {
        type: String,
        required: true
    },
    createdUser: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    currentPlayer: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    cardsInDeck: [Number],
    openedCards: [Number],
    previousDroppedCards: [Number],
    previousDroppedPlayer: {
        type: String,
        required: true
    },
}, { versionKey: false })

export default mongoose.model('game', Game)
