`use strict`

import mongoose from 'mongoose'

const Game = new mongoose.Schema({
    players: [mongoose.Types.ObjectId],
    spectators: [mongoose.Types.ObjectId],
    waiting: [mongoose.Types.ObjectId],
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
    isRoundComplete: {
        type: Boolean,
        required: true,
        default: false
    },
    canPlayersDeclare: {
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
    lastPlayedTime: {
        type: String,
        required: true
    },
    lastPlayedAction: {
        type: String,
        required: true
    },
    roundsComplete: {
        type: Number,
        required: true,
        default: 0
    },
    maxScore: {
        type: Number,
        required: true,
        default: 100,
        min: 100
    },
    endWithPair: {
        type: Number,
        required: true,
        default: -25,
        max: 0
    },
    wrongCall: {
        type: Number,
        required: true,
        default: 50,
        min: 0
    },
    createdAt : {
        type : Date,
        default : Date.now,
    }
}, { versionKey: false })

export default mongoose.model('game', Game)
