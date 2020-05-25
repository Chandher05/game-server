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
    userName: {
        type: String,
        required: true
    },
    currentCards: [Number],
    score: {
        type: Number,
        default: 0
    },
    roundScores: [Number],
    isAlive: {
        type: Boolean,
        default: true
    }
}, { versionKey: false })

export default mongoose.model('gameMember', GameMember)
