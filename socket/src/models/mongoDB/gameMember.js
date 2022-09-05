`use strict`

import mongoose from 'mongoose'

const GameMember = new mongoose.Schema({
    gameId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    gamerId: {
        type: String,
        required: true
    },
    currentCards: [Number],
    score: {
        type: Number,
        default: 0
    },
    roundScores: [Number],
    isEliminated: {
        type: Boolean,
        default: false
    },
    didPlayerLeave: {
        type: Boolean,
        default: false
    }
}, { versionKey: false })

export default mongoose.model('gameMember', GameMember)
