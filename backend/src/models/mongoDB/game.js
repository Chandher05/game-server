`use strict`

import mongoose from 'mongoose'

const Game = new mongoose.Schema({
    users: [mongoose.Types.ObjectId],
    isStarted: {
        type: Boolean,
        required: true
    }
}, { versionKey: false })

export default mongoose.model('game', Game)
