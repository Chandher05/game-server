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
    }
}, { versionKey: false })

export default mongoose.model('game', Game)
